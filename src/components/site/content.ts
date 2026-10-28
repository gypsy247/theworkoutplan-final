export const RECIPE_CATEGORIES = [
  { name: "Breakfast", items: ["Tofu Scramble Bites", "Daily Freezer-Prep Green Smoothie (banana, apple, spinach, kale, cucumber, flax + 70/30 pea-rice protein blend)", "Tofu \"Egg\" Salad"] },
  { name: "Lunch", items: ["Shredded Tofu Lettuce Wraps", "Quinoa Salad", "Tofu Hiyayakko (Dark Soy or Peanut Sauce)", "Three Bean Chili", "Shiitake Bacon Fall Salad", "Chickpea Salad", "Butternut Squash Soup"] },
  { name: "Dinner", items: ["Hot Buddha Bowl w/ Dual Sauces", "Blackened Tofu", "TVP Shepherd's Pie", "Watermelon Tuna Poke Bowl", "Lentil Veggie Soup", "Falafel Bowl"] },
  { name: "Extras & Guides", items: ["Tofu Ricotta", "Shiitake Mushroom Bacon", "Vegan Ceviche", "Spicy Asian Fried Tofu", "G-BOMBS Nutritarian Guide", "The 3 Essential Supplements (Vitamin B12, Vitamin D, Omega-3)"] },
];

export type Article = { slug: string; title: string; summary: string; body: string[] };

export const ARTICLES: Article[] = [
  {
    slug: "recovery-gap",
    title: "The Recovery Gap: If You Feel Better, You Move Better",
    summary: "Why recovery is the missing link in progress, featuring our recovery collaboration with Press Modern Massage.",
    body: [
      "Training is the stimulus, but recovery is where results are built. When muscles stay tight and sore, movement quality drops, and so does the quality of every rep you do.",
      "That's why we partnered with Press Modern Massage: targeted recovery work helps you show up to each session moving well, so you can keep loading progressively and safely.",
      "Simple rule: if you feel better, you move better, and if you move better, you get better results.",
    ],
  },
  {
    slug: "fitness-equation",
    title: "Balancing the Fitness Equation: Are You Missing the Keys?",
    summary: "Why, how and where you eat, plus sleep and recovery, matter as much as your workouts.",
    body: [
      "Workouts are one part of the equation. Why you eat, how you eat, and where you eat shape your habits as much as what's on the plate.",
      "Sleep and recovery complete the picture. Without them, even a perfect program stalls.",
      "Balance all the keys and the results follow.",
    ],
  },
  {
    slug: "smoothie-multivitamin",
    title: "A Smoothie Is the Only Multi-Vitamin Supplement I Ever Recommend",
    summary: "Whole-food bioavailability and how to prep the 70/30 pea-rice protein smoothie.",
    body: [
      "Nutrients from whole foods come packaged with fiber and compounds that help your body absorb and use them, something a pill can't copy.",
      "Our daily freezer-prep green smoothie combines banana, apple, spinach, kale, cucumber and flax with a 70/30 pea-rice protein blend for a complete amino acid profile.",
      "Prep the produce in freezer bags for the week, then just add liquid and protein and blend.",
    ],
  },
  {
    slug: "why-diets-dont-work",
    title: "Why DIETS DON'T WORK and What to Do Instead",
    summary: "Set Point Theory, Constrained Energy Expenditure, and sustainable habit change.",
    body: [
      "Set Point Theory suggests the body defends a familiar weight range, pushing back against aggressive restriction.",
      "Constrained Energy Expenditure shows that the body adapts its total energy use, so more exercise or less food doesn't add up the way the math promises.",
      "Instead of short-term diets, build sustainable habits: consistent strength training, adequate protein, and food choices you can keep for life.",
    ],
  },
];
