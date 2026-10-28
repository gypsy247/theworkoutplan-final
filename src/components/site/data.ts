export const EMAIL = "izzy@theworkoutplant.com";

export const SOCIALS = {
  instagram: "https://www.instagram.com/theworkoutplant/",
  facebook: "https://www.facebook.com/TheWorkoutPlant/",
  tiktok: "https://www.tiktok.com/@theworkoutplant",
};

export type Tier = {
  id: string;
  name: string;
  price: number;
  features: string[];
  badge?: string;
  featured?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "izzy",
    name: "1:1 w/ Head Trainer (Izzy)",
    price: 170,
    features: ["Advanced strength & kickboxing", "Deep nutritional counseling", "Full App + Travel workouts", "Direct 1:1 messaging"],
  },
  {
    id: "analine",
    name: "1:1 w/ Trainer (Analine)",
    price: 115,
    badge: "MOST POPULAR",
    featured: true,
    features: ["Strength + HIT Mat Pilates & mobility", "Habit & nutrition coaching", "Full App access", "BOGO eligible"],
  },
  {
    id: "dev",
    name: "1:1 w/ Jr. Trainer (Dev)",
    price: 95,
    badge: "BEST VALUE",
    features: ["1-on-1 private studio strength", "Inferno Pilates conditioning", "Full App access", "BOGO eligible"],
  },
  {
    id: "group",
    name: "Small Group Session",
    price: 75,
    features: ["Small group personal training", "On-beat mat Pilates", "Mats & cool towels provided", "Individualized form correction"],
  },
];
