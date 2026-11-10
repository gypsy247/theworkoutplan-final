import { MapPin } from "lucide-react";
import { useLiveContent } from "@/lib/live-content";
import { MAPS_URL } from "./brand";
import { resolveImageUrl } from "@/lib/image-tools";
import { facilityImageUrl } from "@/lib/homepage-media";

export function FacilityBanner() {
  const facilityImage = facilityImageUrl(useLiveContent().site);
  return (
    <section id="facility" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Our Williamsburg Facility</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">139 Frost St — Private, Never Crowded</h2>
          <p className="mt-4 text-lg text-muted-foreground">A full private training floor, reserved one client at a time.</p>
        </div>
        <div className="relative mt-12 overflow-hidden rounded-3xl border border-border">
          {facilityImage ? (
            <img src={resolveImageUrl(facilityImage)} alt="139 Frost St Private Training Studio" loading="lazy" className="max-h-[520px] w-full rounded-lg object-cover" />
          ) : (
            <div className="grid aspect-[21/9] w-full place-items-center bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1),transparent_70%)] bg-secondary">
              <p className="text-sm font-bold uppercase tracking-widest text-muted-foreground">Panoramic studio photo coming soon</p>
            </div>
          )}
          <a href={MAPS_URL} target="_blank" rel="noreferrer" className="absolute inset-x-4 bottom-4 rounded-xl border border-border bg-background/90 px-4 py-3 text-sm font-semibold backdrop-blur-md transition hover:border-primary/50">
            <MapPin className="mr-1 inline h-4 w-4 text-primary" /> 139 Frost St, Williamsburg, Brooklyn • <span className="text-primary">Get Directions →</span>
          </a>
        </div>
      </div>
    </section>
  );
}
