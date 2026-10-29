import { describe, expect, it } from "vitest";
import { getArticle } from "@/data/articles";
import { LEGACY_REDIRECTS } from "@/lib/legacy-urls";
import { GYM_SCHEMA, pageHead } from "@/lib/site-seo";

describe("Indexed URL compatibility", () => {
  it.each([
    ["/group-personal-training", "/book-a-session"],
    ["/onbeat-pilates", "/book-a-session"],
    ["/articles", "/fitness-articles"],
  ] as const)("redirects %s to %s", (source, destination) => {
    expect(LEGACY_REDIRECTS[source]).toBe(destination);
  });
  it.each([
    "the-recovery-gap-if-you-feel-better-you-move-better",
    "balancing-the-equation-are-you-missing-the-keys",
    "a-smoothie-is-the-only-multivitamin-supplement-i-ever-recommend",
    "why-diets-dont-work",
    "3-big-reasons-to-learn-kickboxing",
    "how-to-get-yourself-to-drink-more-water",
  ])("resolves indexed article %s", (slug) => {
    expect(getArticle(slug)?.slug).toBe(slug);
    expect(getArticle(slug)?.content.length).toBeGreaterThan(100);
  });
  it("self-references the requested canonical domain", () => {
    expect(pageHead("/membership", "Membership", "Account").links).toEqual([
      { rel: "canonical", href: "https://www.theworkoutplant.com/membership" },
    ]);
  });
});

describe("Owner-supplied business data", () => {
  it("opens daily at 6 AM and closes at 9 PM", () => {
    expect(GYM_SCHEMA.openingHours).toBe("Mo-Su 06:00-21:00");
  });
  it("reports the supplied 4.9 rating", () => {
    expect(GYM_SCHEMA.aggregateRating.ratingValue).toBe("4.9");
  });
  it("reports the supplied 70 reviews", () => {
    expect(GYM_SCHEMA.aggregateRating.reviewCount).toBe("70");
  });
});