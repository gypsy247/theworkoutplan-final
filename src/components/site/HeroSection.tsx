import { MapPin, Navigation, Star } from "lucide-react";
import { GoogleG, MAPS_URL, Stars } from "./brand";
import { useLiveContent } from "@/lib/live-content";
import { useBooking } from "./BookingModal";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  const { open } = useBooking();
  const { site } = useLiveContent();
  const HERO = site.hero;
  const SITE = site.studioInfo;
  const HERO_CTA_URL = site.hero.primaryCtaUrl;
  return (
    <section className="site-hero relative overflow-hidden px-5 py-8 text-center md:px-6 md:py-20">
      <div className="relative mx-auto max-w-7xl">
        <a href="#reviews" className="inline-flex flex-wrap items-center justify-center gap-2 rounded-full border border-border bg-card/90 px-4 py-2 text-sm transition hover:border-primary/60">
          <GoogleG className="h-4 w-4" />
          <span className="font-bold">{SITE.rating}</span> <Stars />
          <span className="text-muted-foreground">{HERO.badgeText}</span>
        </a>
        <h1 className="mx-auto mt-5 max-w-4xl font-extrabold">
          {HERO.headlineStart} <span className="text-primary">{HERO.headlineHighlight}</span> {HERO.headlineEnd}
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:mt-6 md:text-xl">
          {HERO.subheadline}
        </p>
        <div className="mt-5 flex flex-col justify-center gap-3 md:mt-8 md:flex-row">
          {HERO_CTA_URL ? (
            <Button asChild className="h-auto min-h-[52px] w-full whitespace-normal rounded-lg px-6 py-3 font-bold md:w-auto">
              <a href={HERO_CTA_URL} {...(HERO_CTA_URL.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>{HERO.primaryCta}</a>
            </Button>
          ) : (
            <Button onClick={() => open()} className="h-auto min-h-[52px] w-full whitespace-normal rounded-lg px-6 py-3 font-bold md:w-auto">
              {HERO.primaryCta}
            </Button>
          )}
          <Button asChild variant="outline" className="h-auto min-h-[52px] w-full whitespace-normal rounded-lg px-6 py-3 font-bold md:w-auto"><a href="#reviews">{HERO.secondaryCta}</a></Button>
        </div>

        <div className="mx-auto mt-8 grid max-w-3xl gap-4 rounded-lg border border-border bg-card p-4 text-left md:mt-10 md:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
          <div className="flex min-w-0 items-center gap-3">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary">
              <GoogleG className="h-7 w-7" />
            </span>
            <div className="min-w-0">
              <p className="font-display font-extrabold">{SITE.name}</p>
              <p className="text-sm"><span className="font-bold">{SITE.rating}</span> <Stars /> <span className="text-muted-foreground">({SITE.reviewCount} Google Reviews)</span></p>
              <p className="flex items-center gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3 w-3 shrink-0" /> Personal trainer in New York • {SITE.address}
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
