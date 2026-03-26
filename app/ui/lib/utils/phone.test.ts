import { describe, it, expect } from "vitest";
import { parsePhone, validatePhone, formatPhone } from "./phone";

describe("parsePhone", () => {
  it("parses a 9-digit local number", () => {
    expect(parsePhone("622123456")).toBe("+224622123456");
  });

  it("parses with +224 prefix", () => {
    expect(parsePhone("+224622123456")).toBe("+224622123456");
  });

  it("parses with 00224 prefix", () => {
    expect(parsePhone("00224622123456")).toBe("+224622123456");
  });

  it("strips spaces", () => {
    expect(parsePhone("622 12 34 56")).toBe("+224622123456");
  });

  it("strips dashes", () => {
    expect(parsePhone("622-12-34-56")).toBe("+224622123456");
  });

  it("returns null for too-short number", () => {
    expect(parsePhone("62212")).toBeNull();
  });

  it("returns null for too-long number", () => {
    expect(parsePhone("6221234567890")).toBeNull();
  });

  it("returns null for non-mobile prefix", () => {
    expect(parsePhone("522123456")).toBeNull();
  });

  it("returns null for empty string", () => {
    expect(parsePhone("")).toBeNull();
  });
});

describe("validatePhone", () => {
  it("returns true for valid phone", () => {
    expect(validatePhone("622123456")).toBe(true);
  });

  it("returns false for invalid phone", () => {
    expect(validatePhone("abc")).toBe(false);
  });
});

describe("formatPhone", () => {
  it("formats a valid number", () => {
    expect(formatPhone("+224622123456")).toBe("+224 622 12 34 56");
  });

  it("returns original string for invalid input", () => {
    expect(formatPhone("invalid")).toBe("invalid");
  });
});
