/**
 * Frontend email stub. Production mail is sent by the Express API (server/).
 */

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean }> {
  if (process.env.NODE_ENV !== "production") {
    console.info("[email:dev]", payload.to, payload.subject, payload.text.slice(0, 200));
  }
  return { ok: true };
}

export async function sendServiceFeeReceipt(to: string, amount: number) {
  return sendEmail({
    to,
    subject: "XS Invest — Platform service fee receipt",
    text: `Your platform service access is active. Amount: $${amount}. This is a platform fee, not investment capital.`,
  });
}

export async function sendNewMessageNotice(to: string, projectTitle: string) {
  return sendEmail({
    to,
    subject: "XS Invest — New message",
    text: `You have a new on-platform message about "${projectTitle}". Sign in to reply — do not share external contact details.`,
  });
}
