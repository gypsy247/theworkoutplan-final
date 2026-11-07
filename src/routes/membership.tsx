import { createFileRoute } from "@tanstack/react-router";
import { useLiveContent } from "@/lib/live-content";
import { pageHead } from "@/lib/site-seo";

export function membershipHead() {
  const base = pageHead("/membership", "Complete Your Workout Plant App Membership", "Private page for onboarded Workout Plant clients to complete their coaching app membership.");
  return { ...base, meta: [...base.meta, { name: "robots", content: "noindex, nofollow" }] };
}

export const Route = createFileRoute("/membership")({
  head: () => membershipHead(),
  component: MembershipPage,
});

function MembershipPage() {
  const SITE = useLiveContent().site.studioInfo;
  return (
    <section className="px-6 py-16">
      <div className="mx-auto max-w-3xl text-center">
        <img src={SITE.logoImage} alt="The Workout Plant logo" className="mx-auto h-16 w-16 rounded-full object-cover" />
        <h1 className="mt-6 text-4xl font-extrabold md:text-5xl">Complete Your Workout Plant App Membership</h1>
        <p className="mt-4 text-lg text-muted-foreground">Private page for onboarded clients. Set up your coaching app account below.</p>
      </div>
      <div className="mx-auto mt-10 max-w-3xl overflow-hidden rounded-2xl border border-border bg-card">
        <iframe
          width="100%"
          height="1100px"
          frameBorder={0}
          style={{ display: "block", width: "100%", minHeight: "1100px", border: 0 }}
          src="https://www.ptdistinction.com/ptd_funnel_iframe.php?apk=AJEF32K7HA323889&pkid=31418"
          title="The Workout Plant Membership Creation"
        />
      </div>
    </section>
  );
}
