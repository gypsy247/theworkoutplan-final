import { SITE_ORIGIN } from "@/lib/site-seo";
import { createFileRoute } from "@tanstack/react-router";
import { AcuityScheduler } from "@/components/site/AcuityScheduler";

export const Route = createFileRoute("/book-a-session")({
  head: () => ({ meta: [
    { title: "Book a 1:1 Session | The Workout Plant" },
    { name: "description", content: "Book private personal training or virtual coaching with The Workout Plant. Live Acuity scheduling and studio policies." },
    { property: "og:title", content: "Book a 1:1 Session | The Workout Plant" },
    { property: "og:description", content: "Choose a private training appointment with Izzy, Analine or Dev, or book virtual coaching." },
    { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/book-a-session` },
    { name: "twitter:card", content: "summary_large_image" },
  ], links: [{ rel: "canonical", href: `${SITE_ORIGIN}/book-a-session` }] }),
  component: () => (
    <section className="px-4 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-5xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">The Workout Plant</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Book Your 1:1 Session</h1>
        <p className="mt-4 mb-8 text-muted-foreground">Private personal training & nutrition coaching · 139 Frost St, Brooklyn</p>
        <AcuityScheduler />
      </div>
    </section>
  ),
});