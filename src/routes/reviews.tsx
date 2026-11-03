import { createFileRoute } from "@tanstack/react-router";
import { ReviewsSection } from "@/components/site/ReviewsSection";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/reviews")({
  head: () => pageHead("/reviews", "Google Reviews: 4.9★ Rated Private Gym | The Workout Plant", "Read 70+ verified Google reviews for The Workout Plant, the 4.9-star private 1-on-1 personal training studio at 139 Frost St, Williamsburg, Brooklyn."),
  component: () => <ReviewsSection />,
});
