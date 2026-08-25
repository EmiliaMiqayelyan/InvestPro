export function redactContactInfo(text: string): { text: string; blocked: boolean } {
  const patterns: { re: RegExp; replacement: string }[] = [
    { re: /\b[\w.+-]+@[\w-]+\.[\w.]+\b/gi, replacement: "[contact hidden]" },
    { re: /\b(?:\+?\d[\d\s().-]{7,}\d)\b/g, replacement: "[contact hidden]" },
    { re: /https?:\/\/[^\s]+/gi, replacement: "[link hidden]" },
    { re: /(?:www\.)[^\s]+/gi, replacement: "[link hidden]" },
    { re: /(?:discord\.gg|discord\.com\/invite)\/\S+/gi, replacement: "[app hidden]" },
    { re: /t\.me\/\S+/gi, replacement: "[app hidden]" },
    { re: /wa\.me\/\S+|whatsapp\.me\/\S+/gi, replacement: "[app hidden]" },
    { re: /(?:^|[\s])@[a-zA-Z0-9_]{3,}/g, replacement: " [handle hidden]" },
    {
      re: /\b(?:whatsapp|telegram|signal|skype|wechat|discord)\b/gi,
      replacement: "[app hidden]",
    },
    {
      re: /\b(?:call me|email me|text me|dm me|contact me at|message me at)\b/gi,
      replacement: "[contact request hidden]",
    },
  ];

  let blocked = false;
  let cleaned = text;
  for (const { re, replacement } of patterns) {
    // Reset lastIndex for global regexes before test+replace
    re.lastIndex = 0;
    if (re.test(cleaned)) blocked = true;
    re.lastIndex = 0;
    cleaned = cleaned.replace(re, replacement);
  }
  return { text: cleaned, blocked };
}
