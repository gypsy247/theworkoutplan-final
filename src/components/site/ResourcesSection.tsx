import { Link } from "@tanstack/react-router";
import { ARTICLES, RECIPE_CATEGORIES } from "./content";

export function ResourcesSection() {
  return (
    <section id="resources" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Resources</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Recipes & Evidence-Based Articles</h2>
        </div>
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-8">
            <h3 className="text-2xl font-extrabold tracking-tight">THE PLANTS: High-Protein Vegan Recipes</h3>
            <div className="mt-4 grid grid-cols-2 gap-2">
              {RECIPE_CATEGORIES.map((c) => (
                <span key={c.name} className="rounded-lg border border-border bg-secondary px-3 py-2 text-sm font-semibold">{c.name} · {c.items.length}</span>
              ))}
            </div>
            <Link to="/high-protein-vegan-recipes" className="mt-6 inline-block font-bold text-primary hover:underline">View the recipe guide →</Link>
          </div>
          <div className="card-surface p-8">
            <h3 className="text-2xl font-extrabold tracking-tight">Articles by Izzy Jacobus</h3>
            <ul className="mt-4 space-y-2 text-sm text-muted-foreground">
              {ARTICLES.map((a) => <li key={a.slug} className="ml-5 list-disc">{a.title}</li>)}
            </ul>
            <Link to="/fitness-articles" className="mt-6 inline-block font-bold text-primary hover:underline">Read the articles →</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
