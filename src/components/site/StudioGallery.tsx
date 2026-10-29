import studioLifting from "@/assets/studio-lifting.jpg.asset.json";
import studioActionIzzy from "@/assets/studio-action-izzy.jpg.asset.json";
import studioLiftingAnaline from "@/assets/studio-lifting-analine.jpg.asset.json";
import studioLiftingDev from "@/assets/studio-lifting-dev.jpg.asset.json";
import studioMobilityAnaline from "@/assets/studio-mobility-analine.jpg.asset.json";
import studioMobilityDev from "@/assets/studio-mobility-dev.jpg.asset.json";
import appTracking from "@/assets/app-workout-tracking.png.asset.json";
import appAnalytics from "@/assets/app-progress-analytics.png.asset.json";
import appRecipes from "@/assets/app-recipe-guide.png.asset.json";

const studioShots = [
  { img: studioLifting.url, label: "1:1 Strength Training" },
  { img: studioActionIzzy.url, label: "Strength & Conditioning" },
  { img: studioLiftingAnaline.url, label: "Dumbbell Strength Work" },
  { img: studioLiftingDev.url, label: "Barbell Training" },
  { img: studioMobilityAnaline.url, label: "Mobility & Movement" },
  { img: studioMobilityDev.url, label: "Core & Pilates" },
];

const appShots = [
  { img: appTracking.url, label: "Workout Tracking" },
  { img: appAnalytics.url, label: "Progress Analytics" },
  { img: appRecipes.url, label: "Custom Recipe Guide" },
];

export function StudioGallery() {
  return (
    <>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside The Workout Plant</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {studioShots.map(({ img, label }) => (
              <figure key={label}>
                <img
                  src={img}
                  alt={label}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl border border-border object-cover transition-colors hover:border-primary/60"
                />
                <figcaption className="mt-3 text-sm font-semibold">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside The Workout Plant App</h3>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {appShots.map(({ img, label }) => (
              <figure key={label}>
                <img
                  src={img}
                  alt={`${label} — The Workout Plant App`}
                  loading="lazy"
                  className="phone-shadow mx-auto aspect-[9/19] w-full max-w-[280px] rounded-3xl border-2 border-border bg-secondary object-cover transition-colors hover:border-primary/60"
                />
                <figcaption className="mt-4 text-center text-sm font-semibold">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
    </>
  );
}
