import { createFileRoute } from "@tanstack/react-router";
import { StudioGallery } from "@/components/site/StudioGallery";
import { FacilityBanner } from "@/components/site/FacilityBanner";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/gallery")({
  head: () => pageHead("/gallery", "Real Clients & Studio Space Gallery | The Workout Plant", "See real clients training and the private studio space at The Workout Plant, 139 Frost St, Williamsburg, Brooklyn — plus the coaching app in action."),
  component: () => (
    <>
      <section className="px-6 pt-16">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Gallery</p>
          <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Real Clients & Studio Space</h1>
          <StudioGallery />
        </div>
      </section>
      <FacilityBanner />
    </>
  ),
});
