import { MapPin, Navigation, Star } from "lucide-react";
import { GoogleG, MAPS_URL, Stars } from "./brand";
import { useLiveContent } from "@/lib/live-content";
import { Button } from "@/components/ui/button";

export function GoogleBusinessCard() {
  const SITE = useLiveContent().site.studioInfo;
  return (
    <div className="mx-auto grid max-w-3xl gap-4 rounded-lg border border-border bg-card p-4 text-left md:p-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
      <div className="flex min-w-0 items-center gap-3">
        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-secondary"><GoogleG className="h-7 w-7" /></span>
        <div className="min-w-0">
          <p className="font-display font-extrabold">{SITE.name}</p>
          <p className="text-sm"><span className="font-bold">{SITE.rating}</span> <Stars /> <span className="text-muted-foreground">({SITE.reviewCount} Google Reviews)</span></p>
          <p className="flex items-center gap-1 text-xs text-muted-foreground"><MapPin className="h-3 w-3 shrink-0" /> Personal trainer in New York • {SITE.address}</p>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 sm:flex sm:shrink-0">
        <Button asChild variant="outline" className="rounded-lg px-4 py-2 text-sm font-semibold"><a href={MAPS_URL} target="_blank" rel="noopener noreferrer"><Navigation className="h-4 w-4" /> Directions</a></Button>
        <Button asChild className="rounded-lg px-4 py-2 text-sm font-bold"><a href="#reviews"><Star className="h-4 w-4" /> Read Reviews</a></Button>
      </div>
    </div>
  );
}