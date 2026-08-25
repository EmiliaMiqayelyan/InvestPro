import { describe, it, expect } from "vitest";
import { redactContactInfo } from "../src/shared/utils/redact";

describe("redactContactInfo", () => {
  it("redacts emails and phones", () => {
    const { text, blocked } = redactContactInfo("Email me at a@b.com or +1 555 123 4567");
    expect(blocked).toBe(true);
    expect(text).not.toContain("a@b.com");
    expect(text).toContain("[contact hidden]");
  });

  it("redacts links and messaging apps", () => {
    const { text, blocked } = redactContactInfo("Join https://t.me/foo on telegram");
    expect(blocked).toBe(true);
    expect(text).toContain("[link hidden]");
    expect(text.toLowerCase()).toContain("[app hidden]");
  });

  it("leaves clean text alone", () => {
    const { text, blocked } = redactContactInfo("Happy to discuss terms on-platform.");
    expect(blocked).toBe(false);
    expect(text).toBe("Happy to discuss terms on-platform.");
  });
});
