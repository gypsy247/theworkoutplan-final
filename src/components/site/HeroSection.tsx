import { Link } from "@tanstack/react-router";
import editorial from "@/data/editorial-content.json";
import { ConsultationForm } from "./ConsultationForm";

export function HeroSection() {
  return <section className="site-hero px-5 py-10 md:px-6 md:py-14">
    <div className="mx-auto grid max-w-7xl items-center gap-8 md:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] md:gap-12">
      <div>
        <p className="text-sm text-primary">{editorial.hero.eyebrow}</p>
        <h1 className="mt-5 max-w-2xl">{editorial.hero.headline}</h1>
        <p className="mt-5 max-w-xl text-lg text-muted-foreground">{editorial.hero.subheadline}</p>
        <a href="#reviews" className="mt-6 inline-block text-sm text-muted-foreground">{editorial.hero.reviews}</a>
      </div>
      <div id="hero-consultation" className="consultation-panel card-surface scroll-mt-24 p-5 md:p-6">
        <h2 className="mb-2">Request a free consultation</h2>
        <p className="mb-5 text-muted-foreground">A personal reply from Coach Izzy. No pressure.</p>
        <ConsultationForm />
        <Link to="/book-a-session" className="mt-5 inline-block text-sm font-semibold text-primary underline-offset-4 hover:underline">Or book a session directly →</Link>
      </div>
    </div>
  </section>;
}
