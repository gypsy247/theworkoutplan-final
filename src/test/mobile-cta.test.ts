import { describe, expect, it } from "vitest";
import { shouldShowMobileCta } from "@/lib/mobile-cta";

describe("mobile sticky CTA scroll threshold", () => {
  it("stays hidden at the top", () => { expect(shouldShowMobileCta(0)).toBe(false); });
  it("stays hidden at exactly 300px", () => { expect(shouldShowMobileCta(300)).toBe(false); });
  it("appears only after 300px", () => { expect(shouldShowMobileCta(301)).toBe(true); });
});