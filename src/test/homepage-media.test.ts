import { describe, expect, it } from "vitest";
import { FACILITY_IMAGE_MAX, FACILITY_IMAGE_QUALITY, FACILITY_KEYS, facilityImageUrl, readVideoUpload, trainingVideoSource } from "@/lib/homepage-media";
import { createEditorDraft, serializeExports } from "@/lib/admin-content";
import { sanitizeSite } from "@/lib/image-tools";

describe("homepage media", () => {
  it("compresses facility photos with the requested 1600px and 0.80 settings", () => {
    expect(FACILITY_IMAGE_MAX).toBe(1600);
    expect(FACILITY_IMAGE_QUALITY).toBe(0.80);
  });
  for (const key of FACILITY_KEYS) it(`reads and persists ${key} as the facility photo`, () => {
    const draft = createEditorDraft();
    const site = { ...draft.site, facilityImage: "", [key]: "/images/studio.jpg" };
    expect(facilityImageUrl(site)).toBe("/images/studio.jpg");
    expect(sanitizeSite(site).facilityImage).toBe("/images/studio.jpg");
    draft.site = site;
    expect(JSON.parse(serializeExports(draft)[0]?.content || "{}").facilityImage).toBe("/images/studio.jpg");
  });
  it("converts YouTube watch, short and embed URLs", () => {
    for (const url of ["https://youtube.com/watch?v=abc123", "https://youtu.be/abc123", "https://youtube.com/embed/abc123", "https://youtube.com/shorts/abc123"]) {
      expect(trainingVideoSource(url)).toEqual({ kind: "embed", src: "https://www.youtube-nocookie.com/embed/abc123?autoplay=1" });
    }
  });
  it("converts Vimeo watch and embed URLs", () => {
    expect(trainingVideoSource("https://vimeo.com/123456")).toEqual({ kind: "embed", src: "https://player.vimeo.com/video/123456?autoplay=1" });
    expect(trainingVideoSource("https://player.vimeo.com/video/123456?h=secret").src).toContain("h=secret");
  });
  it("retains MP4 and MOV file URLs", () => {
    for (const src of ["/videos/training.mp4", "https://example.com/training.mov", "data:video/mp4;base64,AAAA"]) expect(trainingVideoSource(src)).toEqual({ kind: "file", src });
  });
  it("persists uploaded clips through JSON export", async () => {
    const draft = createEditorDraft();
    draft.site.trainingVideoUrl = await readVideoUpload(new File(["clip"], "training.mp4", { type: "video/mp4" }));
    expect(draft.site.trainingVideoUrl).toBe("data:video/mp4;base64,Y2xpcA==");
    expect(JSON.parse(serializeExports(draft)[0]?.content || "{}").trainingVideoUrl).toBe(draft.site.trainingVideoUrl);
  });
  it("rejects oversized clips with a hosted-link alternative", async () => {
    await expect(readVideoUpload(new File([new Uint8Array(3 * 1024 * 1024 + 1)], "training.mp4", { type: "video/mp4" }))).rejects.toThrow("paste a hosted video");
  });
});