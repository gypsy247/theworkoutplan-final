import izzy from "@/assets/trainer-izzy-boxing.jpg.asset.json";
import analine from "@/assets/trainer-analine-real.jpg.asset.json";
import dev from "@/assets/trainer-dev-real.jpg.asset.json";

const trainers = [
  { img: izzy, name: "Izzy Jacobus", role: "Head Coach / Trainer & Founder", bio: "Creator of THE PLAN. Former nutritional counselor at Brooklyn Nurse Practitioners Clinic and experienced kickboxing & strength coach specializing in advanced 1:1 strength training, athletic goals, and individualized nutrition coaching.", quote: "A little over a decade ago, I was obese, sedentary, and struggling with chronic pain that made even everyday activities difficult. I started rebuilding my health with small steps. Walking led to bodyweight exercises, and eventually yoga, kickboxing, and strength training. What began as an effort to reclaim my own health became a passion for helping others do the same." },
  { img: analine, name: "Analine Ignacio", role: "Personal Trainer & HIT Pilates Instructor", bio: "Analine combines strength training with a passion for movement, mobility, and mat Pilates. Also an instructor at YO-BK, she brings a thoughtful, encouraging approach to helping clients build strength, improve movement, and develop lasting fitness habits.", quote: "I'd always been active and never worried much about nutrition, but during the pandemic, I gained weight and struggled to lose it. I started making small, sustainable changes—improving my eating habits, gradually increasing my daily steps, and discovering Pilates along the way. Losing 40 pounds taught me that consistency matters more than perfection and inspired me to help others make lasting changes." },
  { img: dev, name: "Dev Buchanan", role: "Junior Trainer & HIT Pilates Instructor", bio: "Specializes in 1-on-1 strength training, conditioning, and functional movement to help clients build confidence, improve body composition, and feel stronger in everyday life.", quote: "In 2023, I made the decision to commit to sobriety for good. Strength training became my anchor, giving me structure, transforming my body composition, and helping me rebuild my confidence." },
];

export function TrainersSection() {
  return (
    <section id="trainers" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Trainers</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Coaches Who Have Lived The Transformation</h2>
          <p className="mt-4 text-lg text-muted-foreground">Real experience. Evidence-based coaching. Zero ego.</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {trainers.map((t) => (
            <article key={t.name} className="card-surface p-8">
              <img src={t.img.url} alt={`${t.name}, ${t.role}`} width={800} height={1008} loading="lazy" className="mb-6 aspect-[4/5] w-full rounded-xl object-cover object-top" />
              <span className="inline-block rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-bold text-primary">{t.role}</span>
              <h3 className="mt-4 text-2xl font-extrabold tracking-tight">{t.name}</h3>
              <p className="mt-3 text-muted-foreground">{t.bio}</p>
              {t.quote && <blockquote className="mt-4 rounded-r-lg border-l-4 border-primary bg-background/60 p-4 text-sm italic text-muted-foreground">"{t.quote}"</blockquote>}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
