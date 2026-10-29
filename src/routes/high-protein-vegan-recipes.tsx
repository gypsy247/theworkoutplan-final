import { pageHead } from "@/lib/site-seo";
import { createFileRoute } from "@tanstack/react-router";
import { RECIPE_CATEGORIES } from "@/components/site/content";

export const Route = createFileRoute("/high-protein-vegan-recipes")({
  head: () => pageHead("/high-protein-vegan-recipes", "THE PLANTS: Recipe Guide | The Workout Plant", "High-protein and low calorie, fitness-focused, plant-based recipes and nutrition guides by The Workout Plant in Williamsburg, Brooklyn.", "article"),
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
