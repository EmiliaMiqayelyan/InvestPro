import { v4 as uuidv4 } from "uuid";
import { Op } from "sequelize";
import {
  ConversationModel,
  MessageModel,
  ProjectModel,
  UserModel,
} from "../../shared/database/associations";
import { AppError } from "../../shared/errors/AppError";
import { toConversation, toMessage } from "../../shared/utils/mappers";
import { canMessage } from "../../shared/utils/rbac";
import { redactContactInfo } from "../../shared/utils/redact";
import { logActivity } from "../../shared/utils/activity";
import { dispatchNotificationEvent, markMessageNotificationsReadForConversation } from "../notifications/service";
import { sendNewMessageNotice } from "../../shared/integrations/email";
import { ensureAdminOwnerConversation } from "../owner/service";
import type { TokenPayload } from "../../shared/utils/jwt";
import type { Conversation, Project } from "../../shared/types";

function authUserObj(auth: TokenPayload) {
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

function displayName(user: { firstName: string; lastName: string } | null | undefined, fallback: string) {
  if (!user) return fallback;
  return `${user.firstName} ${user.lastName}`.trim() || fallback;
}

function resolveMessageRecipientId(
  conversation: { investorId: string; ownerId: string; isAdminThread?: boolean; projectId: string },
  senderId: string
) {
  if (senderId === conversation.investorId) return conversation.ownerId;
  if (senderId === conversation.ownerId) return conversation.investorId;
  if (conversation.isAdminThread) {
    return conversation.projectId.startsWith("support:investor:")
      ? conversation.investorId
      : conversation.ownerId;
  }
  return conversation.ownerId;
}

function assertCanAccessConversation(
  auth: TokenPayload,
  conversation: ConversationModel
) {
  const isAdminParticipant =
    auth.role === "admin" &&
    (conversation.isAdminThread ||
      conversation.investorId === auth.sub ||
      conversation.ownerId === auth.sub);
  const allowed =
    auth.role === "admin" ||
    auth.sub === conversation.investorId ||
    auth.sub === conversation.ownerId ||
    isAdminParticipant;
  if (!allowed) throw AppError.forbidden();
  return isAdminParticipant;
}

export async function listConversations(auth: TokenPayload) {
  let where: Record<string, unknown> = {};
  if (auth.role === "investor") {
    where = { investorId: auth.sub };
  } else if (auth.role === "project_owner") {
    where = { ownerId: auth.sub };
  } else if (auth.role === "admin") {
    where = {
      [Op.or]: [
        { isAdminThread: true },
        { investorId: auth.sub },
        { ownerId: auth.sub },
      ],
    };
  }
  const rows = await ConversationModel.findAll({ where });
  const list = await Promise.all(
    rows.map(async (row) => {
      const dto = toConversation(row);
      if (!dto.unreadCount) return dto;
      const last = await MessageModel.findOne({
        where: { conversationId: row.id },
        order: [["createdAt", "DESC"]],
        attributes: ["senderId"],
      });
      // Don't show unread badge for messages the viewer sent
      if (last && last.senderId === auth.sub) {
        return { ...dto, unreadCount: 0 };
      }
      return dto;
    })
  );
  list.sort((a, b) => (b.lastMessageAt || "").localeCompare(a.lastMessageAt || ""));
  return list;
}

async function ensureAdminInvestorConversation(
  adminId: string,
  investorId: string
): Promise<Conversation> {
  const supportProjectId = `support:investor:${investorId}`;
  const existing = await ConversationModel.findOne({
    where: {
      projectId: supportProjectId,
      investorId,
      isAdminThread: true,
    },
  });
  if (existing) return toConversation(existing);

  const admin = await UserModel.findByPk(adminId);
  const investor = await UserModel.findByPk(investorId);
  if (!investor || investor.role !== "investor") {
    throw AppError.badRequest("Target user must be an investor");
  }

  const row = await ConversationModel.create({
    id: uuidv4(),
    projectId: supportProjectId,
    projectTitle: "Platform support",
    investorId,
    investorName: displayName(investor, "Investor"),
    ownerId: adminId,
    ownerName: displayName(admin, "Platform Admin"),
    isAdminThread: true,
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
  });
  return toConversation(row);
}

async function ensureAdminOwnerSupportConversation(
  adminId: string,
  ownerId: string,
  projectId?: string
): Promise<Conversation> {
  if (projectId) {
    const project = await ProjectModel.findByPk(projectId);
    if (!project) throw AppError.notFound("Project not found");
    if (project.ownerId !== ownerId) {
      throw AppError.badRequest("Project does not belong to this owner");
    }
    return ensureAdminOwnerConversation(toProjectCompat(project) as Project, adminId);
  }

  const owned = await ProjectModel.findOne({
    where: { ownerId },
    order: [["updatedAt", "DESC"]],
  });
  if (owned) {
    return ensureAdminOwnerConversation(toProjectCompat(owned) as Project, adminId);
  }

  const supportProjectId = `support:owner:${ownerId}`;
  const existing = await ConversationModel.findOne({
    where: { projectId: supportProjectId, isAdminThread: true },
  });
  if (existing) return toConversation(existing);

  const admin = await UserModel.findByPk(adminId);
  const owner = await UserModel.findByPk(ownerId);
  if (!owner || owner.role !== "project_owner") {
    throw AppError.badRequest("Target user must be a project owner");
  }

  const row = await ConversationModel.create({
    id: uuidv4(),
    projectId: supportProjectId,
    projectTitle: "Platform support",
    investorId: adminId,
    investorName: displayName(admin, "Platform Admin"),
    ownerId,
    ownerName: displayName(owner, "Project Owner"),
    isAdminThread: true,
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
  });
  return toConversation(row);
}

function toProjectCompat(project: ProjectModel): Pick<Project, "id" | "title" | "ownerId" | "ownerName"> {
  return {
    id: project.id,
    title: project.title,
    ownerId: project.ownerId,
    ownerName: project.ownerName || undefined,
  };
}

export async function createConversation(
  auth: TokenPayload,
  body: { projectId?: string; investorId?: string; userId?: string }
) {
  if (auth.role === "admin") {
    const targetId = body.userId || body.investorId;
    if (!targetId) throw AppError.badRequest("userId required");
    if (targetId === auth.sub) throw AppError.badRequest("Cannot message yourself");

    const target = await UserModel.findByPk(targetId);
    if (!target) throw AppError.notFound("User not found");
    if (target.role === "admin") throw AppError.badRequest("Cannot message another admin here");

    if (target.role === "investor") {
      return ensureAdminInvestorConversation(auth.sub, target.id);
    }
    if (target.role === "project_owner") {
      return ensureAdminOwnerSupportConversation(auth.sub, target.id, body.projectId);
    }
    throw AppError.badRequest("Unsupported user role");
  }

  if (!canMessage(authUserObj(auth))) {
    throw AppError.forbidden("Platform service access required to message");
  }
  if (!body.projectId) throw AppError.badRequest("projectId required");

  const project = await ProjectModel.findByPk(body.projectId);
  if (!project) throw AppError.notFound("Project not found");

  const invId = auth.role === "investor" ? auth.sub : body.investorId;
  if (!invId) throw AppError.badRequest("investorId required");

  const existing = await ConversationModel.findOne({
    where: { projectId: body.projectId, investorId: invId, isAdminThread: false },
  });
  if (existing) return toConversation(existing);

  const investor = await UserModel.findByPk(invId);
  const owner = await UserModel.findByPk(project.ownerId);
  if (!investor || !owner) throw AppError.notFound("Participants not found");

  const row = await ConversationModel.create({
    id: uuidv4(),
    projectId: body.projectId,
    projectTitle: project.title,
    investorId: invId,
    investorName: `${investor.firstName} ${investor.lastName}`,
    ownerId: project.ownerId,
    ownerName: `${owner.firstName} ${owner.lastName}`,
    isAdminThread: false,
    lastMessage: null,
    lastMessageAt: null,
    unreadCount: 0,
  });
  return toConversation(row);
}

export async function markConversationRead(auth: TokenPayload, conversationId: string) {
  const conversation = await ConversationModel.findByPk(conversationId);
  if (!conversation) throw AppError.notFound("Conversation not found");
  assertCanAccessConversation(auth, conversation);

  const hadUnread = conversation.unreadCount > 0;
  if (hadUnread) {
    conversation.unreadCount = 0;
    await conversation.save();
  }

  const notificationsUpdated = await markMessageNotificationsReadForConversation(
    auth.sub,
    conversationId
  );

  return {
    conversation: toConversation(conversation),
    notificationsUpdated,
  };
}

export async function listMessages(auth: TokenPayload, conversationId: string) {
  const conversation = await ConversationModel.findByPk(conversationId);
  if (!conversation) throw AppError.notFound("Conversation not found");
  assertCanAccessConversation(auth, conversation);

  // Opening the chat marks it (and related notifications) as seen
  await markConversationRead(auth, conversationId);

  const msgs = await MessageModel.findAll({
    where: { conversationId },
    order: [["createdAt", "ASC"]],
  });
  return msgs.map(toMessage);
}

export async function sendMessage(
  auth: TokenPayload,
  conversationId: string,
  body: { content: string; attachmentUrl?: string; attachmentName?: string }
) {
  const conversation = await ConversationModel.findByPk(conversationId);
  if (!conversation) throw AppError.notFound("Conversation not found");

  const isAdminParticipant =
    auth.role === "admin" &&
    (conversation.isAdminThread ||
      conversation.investorId === auth.sub ||
      conversation.ownerId === auth.sub);
  const allowed =
    auth.sub === conversation.investorId ||
    auth.sub === conversation.ownerId ||
    isAdminParticipant;
  if (!allowed) throw AppError.forbidden();
  if (!isAdminParticipant && !canMessage(authUserObj(auth))) {
    throw AppError.forbidden("Platform service access required");
  }

  const { getSystemSettings } = await import("../admin/service");
  const settings = await getSystemSettings();
  const shouldBlockContact = settings.contactBlocking !== false;
  const { text, blocked } = shouldBlockContact
    ? redactContactInfo(body.content || "")
    : { text: body.content || "", blocked: false };
  if (!text.trim() && !body.attachmentUrl) throw AppError.badRequest("Message required");

  const sender = await UserModel.findByPk(auth.sub);
  if (!sender) throw AppError.notFound("User not found");

  const message = await MessageModel.create({
    id: uuidv4(),
    conversationId,
    senderId: auth.sub,
    senderName: `${sender.firstName} ${sender.lastName}`,
    senderRole: sender.role,
    content: text,
    attachmentUrl: body.attachmentUrl ?? null,
    attachmentName: body.attachmentName ?? null,
    isFlagged: blocked,
  });

  conversation.lastMessage = text.slice(0, 120);
  conversation.lastMessageAt = new Date();
  conversation.unreadCount += 1;
  await conversation.save();

  const convDto = toConversation(conversation);
  const msgDto = toMessage(message);

  if (blocked) {
    await logActivity(auth.sub, "contact_info_blocked", "message", message.id);
    await dispatchNotificationEvent({
      kind: "contact_blocked",
      conversation: convDto,
      senderId: auth.sub,
      senderName: msgDto.senderName,
    });
  }
  await dispatchNotificationEvent({
    kind: "message_sent",
    conversation: convDto,
    message: msgDto,
  });

  const recipientId = resolveMessageRecipientId(conversation, auth.sub);
  const recipient = await UserModel.findByPk(recipientId);
  if (recipient?.email) {
    void sendNewMessageNotice(recipient.email, conversation.projectTitle);
  }

  return {
    message: msgDto,
    notice: blocked
      ? "Message sent. External contact details were removed for security."
      : undefined,
  };
}
