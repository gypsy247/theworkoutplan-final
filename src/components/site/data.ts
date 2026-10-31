import siteContent from "@/data/siteContent.json";

// All editable site content lives in src/data/siteContent.json so the CMS
// (Decap at /admin, or Pages CMS) can manage it. These exports keep existing
// imports working while reading from that single source of truth.

export const SITE = siteContent.studioInfo;
export const PROMO = siteContent.promoBanner;
export const HERO = siteContent.hero;

export const EMAIL = SITE.email;

export const SOCIALS = {
  instagram: SITE.instagramUrl,
  facebook: SITE.facebookUrl,
  tiktok: SITE.tiktokUrl,
};

export type Tier = {
  id: string;
  name: string;
  price: number;
  duration: string;
  description: string;
  features: string[];
  badge?: string;
  featured?: boolean;
};

export const TIERS: Tier[] = siteContent.pricingTiers.map((t) => ({
  id: t.id,
  name: t.name,
  price: t.price,
  duration: t.duration,
  description: t.description,
  features: t.features,
  ...(t.badge ? { badge: t.badge } : {}),
  featured: t.featured,
}));

export const BOOKING_RULES = { sessionMinutes: 60, rescheduleHours: 48, noShowMinutes: 15, shortenedSessionMinutes: 10, refundsAllowed: false };

export const POLICIES = siteContent.policies;
