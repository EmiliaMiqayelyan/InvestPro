import { v4 as uuidv4 } from "uuid";
import { ActivityLogModel } from "../database/associations";

export async function logActivity(
  userId: string,
  action: string,
  entityType: string,
  entityId?: string,
  metadata?: Record<string, unknown>
): Promise<void> {
  await ActivityLogModel.create({
    id: uuidv4(),
    userId,
    action,
    entityType,
    entityId: entityId ?? null,
    metadata: metadata ?? null,
  });
}
