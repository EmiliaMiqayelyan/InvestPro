import { v4 as uuidv4 } from "uuid";
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
import { dispatchNotificationEvent } from "../notifications/service";
import { sendNewMessageNotice } from "../../shared/integrations/email";
import type { TokenPayload } from "../../shared/utils/jwt";

function authUserObj(auth: TokenPayload) {
  return {
    role: auth.role,
    membershipTier: auth.membershipTier,
    membershipExpiresAt: auth.membershipExpiresAt,
  };
}

export async function listConversations(auth: TokenPayload) {
  let where: Record<string, unknown> = {};
  if (auth.role === "investor") where = { investorId: auth.sub };
  else if (auth.role === "project_owner") where = { ownerId: auth.sub };
  const rows = await ConversationModel.findAll({ where });
  const list = rows.map(toConversation);
  list.sort((a, b) => (b.lastMessageAt || "").localeCompare(a.lastMessageAt || ""));
  return list;
}

export async function createConversation(
  auth: TokenPayload,
  body: { projectId: string; investorId?: string }
) {
  if (!canMessage(authUserObj(auth))) {
    throw AppError.forbidden("Platform service access required to message");
  }
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

export async function listMessages(auth: TokenPayload, conversationId: string) {
  const conversation = await ConversationModel.findByPk(conversationId);
  if (!conversation) throw AppError.notFound("Conversation not found");
  const allowed =
    auth.role === "admin" ||
    auth.sub === conversation.investorId ||
    auth.sub === conversation.ownerId;
  if (!allowed) throw AppError.forbidden();
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
    (conversation.isAdminThread || conversation.investorId === auth.sub);
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

  const recipientId =
    auth.sub === conversation.investorId ? conversation.ownerId : conversation.investorId;
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
