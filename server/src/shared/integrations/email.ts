import { logger } from "../logger";
import { env } from "../../app/config/env";

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean }> {
  if (!env.SMTP_HOST) {
    if (env.NODE_ENV !== "production") {
      logger.info({ to: payload.to, subject: payload.subject }, "[email:dev]");
    }
    return { ok: true };
  }
  logger.info({ to: payload.to, subject: payload.subject }, "[email]");
  return { ok: true };
}

export async function sendServiceFeeReceipt(to: string, amount: number) {
  return sendEmail({
    to,
    subject: "InvestPro — Platform service fee receipt / Ծառայավճարի անդորրագիր",
    text: `Your platform service access is active. Amount: $${amount}. This is a platform fee, not investment capital.`,
  });
}

export async function sendNewMessageNotice(to: string, projectTitle: string) {
  return sendEmail({
    to,
    subject: "InvestPro — New message / Նոր հաղորդագրություն",
    text: `You have a new on-platform message about "${projectTitle}". Sign in to reply — do not share external contact details.`,
  });
}
