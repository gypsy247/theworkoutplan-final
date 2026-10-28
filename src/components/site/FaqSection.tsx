import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const faqs = [
  ["Do I need to be vegan or plant-based to train here?", "No! While we specialize in plant-based nutrition, all dietary approaches are supported and tailored to your goals."],
  ["How often do I need to train to see results?", "Just 1 hour, 2 to 3 days a week in studio, supported by custom home/travel workouts and tracking in The Workout Plant App."],
  ["How does the New Client BOGO Sale work?", "Use code BOGO when booking your first session to get your second session free."],
  ["Do I need to bring my own mat or equipment?", "Everything is provided at our private studio, including mats, weights, and cool towels at the end of your session."],
  ["Where is the studio located?", "139 Frost St, Brooklyn, NY 11211 in Williamsburg."],
  ["How do I know which trainer to choose?", "Choose Izzy ($170) for advanced strength/kickboxing & clinical nutrition, Analine ($115) or Dev ($95) for strength + HIT Mat Pilates, or Small Group ($75) for group energy."],
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
