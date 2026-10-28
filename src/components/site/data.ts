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
  schedule?: string;
};

export const TIERS: Tier[] = [
  {
    id: "izzy",
    name: "Individual Personal Training — Head Coach Izzy",
    price: 170,
    description: "1-on-1 session with Founder Izzy Jacobus. Includes nutrition & health coaching.",
    features: ["Advanced strength & kickboxing", "Nutrition & health coaching", "Full Workout Plant App access"],
  },
  {
    id: "virtual",
    name: "Virtual Session w/ Coach Izzy",
    price: 150,
    description: "Live 1-on-1 remote training & nutrition coaching from anywhere.",
    features: ["Live remote 1-on-1 training", "Nutrition coaching", "Train from anywhere"],
  },
  {
    id: "analine",
    name: "Individual Personal Training — Trainer Analine",
    price: 115,
    badge: "MOST POPULAR",
    featured: true,
    description: "1-hour strength training mixed with HIT Mat Pilates + nutrition/health coaching with Coach Izzy.",
    features: ["Strength + HIT Mat Pilates", "Nutrition coaching with Coach Izzy", "Full Workout Plant App access"],
  },
  {
    id: "dev",
    name: "Individual Personal Training — Junior Trainer Dev",
    price: 95,
    badge: "BEST VALUE",
    description: "1-hour strength training mixed with Mat/Inferno Pilates + nutrition/health coaching.",
    features: ["Strength + Mat/Inferno Pilates", "Nutrition & health coaching", "Full Workout Plant App access"],
  },
  {
    id: "group",
    name: "Group Personal Training (4 Person Max)",
    price: 75,
    description: "Train side-by-side with up to 3 other people while following your own individualized workout plan and progressive loading.",
    features: ["Individualized plan & progressive loading", "Full Workout Plant App access", "Nutrition coaching"],
    schedule: "Mondays at 7:00 PM & Wednesdays at 7:00 PM",
  },
];

export const POLICIES = {
  attire: "Wear something comfortable and bring a water bottle. No shoes in the studio—we provide mats, cool towels, and everything else you need.",
  cancellation: "No refunds. You may reschedule up to 48 hours before your session. No-shows are charged the full session amount.",
  late: "Arriving more than 15 minutes late is considered a no-show and charged in full. Arriving more than 10 minutes late may result in a shortened session.",
  philosophy: "Our evidence-based foundation: 2–4 strength sessions per week using compound movements (1–2 reps from failure), paired with ~0.7g of protein per pound of goal bodyweight.",
};
