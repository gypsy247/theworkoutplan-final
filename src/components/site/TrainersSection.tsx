import { useLiveContent } from "@/lib/live-content";

export function TrainersSection() {
  const trainers = useLiveContent().site.trainers;
  return (
    <section id="trainers" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Trainers</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">
            Coaches Who Have Lived The Transformation
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">Real experience. Evidence-based coaching. Zero ego.</p>
        </div>
        <div className="mobile-stack-grid mt-8 grid grid-cols-1 gap-4 md:mt-12 md:grid-cols-2 lg:grid-cols-3 md:gap-6">
          {trainers.map((t) => (
            <article key={t.name} className="card-surface w-full min-w-0 p-5 md:p-8">
              <img
                src={t.image}
                alt={`${t.name}, ${t.role}`}
                width={800}
                height={1008}
                loading="lazy"
                className="mb-6 aspect-[4/5] w-full rounded-xl object-cover object-top"
              />
              <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">
                {t.role}
              </span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-3 text-muted-foreground">{t.bio}</p>
              {t.quote && (
                <blockquote className="mt-4 rounded-r-lg border-l-4 border-primary bg-background/60 p-4 text-sm italic text-muted-foreground">
                  "{t.quote}"
                </blockquote>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
