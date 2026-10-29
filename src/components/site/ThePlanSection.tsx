import { BookOpen, Dumbbell, Image, LineChart, MessageCircle, Plane, Salad, Smartphone, UtensilsCrossed } from "lucide-react";
import { POLICIES } from "./data";

const pillars = [
  { n: "01", icon: Dumbbell, title: "Individual 1:1 Strength Training", text: "Each 60-minute private session combines progressive strength training with functional movement, mobility, conditioning, or kickboxing, tailored to your goals." },
  { n: "02", icon: Salad, title: "Evidence-Based Nutrition Coaching", text: "While we specialize in plant-based nutrition, all dietary approaches are supported and tailored to your body composition goals." },
  { n: "03", icon: MessageCircle, title: "24/7 App & Direct Messaging Accountability", text: "Coaching doesn't stop when you leave 139 Frost St. Through The Workout Plant App, you get:" },
];

const badges = [
  { icon: LineChart, label: "Results Tracking" },
  { icon: UtensilsCrossed, label: "Custom Recipe Guide" },
  { icon: Plane, label: "Home & Vacation Workouts" },
  { icon: BookOpen, label: "Training & Coaching Guides" },
];

export function ThePlanSection() {
  return (
    <section id="the-plan" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">The Plan</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Simple, Evidence-Based Systems That Actually Work</h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Led by Head Coach Izzy Jacobus, whether you train with Izzy or one of our trainers, you follow the same structured, evolving program.
          </p>
          <p className="mt-4 text-sm font-semibold text-foreground">{POLICIES.philosophy}</p>
        </div>
        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-3">
          {pillars.map((p, i) => (
            <article key={p.n} className={`card-surface p-8 ${i === 2 ? "md:col-span-3 lg:col-span-1" : ""}`}>
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><p.icon className="h-6 w-6" /></span>
                <span className="font-display text-3xl font-extrabold text-border">{p.n}</span>
              </div>
              <h3 className="mt-6 text-xl font-extrabold tracking-tight">{p.title}</h3>
              <p className="mt-3 text-muted-foreground">{p.text}</p>
              {i === 2 && (
                <div className="mt-6 grid grid-cols-2 gap-2">
                  {badges.map((b) => (
                    <span key={b.label} className="flex items-center gap-2 rounded-lg border border-border bg-secondary px-3 py-2 text-xs font-semibold">
                      <b.icon className="h-4 w-4 shrink-0 text-primary" /> {b.label}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside 139 Frost St</h3>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {["1:1 Strength Training", "Private Boxing Coaching", "Strength & Conditioning"].map((label) => (
              <figure key={label}>
                <div role="img" aria-label={`${label} — studio photo pending`} className="flex aspect-[4/3] items-center justify-center overflow-hidden rounded-2xl border border-border bg-secondary transition-colors hover:border-primary/60">
                  <div className="text-center"><Image className="mx-auto h-10 w-10 text-primary/60" /><p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">Studio photo pending</p></div>
                </div>
                <figcaption className="mt-3 text-sm font-semibold">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-2xl font-extrabold md:text-3xl">Inside The Workout Plant App</h3>
          <div className="mt-8 grid gap-10 md:grid-cols-3">
            {["Workout Tracking", "Progress Analytics", "Custom Recipe Guide"].map((label) => (
              <figure key={label}>
                <div role="img" aria-label={`${label} — app screenshot pending`} className="phone-shadow mx-auto flex aspect-[9/19] w-full max-w-[280px] items-center justify-center overflow-hidden rounded-3xl border-2 border-border bg-secondary transition-colors hover:border-primary/60">
                  <div className="px-4 text-center"><Smartphone className="mx-auto h-10 w-10 text-primary/60" /><p className="mt-3 text-xs uppercase tracking-widest text-muted-foreground">App screenshot pending</p></div>
                </div>
                <figcaption className="mt-4 text-center text-sm font-semibold">{label}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
