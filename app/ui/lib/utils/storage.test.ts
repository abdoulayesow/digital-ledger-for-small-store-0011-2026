import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { safeGetItem, safeSetItem } from "./storage";

describe("safeGetItem", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns the stored value", () => {
    vi.mocked(localStorage.getItem).mockReturnValue("hello");
    expect(safeGetItem("key")).toBe("hello");
  });

  it("returns null when key does not exist", () => {
    vi.mocked(localStorage.getItem).mockReturnValue(null);
    expect(safeGetItem("missing")).toBeNull();
  });

  it("returns null when localStorage throws", () => {
    vi.mocked(localStorage.getItem).mockImplementation(() => {
      throw new Error("SecurityError");
    });
    expect(safeGetItem("key")).toBeNull();
  });
});

describe("safeSetItem", () => {
  beforeEach(() => {
    vi.stubGlobal("localStorage", {
      getItem: vi.fn(),
      setItem: vi.fn(),
    });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("calls localStorage.setItem", () => {
    safeSetItem("key", "value");
    expect(localStorage.setItem).toHaveBeenCalledWith("key", "value");
  });

  it("does not throw when localStorage throws", () => {
    vi.mocked(localStorage.setItem).mockImplementation(() => {
      throw new Error("QuotaExceededError");
    });
    expect(() => safeSetItem("key", "value")).not.toThrow();
  });
});
