import { SITE_ORIGIN } from "@/lib/site-seo";
import { createFileRoute } from "@tanstack/react-router";
import { LegalPage } from "@/components/site/LegalPage";

export const Route = createFileRoute("/disclaimer")({
  head: () => ({
    meta: [
      { title: "Health, Fitness & SMS Disclaimer | The Workout Plant" },
      { name: "description", content: "Exercise and nutrition disclaimer plus SMS messaging terms for The Workout Plant." },
      { property: "og:title", content: "Health, Fitness & SMS Disclaimer | The Workout Plant" },
      { property: "og:description", content: "Consult a physician before training. SMS terms: reply STOP to opt out, HELP for help." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/disclaimer` },
      { name: "twitter:card", content: "summary" },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/disclaimer` }],
  }),
  component: () => (
    <LegalPage
      title="Health, Fitness & SMS Disclaimer"
      intro="Please read this disclaimer carefully before beginning any training, nutrition program, or text message communication with The Workout Plant."
      sections={[
        { h: "Consult a Physician", body: <p><strong>Consult your physician or qualified healthcare provider before starting any exercise or nutrition program</strong>, especially if you are pregnant, have a medical condition, take medication, or have a history of injury, heart disease, high blood pressure or joint problems.</p> },
        { h: "Not Medical Advice", body: <p>Our coaching, nutrition guidance, app content and website information are for general education and fitness purposes only. They are not medical advice, diagnosis or treatment and do not replace care from a licensed healthcare professional.</p> },
        { h: "Assumption of Risk & Liability Waiver", body: <><p>Physical exercise, including strength training, kickboxing and conditioning, carries risks of injury, illness or, in rare cases, death. By taking part, you voluntarily assume all risks.</p><p>To the fullest extent permitted by law, you release The Workout Plant LLC, its owners, trainers and staff from claims arising from your participation, except those caused by gross negligence or willful misconduct. Stop exercising right away and tell your trainer if you feel pain, dizziness or shortness of breath.</p></> },
        { h: "Results Disclaimer", body: <p>Testimonials and transformations reflect individual experiences. Results vary based on consistency, genetics, nutrition, sleep and other factors, and are not guaranteed.</p> },
        { h: "SMS Messaging Terms (A2P 10DLC)", body: <ul><li><strong>Program:</strong> The Workout Plant sends appointment reminders, booking confirmations, coaching check-ins and occasional promotional offers to subscribers who opt in.</li><li><strong>Opt-in:</strong> by checking the SMS consent box on our forms or texting us, you agree to receive recurring texts. Consent is not a condition of purchase.</li><li><strong>Frequency:</strong> message frequency varies.</li><li><strong>Message & data rates may apply.</strong></li><li><strong>Opt-out:</strong> reply <strong>STOP</strong> at any time to unsubscribe. You will get one final confirmation message.</li><li><strong>Help:</strong> reply <strong>HELP</strong> or contact izzy@theworkoutplant.com / (917) 992-2395.</li><li>Carriers are not liable for delayed or undelivered messages.</li><li>No mobile information will be shared with third parties/affiliates for marketing/promotional purposes. See our Privacy Policy.</li></ul> },
      ]}
    />
  ),
});
