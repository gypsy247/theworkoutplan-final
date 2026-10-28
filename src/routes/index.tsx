import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/site/Navbar";
import { HeroSection } from "@/components/site/HeroSection";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { ThePlanSection } from "@/components/site/ThePlanSection";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "The Workout Plant | Private Gym & Personal Training in Williamsburg" },
      { name: "description", content: "Rated 4.9★ on Google. Evidence-based private training at 139 Frost St, Brooklyn. Strength, nutrition and app coaching, 2–3 days a week." },
      { property: "og:title", content: "The Workout Plant | Williamsburg Personal Training" },
      { property: "og:description", content: "Rated 4.9★ with 70+ Google reviews. Evidence-based private training in Williamsburg, Brooklyn." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <HeroSection />
        <ReviewsSection />
        <ThePlanSection />
      </main>
    </div>
  );
}
