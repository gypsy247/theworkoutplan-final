import type { ReactNode } from "react";

export type LegalSection = { h: string; body: ReactNode };

export function LegalPage({ title, intro, sections }: { title: string; intro: string; sections: LegalSection[] }) {
  return (
    <section className="px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Legal</p>
        <h1 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">{title}</h1>
        <p className="mt-2 text-sm text-muted-foreground">Last updated: October 28, 2026</p>
        <div className="mt-10 rounded-2xl border border-border bg-card p-8">
          <p className="leading-relaxed text-muted-foreground">{intro}</p>
          {sections.map((s, i) => (
            <div key={s.h} className="mt-8">
              <h2 className="text-xl font-extrabold tracking-tight">{i + 1}. {s.h}</h2>
              <div className="mt-3 space-y-3 leading-relaxed text-muted-foreground [&_li]:ml-5 [&_li]:list-disc [&_strong]:text-foreground">{s.body}</div>
            </div>
          ))}
          <div className="mt-10 rounded-xl border border-primary/30 bg-primary/5 p-6 text-sm">
            <p className="font-bold">The Workout Plant LLC</p>
            <p className="text-muted-foreground">139 Frost St, Brooklyn, NY 11211</p>
            <p className="text-muted-foreground">izzy@theworkoutplant.com • (917) 992-2395</p>
          </div>
        </div>
      </div>
    </section>
  );
}
