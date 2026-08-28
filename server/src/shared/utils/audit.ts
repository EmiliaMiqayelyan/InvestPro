import { v4 as uuidv4 } from "uuid";
import { AuditLogModel } from "../database/associations";
import type { AuthedRequest } from "../../app/middleware";

export async function writeAuditLog(opts: {
  actorId?: string | null;
  action: string;
  entityType: string;
  entityId?: string | null;
  oldData?: Record<string, unknown> | null;
  newData?: Record<string, unknown> | null;
  req?: AuthedRequest;
}) {
  await AuditLogModel.create({
    id: uuidv4(),
    actorId: opts.actorId ?? null,
    action: opts.action,
    entityType: opts.entityType,
    entityId: opts.entityId ?? null,
    oldData: opts.oldData ?? null,
    newData: opts.newData ?? null,
    ipAddress: opts.req?.ip ?? (opts.req?.headers["x-forwarded-for"] as string) ?? null,
    userAgent: opts.req?.headers["user-agent"] ?? null,
  });
}
