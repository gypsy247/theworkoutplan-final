import { createFileRoute, Link } from "@tanstack/react-router";
import { ARTICLES } from "@/data/articles";

export const Route = createFileRoute("/fitness-articles")({
  head: () => ({
    meta: [
      { title: "Evidence-Based Fitness Articles by Izzy Jacobus | The Workout Plant" },
      {
        name: "description",
        content:
          "Full-length articles on recovery, nutrition, smoothies, kickboxing and why diets don't work, by Head Coach Izzy Jacobus.",
      },
      { property: "og:title", content: "Fitness Articles by Izzy Jacobus" },
      { property: "og:description", content: "Evidence-based articles on recovery, nutrition and sustainable habits." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/fitness-articles" },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: "/fitness-articles" }],
  }),
  component: ArticlesHub,
});

function ArticlesHub() {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-6xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Articles</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Evidence-Based Articles</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Full-length writing by Head Coach Izzy Jacobus on training, recovery, nutrition and mindset.
        </p>
        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {ARTICLES.map((a) => (
            <article key={a.slug} className="card-surface flex flex-col p-8">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full border border-primary/40 bg-primary/10 px-3 py-1 font-bold text-primary">
                  {a.category}
                </span>
                <span className="text-muted-foreground">
                  {a.date} · {a.readTime}
                </span>
              </div>
              <h2 className="mt-4 text-xl font-extrabold tracking-tight">{a.title}</h2>
              <p className="mt-3 flex-1 text-sm text-muted-foreground">{a.excerpt}</p>
              <Link
                to="/post/$slug"
                params={{ slug: a.slug }}
                className="mt-6 self-start rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90"
              >
                Read Full Article →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
