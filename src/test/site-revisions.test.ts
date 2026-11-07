import { describe, expect, it } from "vitest";
import siteContent from "@/data/siteContent.json";
import { TIERS } from "@/components/site/data";
import { membershipHead } from "@/routes/membership";

describe("Client revisions", () => {
  it("hides the promo banner by default and keeps it BOGO-free", () => {
    expect(siteContent.promoBanner.enabled).toBe(false);
    expect(JSON.stringify(siteContent)).not.toMatch(/bogo|buy one get one/i);
  });
  it("uses the non-promo hero CTA", () => {
    expect(siteContent.hero.primaryCta).toBe("Book Your Intro Session");
  });
  it("gives every pricing tier equal visual weight", () => {
    expect(TIERS.every((tier) => !tier.featured)).toBe(true);
    expect(TIERS.every((tier) => !tier.badge)).toBe(true);
  });
  it("shows at least six Google-style reviews with dates and tags", () => {
    expect(siteContent.reviews.length).toBeGreaterThanOrEqual(6);
    for (const review of siteContent.reviews) {
      expect(review.date.trim()).not.toBe("");
      expect(review.tag.trim()).not.toBe("");
    }
  });
  it("categorizes every studio photo for the gallery filters", () => {
    for (const photo of siteContent.studioPhotos) {
      expect(["clients", "space"]).toContain(photo.category);
    }
  });
  it("keeps the editable media fields present for the Studio Manager", () => {
    expect(siteContent).toHaveProperty("trainingVideoUrl");
    expect(siteContent).toHaveProperty("facilityImage");
    expect(siteContent).toHaveProperty("reviewsWidgetScript");
  });
  it("noindexes the private membership page", () => {
    expect(membershipHead().meta).toContainEqual({ name: "robots", content: "noindex, nofollow" });
  });
});
