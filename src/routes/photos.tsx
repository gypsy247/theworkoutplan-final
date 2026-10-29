import { createFileRoute } from "@tanstack/react-router";
import { StudioGallery } from "@/components/site/StudioGallery";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/photos")({
  head: () => pageHead("/photos", "THE PLANT: Studio Photos | The Workout Plant — Williamsburg Private Gym", "Explore inside The Workout Plant at 139 Frost St in Williamsburg, Brooklyn. See our private 1-on-1 strength training, kickboxing studio, and coaching app."),
  component: () => (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-7xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">THE PLANT</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Studio Photos</h1>
        <p className="mt-4 text-lg text-muted-foreground">Inside 139 Frost St · Williamsburg, Brooklyn</p>
        <StudioGallery />
      </div>
    </section>
  ),
});