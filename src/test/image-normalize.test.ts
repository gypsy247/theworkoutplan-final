import { describe, it, expect } from "vitest";
import { createEditorDraft, normalizeImages, validateDraft } from "@/lib/admin-content";

describe("image fields never block publishing", () => {
  it("accepts data URLs and proxy paths, fills empty images", () => {
    const d = createEditorDraft();
    d.site.studioPhotos[0]!.image = "data:image/jpeg;base64,AAA";
    d.site.studioPhotos[1]!.image = "/.netlify/functions/admin-publish?action=image&path=x";
    d.site.trainers[0]!.image = "";
    expect(validateDraft(d)).toBeNull();
    const s = normalizeImages(d.site);
    expect(s.studioPhotos[0]!.image).toBe("data:image/jpeg;base64,AAA");
    expect(s.studioPhotos[1]!.image).toContain("/.netlify/functions/");
    expect(s.trainers[0]!.image).toBe("/images/trainer-izzy-boxing.jpg");
  });
});
