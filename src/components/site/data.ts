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
  description: string;
  features: string[];
  badge?: string;
  featured?: boolean;
};

export const TIERS: Tier[] = [
  {
    id: "izzy",
    name: "1:1 Personal Training — Head Coach Izzy",
    price: 170,
    description: "One-on-one training session with Head Trainer/Coach, Izzy Jacobus. Includes nutrition and health coaching + Full App access.",
    features: ["Advanced strength & kickboxing", "Nutrition & health coaching", "Full Workout Plant App access"],
  },
  {
    id: "analine",
    name: "1:1 Personal Training — Trainer Analine",
    price: 115,
    badge: "MOST POPULAR",
    featured: true,
    description: "One-on-one strength & mobility training session. Includes nutrition and health coaching with Coach Izzy + Full App access.",
    features: ["1:1 strength & mobility", "Nutrition coaching with Coach Izzy", "Full Workout Plant App access"],
  },
  {
    id: "dev",
    name: "1:1 Personal Training — Jr. Trainer Dev",
    price: 95,
    badge: "BEST VALUE",
    description: "One-on-one strength & conditioning session. Includes nutrition and health coaching + Full App access.",
    features: ["1:1 strength & conditioning", "Nutrition & health coaching", "Full Workout Plant App access"],
  },
  {
    id: "virtual",
    name: "1:1 Virtual Session w/ Coach Izzy",
    price: 150,
    description: "Live 1-on-1 remote personal training and nutrition coaching from anywhere.",
    features: ["Live remote 1-on-1 training", "Nutrition coaching", "Train from anywhere"],
  },
];

export const BOOKING_RULES = { sessionMinutes: 60, rescheduleHours: 48, noShowMinutes: 15, shortenedSessionMinutes: 10, refundsAllowed: false };

export const POLICIES = {
  firstTimers: "If this is your first session, send a message to introduce yourself and let us know if you have any limitations, concerns, or questions—or if you'd like a brief phone consultation.",
  attire: "Wear something comfortable and bring a water bottle. No shoes in the studio! We provide towels and everything else you'll need.",
  cancellation: `No refunds. Reschedule up to ${BOOKING_RULES.rescheduleHours} hours before your session. No-shows are charged the full session amount.`,
  late: `Arrivals ${BOOKING_RULES.noShowMinutes}+ minutes late are charged in full. Arrivals ${BOOKING_RULES.shortenedSessionMinutes}+ minutes late may result in a shortened session.`,
  philosophy: "Our evidence-based foundation: 2–4 strength sessions per week using compound movements (1–2 reps from failure), paired with ~0.7g of protein per pound of goal bodyweight.",
};
