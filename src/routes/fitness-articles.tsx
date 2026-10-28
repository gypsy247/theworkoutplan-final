import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ARTICLES, type Article } from "@/components/site/content";

export const Route = createFileRoute("/fitness-articles")({
  head: () => ({
    meta: [
      { title: "Evidence-Based Fitness Articles by Izzy Jacobus | The Workout Plant" },
      { name: "description", content: "Articles on recovery, nutrition, smoothies and why diets don't work, by Head Coach Izzy Jacobus." },
      { property: "og:title", content: "Fitness Articles by Izzy Jacobus" },
      { property: "og:description", content: "Evidence-based articles on recovery, nutrition and sustainable habits." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: ArticlesPage,
});

function ArticlesPage() {
  const [active, setActive] = useState<Article | null>(null);
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Articles</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Evidence-Based Articles</h1>
        <p className="mt-4 text-lg text-muted-foreground">By Head Coach Izzy Jacobus.</p>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {ARTICLES.map((a) => (
            <article key={a.slug} className="card-surface flex flex-col p-8">
              <h2 className="text-xl font-extrabold tracking-tight">{a.title}</h2>
              <p className="mt-3 flex-1 text-muted-foreground">{a.summary}</p>
              <button onClick={() => setActive(a)} className="mt-6 self-start rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground hover:opacity-90">Read Article</button>
            </article>
          ))}
        </div>
      </div>
      <Dialog open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">{active?.title}</DialogTitle>
            <DialogDescription>By Izzy Jacobus</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 leading-relaxed text-muted-foreground">
            {active?.body.map((p) => <p key={p}>{p}</p>)}
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
