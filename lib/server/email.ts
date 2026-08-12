/**
 * Email delivery stub for receipts / verify / notifications.
 * Configure SMTP_* env vars to enable; otherwise logs to console in development.
 */

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean }> {
  const host = process.env.SMTP_HOST;
  if (!host) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[email:dev]", payload.to, payload.subject, payload.text.slice(0, 120));
    }
    return { ok: true };
  }

  // Placeholder for nodemailer / Resend integration
  console.info("[email]", payload.to, payload.subject);
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
