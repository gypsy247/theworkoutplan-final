import { createFileRoute } from "@tanstack/react-router";
import { FaqSection } from "@/components/site/FaqSection";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/faq")({
  head: () => pageHead("/faq", "FAQ | The Workout Plant — Williamsburg Private Training", "Answers about training at The Workout Plant: booking, cancellations, what to wear, nutrition coaching, and which trainer to choose."),
  component: () => <FaqSection />,
});
