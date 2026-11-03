import { createFileRoute } from "@tanstack/react-router";
import { TrainersSection } from "@/components/site/TrainersSection";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/trainers")({
  head: () => pageHead("/trainers", "Meet The Trainers | The Workout Plant — Williamsburg", "Meet Izzy, Analine, and Dev — the private 1-on-1 personal trainers at The Workout Plant, 139 Frost St, Williamsburg, Brooklyn."),
  component: () => <TrainersSection />,
});
