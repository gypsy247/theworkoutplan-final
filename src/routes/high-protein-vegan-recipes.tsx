import { createFileRoute } from "@tanstack/react-router";
import { RECIPE_CATEGORIES } from "@/components/site/content";

export const Route = createFileRoute("/high-protein-vegan-recipes")({
  head: () => ({
    meta: [
      { title: "THE PLANTS: High-Protein Vegan Recipe Guide | The Workout Plant" },
      { name: "description", content: "High-protein plant-based breakfast, lunch, dinner and extras from The Workout Plant coaching system in Williamsburg, Brooklyn." },
      { property: "og:title", content: "THE PLANTS: High-Protein Vegan Recipes" },
      { property: "og:description", content: "Tofu scrambles, green smoothies, Buddha bowls, TVP shepherd's pie and more, built for strength training." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: RecipesPage,
});

function RecipesPage() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Recipes</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">THE PLANTS: High-Protein Vegan Recipe Guide</h1>
        <p className="mt-4 text-lg text-muted-foreground">Included in our coaching system and The Workout Plant App.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {RECIPE_CATEGORIES.map((c) => (
            <article key={c.name} className="card-surface p-8">
              <h2 className="text-2xl font-extrabold tracking-tight">{c.name}</h2>
              <ul className="mt-4 space-y-2 text-muted-foreground">
                {c.items.map((i) => <li key={i} className="ml-5 list-disc">{i}</li>)}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
