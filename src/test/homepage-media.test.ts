import { describe, expect, it } from "vitest";
import { FACILITY_IMAGE_MAX, FACILITY_IMAGE_QUALITY, FACILITY_KEYS, facilityImageUrl, readVideoUpload, getVideoEmbedInfo, normalizeVideoUrl } from "@/lib/homepage-media";
import { createEditorDraft, serializeExports } from "@/lib/admin-content";
import { sanitizeSite } from "@/lib/image-tools";

describe("homepage media", () => {
  it("normalizes missing schemes while preserving supported prefixes and blanks", () => {
    for (const raw of ["youtube.com/watch?v=dQw4w9WgXcQ", "youtu.be/dQw4w9WgXcQ", "vimeo.com/123456", "example.com/clip.mp4"]) expect(normalizeVideoUrl(` ${raw} `)).toBe(`https://${raw}`);
    for (const raw of ["", "https://example.com/clip.mp4", "http://example.com/clip.mov", "/videos/clip.webm", "data:video/mp4;base64,AAAA"]) expect(normalizeVideoUrl(raw)).toBe(raw);
  });
  it.each(["youtube.com/watch?v=dQw4w9WgXcQ&ab_channel=Studio", "youtu.be/dQw4w9WgXcQ?t=12", "youtube.com/shorts/dQw4w9WgXcQ?feature=share", "youtube.com/embed/dQw4w9WgXcQ"]) ("embeds schemeless YouTube URL %s and returns its canonical fallback", raw => {
    expect(getVideoEmbedInfo(raw)).toEqual({ kind: "embed", provider: "youtube", src: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0", openUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
  });
  it("requires an eleven-character YouTube ID and never treats provider pages as video files", () => {
    for (const url of ["youtube.com/watch?v=short", "youtube.com/shorts/dQw4w9WgXcQextra", "example.com/watch", "notyoutube.com/watch?v=dQw4w9WgXcQ"]) expect(getVideoEmbedInfo(url).kind).toBe("unsupported");
    expect(getVideoEmbedInfo(" ").kind).toBe("empty");
  });
  it("recognizes schemeless Vimeo and preserves unlisted video access", () => {
    expect(getVideoEmbedInfo("vimeo.com/123456").src).toBe("https://player.vimeo.com/video/123456");
    expect(getVideoEmbedInfo("vimeo.com/123456/secret").src).toBe("https://player.vimeo.com/video/123456?h=secret");
  });
  it("uses HTML5 video only for direct files including query strings and data URLs", () => {
    for (const url of ["example.com/clip.mp4?token=abc", "http://example.com/clip.mov", "/clip.webm", "data:video/webm;base64,AAAA"]) expect(getVideoEmbedInfo(url)).toEqual({ kind: "file", src: normalizeVideoUrl(url), openUrl: normalizeVideoUrl(url) });
  });
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
    for (const url of ["https://youtube.com/watch?v=dQw4w9WgXcQ", "https://youtu.be/dQw4w9WgXcQ", "https://youtube.com/embed/dQw4w9WgXcQ", "https://youtube.com/shorts/dQw4w9WgXcQ"]) {
      expect(getVideoEmbedInfo(url)).toEqual({ kind: "embed", provider: "youtube", src: "https://www.youtube.com/embed/dQw4w9WgXcQ?rel=0", openUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" });
    }
  });
  it("converts Vimeo watch and embed URLs", () => {
    expect(getVideoEmbedInfo("https://vimeo.com/123456")).toEqual({ kind: "embed", provider: "vimeo", src: "https://player.vimeo.com/video/123456", openUrl: "https://vimeo.com/123456" });
    expect(getVideoEmbedInfo("https://player.vimeo.com/video/123456?h=secret").src).toContain("h=secret");
  });
  it("retains MP4 and MOV file URLs", () => {
    for (const src of ["/videos/training.mp4", "https://example.com/training.mov", "data:video/mp4;base64,AAAA"]) expect(getVideoEmbedInfo(src)).toEqual({ kind: "file", src, openUrl: src });
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