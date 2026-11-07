import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useLiveContent } from "@/lib/live-content";

export function FaqSection() {
  const faqs = useLiveContent().site.faqs;
  return (
    <section id="faq" className="border-t border-border px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">FAQ</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight md:text-5xl">Questions, Answered</h2>
        </div>
        <Accordion type="single" collapsible className="mt-12 space-y-4">
          {faqs.map(({ question, answer }, i) => (
            <AccordionItem key={question} value={`q${i}`} className="rounded-2xl border border-border bg-card px-6">
              <AccordionTrigger className="text-left font-display text-base font-bold hover:no-underline">{question}</AccordionTrigger>
              <AccordionContent className="text-muted-foreground">{answer}</AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
