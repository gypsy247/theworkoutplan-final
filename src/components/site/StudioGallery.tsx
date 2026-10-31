import siteContent from "@/data/siteContent.json";

const studioShots = siteContent.studioPhotos;
const appShots = siteContent.appScreenshots;

export function StudioGallery() {
  return (
    <>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside The Workout Plant</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {studioShots.map(({ image, caption }) => (
              <figure key={caption}>
                <img
                  src={image}
                  alt={caption}
                  loading="lazy"
                  className="aspect-[4/3] w-full rounded-2xl border border-border object-cover transition-colors hover:border-primary/60"
                />
                <figcaption className="mt-3 text-sm font-semibold">{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside The Workout Plant App</h3>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {appShots.map(({ image, caption }) => (
              <figure key={caption}>
                <img
                  src={image}
                  alt={`${caption} — The Workout Plant App`}
                  loading="lazy"
                  className="phone-shadow mx-auto aspect-[9/19] w-full max-w-[280px] rounded-3xl border-2 border-border bg-secondary object-cover transition-colors hover:border-primary/60"
                />
                <figcaption className="mt-4 text-center text-sm font-semibold">{caption}</figcaption>
              </figure>
            ))}
          </div>
        </div>
    </>
  );
}
