import { createFileRoute } from "@tanstack/react-router";
import { PricingSection } from "@/components/site/PricingSection";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/pricing")({
  head: () => pageHead("/pricing", "1-on-1 Personal Training Pricing | The Workout Plant", "Transparent private training pricing in Williamsburg: sessions with Head Coach Izzy ($170), Trainer Analine ($115), Jr. Trainer Dev ($95), or virtual with Izzy ($150). Zero contracts."),
  component: () => <PricingSection />,
});
