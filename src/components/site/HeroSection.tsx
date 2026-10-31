import { MapPin, Navigation, Star } from "lucide-react";
import { GoogleG, MAPS_URL, Stars } from "./brand";
import { HERO, SITE } from "./data";
import { useBooking } from "./BookingModal";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { open } = useBooking();
  return (
    <section className="relative overflow-hidden px-6 py-24 text-center">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[480px] w-[720px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <a href="#reviews" className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm transition hover:border-primary/60">
          <GoogleG className="h-4 w-4" />
          <span className="font-bold">{SITE.rating}</span> <Stars />
          <span className="text-muted-foreground">{HERO.badgeText}</span>
        </a>
        <h1 className="mx-auto mt-6 max-w-4xl text-5xl font-extrabold leading-[1.08] tracking-tight md:text-7xl">
          {HERO.headlineStart} <span className="text-primary">{HERO.headlineHighlight}</span> {HERO.headlineEnd}
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground md:text-xl">
          {HERO.subheadline}
        </p>
        <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
          <Button onClick={() => open()} className="h-auto rounded-xl px-8 py-4 font-bold">
            {HERO.primaryCta}
          </Button>
          <a href="#reviews" className="rounded-xl border border-border bg-card px-8 py-4 font-bold transition hover:border-primary/50">
            {HERO.secondaryCta}
          </a>
        </div>

        <div className="mx-auto mt-10 flex max-w-3xl flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-card p-4 text-left shadow-2xl sm:flex-row sm:p-6">
          <div className="flex items-center gap-4">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary">
              <GoogleG className="h-7 w-7" />
            </span>
            <div>
              <p className="font-display font-extrabold">{SITE.name}</p>
              <p className="text-sm"><span className="font-bold">{SITE.rating}</span> <Stars /> <span className="text-muted-foreground">({SITE.reviewCount} Google Reviews)</span></p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3" /> Personal trainer in New York • {SITE.address}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <a href={MAPS_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary/50">
              <Navigation className="h-4 w-4" /> Directions
            </a>
            <a href="#reviews" className="inline-flex items-center gap-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground">
              <Star className="h-4 w-4" /> Read Reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
