import { BookOpen, Dumbbell, LineChart, MessageCircle, Plane, Salad, UtensilsCrossed } from "lucide-react";
import { useLiveContent } from "@/lib/live-content";
import { StudioGallery } from "./StudioGallery";

const pillarIcons = [Dumbbell, Salad, MessageCircle];
const tagIcons = [LineChart, UtensilsCrossed, Plane, BookOpen];

export function ThePlanSection() {
  const { site } = useLiveContent();
  const THE_PLAN = site.thePlan;
  const pillars = site.pillars.map((p, i) => ({
    n: p.number,
    icon: pillarIcons[i] ?? Dumbbell,
    title: p.title,
    text: p.description,
    badges: p.tags.map((label, j) => ({ icon: tagIcons[j] ?? LineChart, label })),
  }));
  return (
    <section id="the-plan" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">{THE_PLAN.badge}</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            {THE_PLAN.headline}
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            {THE_PLAN.intro}
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">{THE_PLAN.philosophy}</p>
        </div>
        <div className="mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {pillars.map((p, i) => (
            <article key={p.n} className={`card-surface min-w-0 p-6 md:p-8 ${i === 2 ? "md:col-span-2 lg:col-span-1" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary">
                  <p.icon className="h-6 w-6" />
                </span>
                <span className="font-display text-3xl font-extrabold text-border">{p.n}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.text}</p>
              {p.badges.length > 0 && (
                <div className="mt-6 flex flex-wrap gap-2">
                  {p.badges.map((b) => (
                    <span
                      key={b.label}
                      className="inline-flex max-w-full items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold"
                    >
                      <b.icon className="h-4 w-4 shrink-0 text-primary" /> {b.label}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <StudioGallery />
      </div>
    </section>
  );
}
