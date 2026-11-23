import { BadgeCheck, ExternalLink } from "lucide-react";
import { useLiveContent } from "@/lib/live-content";
import { GoogleG, MAPS_URL, Stars } from "./brand";

const initials = (n: string) => n.split(" ").map((w) => w[0]).slice(0, 2).join("");

export function ReviewsSection() {
  const { site } = useLiveContent();
  const reviews = site.reviews;
  return (
    <section id="reviews" className="px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            What our Williamsburg clients say
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">4.9 ★ across 70+ verified Google Reviews.</p>
        </div>

        <div className="mobile-stack-grid mx-auto mt-10 grid max-w-5xl grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
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
        <div className="mt-8 text-center"><a href={MAPS_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline underline-offset-4">Read the reviews on Google <ExternalLink className="h-4 w-4" /></a></div>
      </div>
    </section>
  );
}
