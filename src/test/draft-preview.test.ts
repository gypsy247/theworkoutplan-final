import { describe, expect, it } from "vitest";
import { isDraftPreview, previewViewports } from "@/lib/draft-preview";

describe("Isolated draft preview", () => {
  it("uses the requested 375px mobile viewport", () => {
    expect(previewViewports.find(viewport => viewport.id === "mobile")?.width).toBe(375);
  });
  it("uses the requested 1280px desktop viewport", () => {
    expect(previewViewports.find(viewport => viewport.id === "desktop")?.width).toBe(1280);
  });
  it("recognizes each supported explicit preview query", () => {
    expect(isDraftPreview("?preview=draft")).toBe(true);
    expect(isDraftPreview("?preview=1")).toBe(true);
    expect(isDraftPreview("?adminPreview=true")).toBe(true);
    expect(isDraftPreview("?preview=published")).toBe(false);
    expect(isDraftPreview("")).toBe(false);
  });
});