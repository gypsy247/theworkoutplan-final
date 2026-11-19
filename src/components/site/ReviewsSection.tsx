import { BadgeCheck, ExternalLink, MapPin, Phone } from "lucide-react";
import { useLiveContent } from "@/lib/live-content";
import { GoogleG, MAP_EMBED, MAPS_URL, Stars } from "./brand";

const dist = [
  { s: 5, p: 96 },
  { s: 4, p: 4 },
  { s: 3, p: 0 },
  { s: 2, p: 0 },
  { s: 1, p: 0 },
];

const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("");

export function ReviewsSection() {
  const { site } = useLiveContent();
  const reviews = site.reviews;
  const widgetScript = site.reviewsWidgetScript;
  return (
    <section id="reviews" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            The Proof Is In The Pudding… Rated <span className="text-primary">4.9<span className="text-accent">★</span></span> on Google Maps
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Real Williamsburg clients. Real transformations. Verified on Google Business Profile.</p>
        </div>

        <div id="map" className="mt-12 mb-8 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="card-surface min-w-0 p-6 md:p-8 lg:col-span-5">
            <div className="flex items-start gap-3">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-secondary"><GoogleG className="h-6 w-6" /></span>
              <div className="min-w-0">
                <h3 className="font-extrabold">The Workout Plant</h3>
                <p className="flex items-center gap-1 text-sm text-muted-foreground"><MapPin className="h-3 w-3" /> 139 Frost St, Brooklyn, NY 11211</p>
                <a href="tel:+19179922395" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Phone className="h-3 w-3" /> +1 917-992-2395</a>
              </div>
            </div>
            <div className="mt-8 flex items-center gap-4">
              <span className="font-display text-6xl font-extrabold">4.9</span>
              <div>
                <Stars className="text-2xl" />
                <p className="text-sm text-muted-foreground">70+ Verified Google Reviews</p>
              </div>
            </div>
            <div className="mt-6 space-y-2">
              {dist.map((d) => (
                <div key={d.s} className="flex items-center gap-3 text-sm">
                  <span className="w-6 text-muted-foreground">{d.s}★</span>
                  <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                    <div className="h-full rounded-full bg-primary" style={{ width: `${d.p}%` }} />
                  </div>
                  <span className="w-10 text-right text-muted-foreground">{d.p}%</span>
                </div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-bold text-primary-foreground">
                See All 70+ Reviews on Google <ExternalLink className="h-4 w-4" />
              </a>
              <a href={MAPS_URL} target="_blank" rel="noreferrer" className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-border px-4 py-3 text-sm font-semibold hover:border-primary/60">
                Leave Us a Google Review <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div className="relative min-h-[340px] overflow-hidden rounded-2xl border border-border bg-card lg:col-span-7">
            <iframe title="The Workout Plant on Google Maps" src={MAP_EMBED} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-background/90 px-4 py-3 text-sm font-semibold backdrop-blur-md transition hover:border-primary/50">
              📍 139 Frost St, Williamsburg, Brooklyn • Private Studio • <span className="text-primary">Get Directions →</span>
            </a>
          </div>
        </div>

        {widgetScript ? (
          <div className="mt-8" dangerouslySetInnerHTML={{ __html: widgetScript }} />
        ) : (
          <div className="mobile-stack-grid mx-auto grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
            {reviews.map((r) => (
              <article key={`${r.name}-${r.date}`} className="card-surface flex w-full min-w-0 flex-col p-5 md:p-8">
                <div className="flex items-center gap-3">
                  {r.avatarUrl ? <img src={r.avatarUrl} alt={r.name} loading="lazy" referrerPolicy="no-referrer" className="h-11 w-11 shrink-0 rounded-full object-cover" /> : <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary/15 font-bold text-primary">{r.initials || initials(r.name)}</span>}
                  <div className="min-w-0">
                    <p className="truncate font-bold">{r.name}</p>
                    <p className="flex items-center gap-1 text-xs text-muted-foreground"><BadgeCheck className="h-3 w-3 shrink-0 text-primary" /> {r.tag} • {r.date}</p>
                  </div>
                  <GoogleG className="ml-auto h-5 w-5 shrink-0" />
                </div>
                <Stars className="mt-4 text-lg" />
                <p className="mt-3 leading-relaxed text-muted-foreground">"{r.text}"</p>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
