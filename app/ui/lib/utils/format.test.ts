import { describe, it, expect } from "vitest";
import { formatGNF, formatNumber } from "./format";

describe("formatGNF", () => {
  it("formats zero", () => {
    const result = formatGNF(0);
    expect(result).toContain("0");
    // Currency symbol may be "GNF" or "FG" depending on ICU data
    expect(result).toMatch(/GNF|FG/);
  });

  it("formats a typical amount", () => {
    const result = formatGNF(5000);
    expect(result).toMatch(/5[\s.,\u202f]?000/);
    expect(result).toMatch(/GNF|FG/);
  });

  it("formats a large amount with grouping", () => {
    const result = formatGNF(1000000);
    expect(result).toMatch(/1[\s.,\u202f]?000[\s.,\u202f]?000/);
  });

  it("formats negative amounts", () => {
    const result = formatGNF(-5000);
    expect(result).toContain("5");
    expect(result).toMatch(/-/);
  });
});

describe("formatNumber", () => {
  it("formats without currency symbol", () => {
    const result = formatNumber(5000);
    expect(result).toMatch(/5[\s.,\u202f]?000/);
    expect(result).not.toMatch(/GNF/);
  });

  it("formats zero", () => {
    expect(formatNumber(0)).toBe("0");
  });
});
