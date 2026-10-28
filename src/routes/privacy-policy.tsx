import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/privacy-policy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy | The Workout Plant" },
      { name: "description", content: "How The Workout Plant collects, uses and protects your personal and mobile information." },
      { property: "og:title", content: "Privacy Policy | The Workout Plant" },
      { property: "og:description", content: "How The Workout Plant handles your personal, booking and SMS data." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <LegalPage
      title="Privacy Policy"
      intro="The Workout Plant LLC (“The Workout Plant,” “we,” “us”) respects your privacy. This policy explains what information we collect when you visit our website, book a session, request a consultation, or communicate with us, and how we use and protect it."
      sections={[
        { h: "Information We Collect", body: <ul><li><strong>Contact details:</strong> name, email address, phone number.</li><li><strong>Booking & consultation data:</strong> selected session tier, promo codes, fitness goals, scheduling preferences and messages you send us.</li><li><strong>Health information you choose to share</strong> (e.g., injuries or limitations) so we can coach you safely.</li><li><strong>Payment information</strong>, processed by our third-party payment processors; we do not store full card numbers.</li><li><strong>Technical data:</strong> IP address, browser type, device and pages visited.</li></ul> },
        { h: "How We Use Your Information", body: <ul><li>To schedule, confirm and manage training sessions and consultations.</li><li>To deliver coaching, nutrition guidance and access to The Workout Plant App.</li><li>To send appointment reminders, service updates and, with your consent, promotional offers.</li><li>To process payments and maintain business records.</li><li>To improve our website and services.</li></ul> },
        { h: "Cookies & Analytics", body: <p>We use cookies and similar technologies to keep the site working, remember preferences and understand how visitors use our site through analytics tools. You can disable cookies in your browser settings; some features may not function properly as a result.</p> },
        { h: "SMS / Mobile Privacy", body: <><p>If you opt in to text messages, we use your mobile number only to send appointment reminders, booking updates, coaching messages and offers you agreed to receive.</p><p><strong>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes.</strong> All the above categories exclude text messaging originator opt-in data and consent; this information will not be shared with any third parties.</p><p>Reply STOP at any time to opt out or HELP for help. Message and data rates may apply.</p></> },
        { h: "How We Share Information", body: <p>We do not sell your personal information. We share it only with service providers that help us operate (scheduling, payment processing, email/SMS delivery, website hosting), under confidentiality obligations, or when required by law.</p> },
        { h: "Data Security & Retention", body: <p>We use reasonable administrative, technical and physical safeguards to protect your information. We keep it only as long as needed to provide services and meet legal, tax and accounting obligations.</p> },
        { h: "Your Rights", body: <p>You may request access to, correction of, or deletion of your personal information, and you may opt out of marketing emails or texts at any time by emailing izzy@theworkoutplant.com.</p> },
        { h: "Children's Privacy", body: <p>Our services are not directed to children under 13, and we do not knowingly collect their information. Minors may train only with parent or guardian consent.</p> },
        { h: "Changes to This Policy", body: <p>We may update this policy from time to time. The “Last updated” date above reflects the latest version.</p> },
      ]}
    />
  ),
});
