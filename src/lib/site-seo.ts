export const SITE_ORIGIN = "https://www.theworkoutplant.com";

export function pageHead(path: string, title: string, description: string, type = "website") {
  const url = `${SITE_ORIGIN}${path}`;
  return {
    meta: [
      { title },
      { name: "description", content: description },
      { property: "og:title", content: title },
      { property: "og:description", content: description },
      { property: "og:type", content: type },
      { property: "og:url", content: url },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: url }],
  };
}

export const GYM_SCHEMA = {
  "@context": "https://schema.org",
  "@type": ["ExerciseGym", "HealthAndBeautyBusiness"],
  "@id": `${SITE_ORIGIN}/#gym`,
  name: "The Workout Plant",
  url: `${SITE_ORIGIN}/`,
  telephone: "+1-917-992-2395",
  email: "izzy@theworkoutplant.com",
  address: {
    "@type": "PostalAddress",
    streetAddress: "139 Frost St",
    addressLocality: "Brooklyn",
    addressRegion: "NY",
    postalCode: "11211",
    addressCountry: "US",
  },
  openingHours: "Mo-Su 06:00-21:00",
  aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "70" },
  sameAs: [
    "https://www.instagram.com/theworkoutplant/",
    "https://www.facebook.com/TheWorkoutPlant/",
    "https://www.tiktok.com/@theworkoutplant",
  ],
};