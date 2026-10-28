import { BookOpen, Dumbbell, LineChart, MessageCircle, Plane, Salad, UtensilsCrossed } from "lucide-react";

const pillars = [
  { n: "01", icon: Dumbbell, title: "Strength + Kickboxing or HIT Mat Pilates", text: "Each 60-minute session integrates progressive strength training with elements of kickboxing or HIT mat Pilates (depending on your trainer)." },
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
                      <b.icon className="h-4 w-4 shrink-0 text-accent" /> {b.label}
                    </span>
                  ))}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
