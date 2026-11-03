import { useState } from "react";
import { X } from "lucide-react";
import siteContent from "@/data/siteContent.json";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type Shot = { image: string; caption: string; category: string };

const studioShots: Shot[] = siteContent.studioPhotos;
const appShots: Shot[] = siteContent.appScreenshots.map((s) => ({ ...s, category: "app" }));
const allShots: Shot[] = [...studioShots, ...appShots];

const filters = [
  { id: "all", label: "All" },
  { id: "clients", label: "Clients Training" },
  { id: "space", label: "The 139 Frost St Space" },
  { id: "app", label: "The Workout Plant App" },
] as const;

export function StudioGallery() {
  const [filter, setFilter] = useState<(typeof filters)[number]["id"]>("all");
  const [lightbox, setLightbox] = useState<Shot | null>(null);
  const shots = filter === "all" ? allShots : allShots.filter((s) => s.category === filter);

  return (
    <div className="mt-20">
      <h3 className="text-2xl font-extrabold md:text-3xl">The Studio & Our Community in Action</h3>
      <p className="mt-3 text-muted-foreground">Real everyday people training inside our private Williamsburg studio.</p>
      <div className="mt-8 flex flex-wrap gap-2" role="tablist" aria-label="Gallery filters">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            role="tab"
            aria-selected={filter === f.id}
            onClick={() => setFilter(f.id)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition ${filter === f.id ? "border-primary bg-primary/15 text-primary" : "border-border text-muted-foreground hover:border-primary/50 hover:text-foreground"}`}
          >
            {f.label}
          </button>
        ))}
      </div>
      {shots.length === 0 ? (
        <p className="mt-10 rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">Photos for this space are coming soon.</p>
      ) : (
        <div className="mt-8 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          {shots.map((shot) => (
            <figure key={`${shot.image}-${shot.caption}`}>
              <button type="button" onClick={() => setLightbox(shot)} className="block w-full cursor-zoom-in" aria-label={`Enlarge photo: ${shot.caption}`}>
                <img
                  src={shot.image}
                  alt={shot.category === "app" ? `${shot.caption} — The Workout Plant App` : shot.caption}
                  loading="lazy"
                  className={
                    shot.category === "app"
                      ? "phone-shadow mx-auto aspect-[9/19] w-full max-w-[280px] rounded-3xl border-2 border-border bg-secondary object-cover transition-colors hover:border-primary/60"
                      : "aspect-[4/3] w-full rounded-2xl border border-border object-cover transition-colors hover:border-primary/60"
                  }
                />
              </button>
              <figcaption className={`mt-3 text-sm font-semibold ${shot.category === "app" ? "text-center" : ""}`}>{shot.caption}</figcaption>
            </figure>
          ))}
        </div>
      )}

      <Dialog open={Boolean(lightbox)} onOpenChange={(open) => { if (!open) setLightbox(null); }}>
        <DialogContent className="max-w-4xl border-border bg-background p-2 sm:p-4" showCloseButton={false}>
          <DialogTitle className="sr-only">{lightbox?.caption ?? "Gallery photo"}</DialogTitle>
          {lightbox && (
            <div className="relative">
              <img src={lightbox.image} alt={lightbox.caption} className="max-h-[80vh] w-full rounded-xl object-contain" />
              <p className="mt-3 text-center text-sm font-semibold">{lightbox.caption}</p>
              <button type="button" onClick={() => setLightbox(null)} aria-label="Close enlarged photo" className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full border border-border bg-background/90 transition hover:border-primary/60">
                <X className="h-4 w-4" />
              </button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
