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
        <h1 className="text-4xl font-extrabold md:text-5xl">Schedule your session</h1>
        <p className="mt-4 mb-8 max-w-2xl text-muted-foreground">First session? Send a quick message to introduce yourself, share any injuries or goals, or request a brief phone consultation first.</p>
        <div className="card-surface min-w-0 overflow-hidden p-3 sm:p-6">
          <AcuityScheduler policiesBelow />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">Prefer to talk before booking? <a href="#consultation" className="font-semibold text-primary underline-offset-4 hover:underline">Request a free consultation →</a></p>
      </div>
    </section>
  ),
});
