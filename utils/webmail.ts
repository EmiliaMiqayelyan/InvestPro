const WEBMAIL_BY_DOMAIN: Record<string, string> = {
  "gmail.com": "https://mail.google.com/",
  "googlemail.com": "https://mail.google.com/",
  "outlook.com": "https://outlook.live.com/mail/",
  "hotmail.com": "https://outlook.live.com/mail/",
  "live.com": "https://outlook.live.com/mail/",
  "msn.com": "https://outlook.live.com/mail/",
  "yahoo.com": "https://mail.yahoo.com/",
  "ymail.com": "https://mail.yahoo.com/",
  "icloud.com": "https://www.icloud.com/mail",
  "me.com": "https://www.icloud.com/mail",
  "mac.com": "https://www.icloud.com/mail",
  "proton.me": "https://mail.proton.me/",
  "protonmail.com": "https://mail.proton.me/",
  "aol.com": "https://mail.aol.com/",
  "mail.ru": "https://e.mail.ru/",
  "yandex.com": "https://mail.yandex.com/",
  "yandex.ru": "https://mail.yandex.ru/",
};

/** Best-effort deep link into the user's webmail inbox from their address. */
export function getWebmailUrl(email?: string | null): string {
  const domain = email?.split("@")[1]?.trim().toLowerCase();
  if (!domain) return "https://mail.google.com/";
  return WEBMAIL_BY_DOMAIN[domain] ?? `https://${domain}`;
}
