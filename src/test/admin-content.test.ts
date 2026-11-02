import { describe, expect, it } from "vitest";
import { createArticle, createEditorDraft, isValidEditorPin, serializeExports, updateDraft, validateDraft } from "@/lib/admin-content";

describe("Studio content editor", () => {
  it("accepts only the requested four-digit PIN 1390", () => {
    expect(isValidEditorPin("1390")).toBe(true);
    for (const value of ["139", "13900", "0000", " 1390", "abcd"]) expect(isValidEditorPin(value)).toBe(false);
  });
  it("exports edited prices without mutating source content", () => {
    const original = createEditorDraft();
    const edited = updateDraft(original, ["site", "pricingTiers", 0, "price"], 175);
    expect(original.site.pricingTiers[0]?.price).toBe(170);
    const files = serializeExports(edited);
    expect(files.map((file) => file.filename)).toEqual(["siteContent.json", "articles.json"]);
    expect(JSON.parse(files[0]?.content ?? "{}").pricingTiers[0].price).toBe(175);
    expect(JSON.parse(files[1]?.content ?? "{}").articles).toHaveLength(6);
  });
  it("creates articles with unique usable slugs", () => {
    const articles = createEditorDraft().blog.articles;
    const first = createArticle(articles);
    const second = createArticle([...articles, first]);
    expect(first.slug).toBe("new-article");
    expect(second.slug).toBe("new-article-2");
  });
  it("rejects invalid prices, duplicate slugs and unsafe image URLs", () => {
    const original = createEditorDraft();
    expect(validateDraft(original)).toBeNull();
    expect(validateDraft(updateDraft(original, ["site", "pricingTiers", 0, "price"], -1))).not.toBeNull();
    expect(validateDraft(updateDraft(original, ["blog", "articles", 1, "slug"], original.blog.articles[0]?.slug))).not.toBeNull();
    expect(validateDraft(updateDraft(original, ["site", "studioInfo", "logoImage"], "javascript:alert(1)"))).not.toBeNull();
  });
  it("exports thirteen existing shared photo references", () => {
    const site = createEditorDraft().site;
    expect(1 + site.trainers.length + site.studioPhotos.length + site.appScreenshots.length).toBe(13);
  });
});
