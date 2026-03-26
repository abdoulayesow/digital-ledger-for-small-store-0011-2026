import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { getCustomerColor, getInitial, getDebtAge, getDebtAgeColor } from "./color";

describe("getCustomerColor", () => {
  it("returns a hex color string", () => {
    expect(getCustomerColor("Mamadou")).toMatch(/^#[A-F0-9]{6}$/);
  });

  it("is deterministic for the same name", () => {
    expect(getCustomerColor("Fatou")).toBe(getCustomerColor("Fatou"));
  });

  it("can produce different colors for different names", () => {
    const colors = new Set(["Mamadou", "Fatou", "Ibrahima", "Aissatou", "Oumar"].map(getCustomerColor));
    expect(colors.size).toBeGreaterThan(1);
  });
});

describe("getInitial", () => {
  it("returns first letter uppercase", () => {
    expect(getInitial("mamadou")).toBe("M");
  });

  it("trims whitespace", () => {
    expect(getInitial("  alpha")).toBe("A");
  });

  it("returns empty string for empty input", () => {
    expect(getInitial("")).toBe("");
  });
});

describe("getDebtAge", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-25T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns green for debt < 7 days old", () => {
    const date = new Date("2026-03-20T12:00:00Z"); // 5 days ago
    expect(getDebtAge(date)).toBe("green");
  });

  it("returns yellow for debt 7-13 days old", () => {
    const date = new Date("2026-03-15T12:00:00Z"); // 10 days ago
    expect(getDebtAge(date)).toBe("yellow");
  });

  it("returns red for debt >= 14 days old", () => {
    const date = new Date("2026-03-05T12:00:00Z"); // 20 days ago
    expect(getDebtAge(date)).toBe("red");
  });

  it("returns yellow at exactly 7 days", () => {
    const date = new Date("2026-03-18T12:00:00Z"); // exactly 7 days
    expect(getDebtAge(date)).toBe("yellow");
  });

  it("returns red at exactly 14 days", () => {
    const date = new Date("2026-03-11T12:00:00Z"); // exactly 14 days
    expect(getDebtAge(date)).toBe("red");
  });
});

describe("getDebtAgeColor", () => {
  it("returns green hex", () => {
    expect(getDebtAgeColor("green")).toBe("#22C55E");
  });

  it("returns yellow hex", () => {
    expect(getDebtAgeColor("yellow")).toBe("#EAB308");
  });

  it("returns red hex", () => {
    expect(getDebtAgeColor("red")).toBe("#EF4444");
  });
});
