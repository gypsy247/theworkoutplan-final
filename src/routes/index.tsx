import { createFileRoute } from "@tanstack/react-router";
import { HeroSection } from "@/components/site/HeroSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ThePlanSection } from "@/components/site/ThePlanSection";
import { TrainersSection } from "@/components/site/TrainersSection";
import { PricingSection } from "@/components/site/PricingSection";
import { ResourcesSection } from "@/components/site/ResourcesSection";
import { FaqSection } from "@/components/site/FaqSection";
import { ContactSection } from "@/components/site/ContactFooter";
import { GYM_SCHEMA, pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/")({
  head: () => ({
    ...pageHead("/", "The Workout Plant: Williamsburg Brooklyn Private Gym & Plant-Based Personal Trainer", "Located in Williamsburg, Brooklyn, The Workout Plant offers 1-on-1 strength training, kickboxing and plant-based nutrition coaching with Trainer Izzy Jacobus at 139 Frost St."),
    scripts: [{ type: "application/ld+json", children: JSON.stringify(GYM_SCHEMA) }],
  }),
  component: Index,
});

function Index() {
  return (
    <>
      <HeroSection />
      <ReviewsSection />
      <ThePlanSection />
      <TrainersSection />
      <PricingSection />
      <ResourcesSection />
      <FaqSection />
      <ContactSection />
    </>
  );
}
