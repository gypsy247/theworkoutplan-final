import { SITE_ORIGIN } from "@/lib/site-seo";
import { createFileRoute } from "@tanstack/react-router";
import { Mail, MapPin, Navigation, Phone } from "lucide-react";
import { ConsultationForm } from "@/components/site/ConsultationForm";
import { useLiveContent } from "@/lib/live-content";
import { MAP_EMBED, MAPS_URL } from "@/components/site/brand";
import { getSocialList } from "@/components/site/social";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact The Workout Plant | Williamsburg Personal Training" },
      { name: "description", content: "Call, text or email The Workout Plant at 139 Frost St, Brooklyn. Request a free consultation and book your intro session." },
      { property: "og:title", content: "Contact The Workout Plant" },
      { property: "og:description", content: "Request a free consultation and book your intro session in Williamsburg, Brooklyn." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: `${SITE_ORIGIN}/contact` },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: `${SITE_ORIGIN}/contact` }],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { site } = useLiveContent();
  const EMAIL = site.studioInfo.email;
  const SOCIAL_LIST = getSocialList(site);
  const cards = [
    { Icon: Phone, label: "Call / Text", value: "917-992-2395", href: "tel:+19179922395", cta: "Call Now" },
    { Icon: Mail, label: "Email", value: EMAIL, href: `mailto:${EMAIL}`, cta: "Send Email" },
    { Icon: MapPin, label: "Studio Address", value: "139 Frost St, Brooklyn, NY 11211", href: MAPS_URL, cta: "Get Directions", external: true },
  ];
  return (
    <section className="relative overflow-hidden px-6 py-24">
      <div className="pointer-events-none absolute left-1/2 top-0 h-[400px] w-[640px] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
      <div className="relative mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Contact Us</p>
          <h1 className="mt-2 text-5xl font-extrabold tracking-tight md:text-6xl">Let's Build Your Plan.</h1>
          <p className="mt-4 text-lg text-muted-foreground">Request a free consultation and book your intro session.</p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map(({ Icon, label, value, href, cta, external }) => (
            <div key={label} className="card-surface flex flex-col p-8">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-primary/15 text-primary"><Icon className="h-6 w-6" /></span>
              <p className="mt-6 text-sm text-muted-foreground">{label}</p>
              <p className="mt-1 break-words text-lg font-bold">{value}</p>
              <a href={href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})} className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:border-primary/50">
                {external && <Navigation className="h-4 w-4" />} {cta}
              </a>
            </div>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-3">
          {SOCIAL_LIST.map(({ label, handle, href, Icon }) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="card-surface flex items-center gap-4 p-6">
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-secondary text-primary"><Icon className="h-6 w-6" /></span>
              <div>
                <p className="font-bold">{label}</p>
                <p className="text-sm text-muted-foreground">{handle}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <div className="card-surface p-8">
            <h2 className="mb-6 text-2xl font-extrabold tracking-tight">Request a Free Consultation</h2>
            <ConsultationForm />
          </div>
          <div className="relative min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card">
            <iframe title="Map to The Workout Plant" src={MAP_EMBED} className="absolute inset-0 h-full w-full border-0" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
          </div>
        </div>
      </div>
    </section>
  );
}
