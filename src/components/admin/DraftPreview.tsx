import { useState } from "react";
import { Monitor, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { EditorDraft } from "@/lib/admin-content";

type Viewport = { id: "desktop" | "mobile"; label: string; width: number; icon: typeof Monitor };
const viewports: Viewport[] = [
  { id: "desktop", label: "Desktop", width: 1280, icon: Monitor },
  { id: "mobile", label: "Mobile", width: 375, icon: Smartphone },
];

// Renders the unsaved draft with the site's own typography so owners see edits instantly.
export function DraftPreview({ draft, onClose }: { draft: EditorDraft; onClose: () => void }) {
  const [viewport, setViewport] = useState<Viewport>(viewports[0]!);
  const site = draft.site;
  const categories = site.galleryCategories;
  const shots = [
    ...site.studioPhotos.map((photo) => ({ ...photo, group: photo.category === "space" ? categories.space : categories.clients })),
    ...site.appScreenshots.map((photo) => ({ ...photo, group: categories.app })),
  ];
  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background/95 backdrop-blur-sm">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-5 py-3">
        <p className="text-sm font-bold">Live Preview <span className="ml-2 text-xs font-medium text-muted-foreground">unsaved draft</span></p>
        <div className="flex items-center gap-2">
          {viewports.map((option) => (
            <Button key={option.id} variant={viewport.id === option.id ? "secondary" : "ghost"} size="sm" onClick={() => setViewport(option)} aria-pressed={viewport.id === option.id}>
              <option.icon className="h-4 w-4" />{option.label} ({option.width}px)
            </Button>
          ))}
          <Button variant="ghost" size="icon" aria-label="Close preview" onClick={onClose}><X /></Button>
        </div>
      </div>
      <div className="flex-1 overflow-auto p-4 md:p-8">
        <div className="mx-auto overflow-hidden rounded-xl border border-border bg-background shadow-2xl" style={{ width: viewport.width, maxWidth: "100%" }}>
          <div className="space-y-16 px-6 py-12">
            <section className="text-center">
              {site.promoBanner.enabled && <p className="mb-6 rounded-md bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">{site.promoBanner.text}</p>}
              <p className="inline-block rounded-full border border-border px-4 py-2 text-sm text-muted-foreground">★ {site.studioInfo.rating} · {site.hero.badgeText}</p>
              <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-tight md:text-6xl">{site.hero.headlineStart} <span className="text-primary">{site.hero.headlineHighlight}</span> {site.hero.headlineEnd}</h1>
              <p className="mx-auto mt-5 max-w-xl text-muted-foreground">{site.hero.subheadline}</p>
              <div className="mt-7 flex flex-wrap justify-center gap-3">
                <span className="rounded-xl bg-primary px-7 py-3 font-bold text-primary-foreground">{site.hero.primaryCta}</span>
                <span className="rounded-xl border border-border px-7 py-3 font-bold">{site.hero.secondaryCta}</span>
              </div>
            </section>
            <section>
              <p className="text-center text-sm font-bold uppercase tracking-widest text-primary">{site.thePlan.badge}</p>
              <h2 className="mt-2 text-center text-3xl font-extrabold">{site.thePlan.headline}</h2>
              <p className="mx-auto mt-3 max-w-xl text-center text-muted-foreground">{site.thePlan.intro}</p>
              <p className="mx-auto mt-3 max-w-xl text-center text-sm font-semibold">{site.thePlan.philosophy}</p>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {site.pillars.map((pillar) => (
                  <article key={pillar.number} className="rounded-lg border border-border bg-card p-6">
                    <p className="text-2xl font-extrabold text-border">{pillar.number}</p>
                    <h3 className="mt-3 font-extrabold">{pillar.title}</h3>
                    <p className="mt-2 text-sm text-muted-foreground">{pillar.description}</p>
                    {pillar.tags.length > 0 && <div className="mt-4 flex flex-wrap gap-2">{pillar.tags.map((tag) => <span key={tag} className="rounded-md border border-border bg-secondary px-2 py-1 text-xs font-semibold">{tag}</span>)}</div>}
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-center text-3xl font-extrabold">Pricing</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                {site.pricingTiers.map((tier) => (
                  <article key={tier.id} className="rounded-lg border border-border bg-card p-5">
                    <h3 className="font-extrabold">{tier.name}</h3>
                    <p className="mt-3 text-3xl font-extrabold">${Number.isFinite(tier.price) ? tier.price : "—"}<span className="text-sm font-medium text-muted-foreground"> / {tier.duration}</span></p>
                    <p className="mt-2 text-sm text-muted-foreground">{tier.description}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-center text-3xl font-extrabold">Trainers</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {site.trainers.map((trainer, index) => (
                  <article key={index} className="rounded-lg border border-border bg-card p-5 text-center">
                    <img src={trainer.image} alt={trainer.name} className="mx-auto h-24 w-24 rounded-full object-cover" />
                    <h3 className="mt-4 font-extrabold">{trainer.name}</h3>
                    <p className="text-xs font-semibold text-primary">{trainer.role}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{trainer.bio}</p>
                  </article>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-center text-3xl font-extrabold">Gallery</h2>
              <p className="mt-2 text-center text-sm text-muted-foreground">{[categories.clients, categories.space, categories.app].join(" · ")}</p>
              <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
                {shots.map((shot, index) => (
                  <figure key={index}>
                    <img src={shot.image} alt={shot.caption} className="aspect-[4/3] w-full rounded-lg border border-border object-cover" />
                    <figcaption className="mt-2 text-xs font-semibold">{shot.caption} <span className="text-muted-foreground">· {shot.group}</span></figcaption>
                  </figure>
                ))}
              </div>
            </section>
            <section>
              <h2 className="text-center text-3xl font-extrabold">Reviews</h2>
              <div className="mt-8 grid gap-4 md:grid-cols-3">
                {site.reviews.map((review, index) => (
                  <article key={index} className="rounded-lg border border-border bg-card p-5">
                    <p className="text-accent">{"★".repeat(review.rating)}</p>
                    <p className="mt-2 text-sm text-muted-foreground">{review.text}</p>
                    <p className="mt-3 text-sm font-bold">{review.name} <span className="font-medium text-muted-foreground">· {review.date}</span></p>
                  </article>
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}
