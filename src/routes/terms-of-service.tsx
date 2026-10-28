import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/terms-of-service")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions | The Workout Plant" },
      { name: "description", content: "Booking, cancellation, BOGO promotion, studio conduct and billing terms for The Workout Plant." },
      { property: "og:title", content: "Terms & Conditions | The Workout Plant" },
      { property: "og:description", content: "Session booking, 24-hour cancellation and billing terms." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage
      title="Terms & Conditions"
      intro="These Terms govern your use of The Workout Plant website and your participation in our 1-on-1 and small group training services at 139 Frost St, Brooklyn, NY 11211. By booking a session, you agree to these Terms."
      sections={[
        { h: "Session Bookings", body: <p>Sessions are 60 minutes and may be booked as 1-on-1 private training (with the Head Trainer, a Trainer, or a Junior Trainer) or as small group sessions. Bookings are confirmed once you receive confirmation by email or text. Pricing is per session as listed on our website and may change with notice.</p> },
        { h: "Cancellation, Rescheduling & Late Arrival", body: <ul><li><strong>No refunds.</strong> You may reschedule up to <strong>48 hours</strong> before your session.</li><li>No-shows are charged the full session amount.</li><li>Arriving more than <strong>15 minutes late</strong> is considered a no-show and charged in full.</li><li>Arriving more than <strong>10 minutes late</strong> may result in a shortened session.</li><li>If we must cancel, you will be rescheduled.</li></ul> },
        { h: "Attire & Studio Rules", body: <p>Wear something comfortable and bring a water bottle. <strong>No shoes</strong> in the studio—we provide mats, cool towels, and everything else you need.</p> },
        { h: "New Client BOGO Promotion", body: <ul><li>Available to first-time clients only, one per person.</li><li>Enter code <strong>BOGO</strong> at booking: purchase one intro session and receive a second session of the same tier free.</li><li>The free session must be used within 30 days of the first and cannot be exchanged for cash, transferred, or combined with other offers.</li><li>We may change or end the promotion at any time.</li></ul> },
        { h: "Studio Conduct", body: <ul><li>Treat coaches, clients and equipment with respect.</li><li>Tell your trainer about injuries, medical conditions or pain before and during training.</li><li>We may refuse or end service for unsafe or disruptive behavior.</li></ul> },
        { h: "Billing & Payments", body: <p>Payment is due at booking unless otherwise agreed. Packages are non-refundable except as required by law, and unused sessions may expire as stated at purchase. By providing payment details, you authorize us to charge for booked sessions and late-cancellation fees.</p> },
        { h: "Health & Assumption of Risk", body: <p>Exercise carries inherent risks. You confirm you are physically able to take part and accept these risks. Please review our Health, Fitness & SMS Disclaimer.</p> },
        { h: "App & Content", body: <p>Programs, recipes, guides and app content are for your personal use only and may not be copied or redistributed.</p> },
        { h: "Limitation of Liability", body: <p>To the fullest extent permitted by law, The Workout Plant LLC is not liable for indirect, incidental or consequential damages arising from use of our services or website.</p> },
        { h: "Governing Law", body: <p>These Terms are governed by the laws of the State of New York.</p> },
      ]}
    />
  ),
});
