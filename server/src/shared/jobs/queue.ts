import { v4 as uuidv4 } from "uuid";
import { JobQueueModel } from "../database/associations";
import { logger } from "../logger";
import { sendEmail } from "../integrations/email";
import { dispatchNotificationEvent } from "../../modules/notifications/service";

export type JobName =
  | "email"
  | "notification"
  | "kyc_processing"
  | "payment_reconciliation"
  | "return_calculation"
  | "scheduled_payout"
  | "report_generation"
  | "document_processing";

export async function enqueueJob(
  queue: JobName,
  payload: Record<string, unknown>,
  scheduledAt?: Date
) {
  await JobQueueModel.create({
    id: uuidv4(),
    queue,
    payload,
    status: "pending",
    attempts: 0,
    maxAttempts: 3,
    scheduledAt: scheduledAt ?? new Date(),
  });
}

async function processEmailJob(payload: Record<string, unknown>) {
  await sendEmail({
    to: payload.to as string,
    subject: payload.subject as string,
    text: payload.text as string,
    html: payload.html as string | undefined,
  });
}

async function processNotificationJob(payload: Record<string, unknown>) {
  await dispatchNotificationEvent(payload as Parameters<typeof dispatchNotificationEvent>[0]);
}

const handlers: Record<JobName, (payload: Record<string, unknown>) => Promise<void>> = {
  email: processEmailJob,
  notification: processNotificationJob,
  kyc_processing: async () => {
    /* placeholder for external KYC provider integration */
  },
  payment_reconciliation: async () => {
    /* placeholder for payment provider reconciliation */
  },
  return_calculation: async () => {
    /* placeholder for scheduled return calculation */
  },
  scheduled_payout: async () => {
    /* placeholder for scheduled payout processing */
  },
  report_generation: async () => {
    /* placeholder for report generation */
  },
  document_processing: async () => {
    /* placeholder for document OCR/verification */
  },
};

export async function processPendingJobs(batchSize = 10) {
  const jobs = await JobQueueModel.findAll({
    where: { status: "pending" },
    order: [["scheduledAt", "ASC"]],
    limit: batchSize,
  });

  for (const job of jobs) {
    const handler = handlers[job.queue as JobName];
    if (!handler) {
      job.status = "failed";
      job.error = `Unknown queue: ${job.queue}`;
      await job.save();
      continue;
    }

    try {
      await handler(job.payload);
      job.status = "completed";
      job.processedAt = new Date();
      await job.save();
    } catch (err) {
      job.attempts += 1;
      job.error = err instanceof Error ? err.message : String(err);
      if (job.attempts >= job.maxAttempts) {
        job.status = "failed";
      }
      await job.save();
      logger.error({ err, jobId: job.id }, "Job processing failed");
    }
  }
}

let workerInterval: ReturnType<typeof setInterval> | null = null;

export function startJobWorker(intervalMs = 5000) {
  if (workerInterval) return;
  workerInterval = setInterval(() => {
    processPendingJobs().catch((err) => logger.error({ err }, "Job worker error"));
  }, intervalMs);
}

export function stopJobWorker() {
  if (workerInterval) {
    clearInterval(workerInterval);
    workerInterval = null;
  }
}
