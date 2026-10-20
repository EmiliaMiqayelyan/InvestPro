import nodemailer from "nodemailer";
import { logger } from "../logger";
import { env } from "../../app/config/env";

export type EmailPayload = {
  to: string;
  subject: string;
  text: string;
  html?: string;
};

type MailTransport = ReturnType<typeof nodemailer.createTransport>;

let transporter: MailTransport | null = null;

function parseFrom(raw: string): { name?: string; email: string } {
  const match = raw.match(/^\s*(.+?)\s*<([^>]+)>\s*$/);
  if (match) {
    return { name: match[1].replace(/^["']|["']$/g, "").trim(), email: match[2].trim() };
  }
  return { email: raw.trim() };
}

function getSender() {
  const raw =
    env.BREVO_SENDER_EMAIL ||
    env.SMTP_FROM ||
    env.SMTP_USER ||
    "noreply@xsinvest.org";
  return parseFrom(raw);
}

function getTransporter(): MailTransport | null {
  if (!env.SMTP_HOST) return null;
  if (!transporter) {
    const port = Number(env.SMTP_PORT || 587);
    transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: port === 465,
      auth:
        env.SMTP_USER && env.SMTP_PASS
          ? { user: env.SMTP_USER, pass: env.SMTP_PASS }
          : undefined,
    });
  }
  return transporter;
}

async function sendViaBrevo(payload: EmailPayload): Promise<void> {
  const apiKey = env.BREVO_API_KEY!;
  const sender = getSender();
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/json",
      "api-key": apiKey,
    },
    body: JSON.stringify({
      sender: sender.name ? { name: sender.name, email: sender.email } : { email: sender.email },
      to: [{ email: payload.to }],
      subject: payload.subject,
      textContent: payload.text,
      htmlContent: payload.html || payload.text.replace(/\n/g, "<br>"),
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Brevo send failed (${res.status}): ${body.slice(0, 400)}`);
  }
}

async function sendViaSmtp(payload: EmailPayload): Promise<void> {
  const transport = getTransporter();
  if (!transport) {
    throw new Error("SMTP transport is not configured");
  }
  const sender = getSender();
  const from = sender.name ? `"${sender.name}" <${sender.email}>` : sender.email;
  await transport.sendMail({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html || payload.text.replace(/\n/g, "<br>"),
  });
}

export async function sendEmail(payload: EmailPayload): Promise<{ ok: boolean }> {
  const hasBrevo = Boolean(env.BREVO_API_KEY?.trim());
  const hasSmtp = Boolean(env.SMTP_HOST?.trim());

  if (!hasBrevo && !hasSmtp) {
    if (env.NODE_ENV !== "production") {
      logger.info(
        { to: payload.to, subject: payload.subject, text: payload.text },
        "[email:dev] Brevo/SMTP not configured — email logged only"
      );
    } else {
      logger.warn(
        { to: payload.to, subject: payload.subject },
        "[email] Brevo/SMTP not configured — email skipped"
      );
    }
    return { ok: true };
  }

  if (hasBrevo) {
    await sendViaBrevo(payload);
    logger.info({ to: payload.to, subject: payload.subject, provider: "brevo" }, "[email] sent");
    return { ok: true };
  }

  await sendViaSmtp(payload);
  logger.info({ to: payload.to, subject: payload.subject, provider: "smtp" }, "[email] sent");
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
