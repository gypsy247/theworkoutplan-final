import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { POLICIES } from "./data";

const faqs = [
  ["Do I need to be vegan or plant-based to train here?", "No! While we specialize in plant-based nutrition, all dietary approaches are supported and tailored to your goals."],
  ["How often do I need to train to see results?", POLICIES.philosophy],
  ["How does the New Client BOGO Sale work?", "Use code BOGO when booking your first session to get your second session free."],
  ["What should I wear and bring?", POLICIES.attire],
  ["What is your cancellation and rescheduling policy?", POLICIES.cancellation],
  ["What happens if I arrive late?", POLICIES.late],
  ["When are group sessions?", "Group Personal Training (4 person max) runs Mondays at 7:00 PM & Wednesdays at 7:00 PM."],
  ["Where is the studio located?", "139 Frost St, Brooklyn, NY 11211 in Williamsburg."],
  ["How do I know which trainer to choose?", "Head Coach Izzy ($170, or $150 virtual) for 1-on-1 with our founder, Analine ($115) for strength + HIT Mat Pilates, Dev ($95) for strength + Mat/Inferno Pilates, or Group ($75) for training side-by-side with up to 3 others."],
];

export function FaqSection() {
  return (
    <section id="faq" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Questions, Answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {faqs.map(([q, a], i) => (
            <AccordionItem key={q} value={`q${i}`} className="rounded-2xl border border-border bg-card px-6">
              <AccordionTrigger className="text-left font-display text-base font-bold hover:no-underline">{q}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{a}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
