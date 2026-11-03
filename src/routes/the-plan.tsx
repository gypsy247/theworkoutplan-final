import { createFileRoute } from "@tanstack/react-router";
import { ThePlanSection } from "@/components/site/ThePlanSection";
import { VideoShowcase } from "@/components/site/VideoShowcase";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/the-plan")({
  head: () => pageHead("/the-plan", "The Plan: 3-Pillar Evidence-Based Training | The Workout Plant", "The Workout Plant's 3-pillar plan: 1:1 strength training, evidence-based nutrition coaching, and 24/7 app accountability at 139 Frost St, Williamsburg."),
  component: () => (
    <>
      <VideoShowcase />
      <ThePlanSection />
    </>
  ),
});
