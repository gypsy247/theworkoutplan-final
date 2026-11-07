import { SITE_ORIGIN } from "@/lib/site-seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";
import { useLiveContent } from "@/lib/live-content";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | The Workout Plant" },
      { name: "description", content: "Booking, cancellation, studio conduct and billing terms for The Workout Plant." },
      { property: "og:title", content: "Terms & Conditions | The Workout Plant" },
      { property: "og:description", content: "Private 1:1 session booking, 48-hour rescheduling, no-refund and billing terms." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/terms-of-service` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/terms-of-service` }],
  }),
  component: TermsPage,
});

function TermsPage() {
  const POLICIES = useLiveContent().site.policies;
  return (
    <LegalPage
      title="Terms & Conditions"
      intro="These Terms govern your use of The Workout Plant website and your participation in our private 1-on-1 personal training and nutrition coaching services at 139 Frost St, Brooklyn, NY 11211. By booking a session, you agree to these Terms."
      sections={[
        { h: "Session Bookings", body: <p>Sessions are 60 minutes and exclusively 1-on-1 private personal training (with Izzy, Analine or Dev), or virtual training with Coach Izzy. Nutrition coaching is included. Bookings are confirmed by Acuity. Pricing is per session as listed on our website and may change with notice.</p> },
        { h: "Cancellation, Rescheduling & Late Arrival", body: <><p>{POLICIES.cancellation} {POLICIES.late}</p><p>If we must cancel, you will be rescheduled.</p></> },
        { h: "Attire & Studio Rules", body: <p>{POLICIES.attire}</p> },
        { h: "Studio Conduct", body: <ul><li>Treat coaches, clients and equipment with respect.</li><li>Tell your trainer about injuries, medical conditions or pain before and during training.</li><li>We may refuse or end service for unsafe or disruptive behavior.</li></ul> },
        { h: "Billing & Payments", body: <p>Payment is due at booking unless otherwise agreed. Packages are non-refundable except as required by law, and unused sessions may expire as stated at purchase. By providing payment details, you authorize us to charge for booked sessions and late-cancellation fees.</p> },
        { h: "Health & Assumption of Risk", body: <p>Exercise carries inherent risks. You confirm you are physically able to take part and accept these risks. Please review our Health, Fitness & SMS Disclaimer.</p> },
        { h: "App & Content", body: <p>Programs, recipes, guides and app content are for your personal use only and may not be copied or redistributed.</p> },
        { h: "Limitation of Liability", body: <p>To the fullest extent permitted by law, The Workout Plant LLC is not liable for indirect, incidental or consequential damages arising from use of our services or website.</p> },
        { h: "Governing Law", body: <p>These Terms are governed by the laws of the State of New York.</p> },
      ]}
    />
  );
}
