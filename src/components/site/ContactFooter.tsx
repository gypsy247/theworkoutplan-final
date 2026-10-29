import { Link } from "@tanstack/react-router";
import { Mail, MapPin, Phone, Sprout, User } from "lucide-react";
import { ConsultationForm } from "./ConsultationForm";
import { EMAIL } from "./data";
import { PHONE, PHONE_HREF, Stars } from "./brand";
import { SOCIAL_LIST } from "./social";

export function ContactDetails() {
  const rows = [
    { Icon: Sprout, text: "The Workout Plant", strong: true },
    { Icon: User, text: "Izzy Jacobus — Head Coach" },
    { Icon: MapPin, text: "139 Frost St, Brooklyn, NY 11211" },
    { Icon: Phone, text: "+1 917-992-2395 (call or text)", href: PHONE_HREF },
    { Icon: Mail, text: EMAIL, href: `mailto:${EMAIL}` },
  ];
  return (
    <ul className="space-y-4">
      {rows.map(({ Icon, text, href, strong }) => (
        <li key={text} className="flex items-center gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary/15 text-primary"><Icon className="h-5 w-5" /></span>
          {href ? <a href={href} className="hover:text-primary">{text}</a> : <span className={strong ? "font-bold" : ""}>{text}</span>}
        </li>
      ))}
    </ul>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-border px-6 py-24">
      <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-2">
        <div className="card-surface p-8">
          <p className="text-sm font-bold uppercase tracking-widest text-primary">Contact</p>
          <h2 className="mt-2 text-4xl font-extrabold tracking-tight">Ready to Start? Let's Talk.</h2>
          <p className="mt-4 text-muted-foreground">Request a free consultation and claim your BOGO intro session.</p>
          <div className="mt-8"><ContactDetails /></div>
        </div>
        <div className="card-surface p-8">
          <h3 className="mb-6 text-2xl font-extrabold tracking-tight">Request a Consultation</h3>
          <ConsultationForm />
        </div>
      </div>
    </section>
  );
}

const quick = [
  { label: "Google Reviews", hash: "reviews" },
  { label: "The Plan", hash: "the-plan" },
  { label: "Trainers", hash: "trainers" },
  { label: "Pricing", hash: "pricing" },
  { label: "FAQ", hash: "faq" },
];
const programs = ["1:1 w/ Head Coach Izzy", "1:1 w/ Trainer Analine", "1:1 w/ Jr. Trainer Dev", "1:1 Virtual Session w/ Coach Izzy", "Plant-Based & Custom Nutrition", "The Workout Plant App"];

export function Footer() {
  const head = "mb-4 font-display text-sm font-extrabold uppercase tracking-widest";
  const link = "text-muted-foreground transition hover:text-primary";
  return (
    <footer className="border-t border-border bg-card px-6 pt-16">
      <div className="mx-auto grid max-w-7xl gap-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground"><Sprout className="h-5 w-5" /></span>
            THE WORKOUT PLANT
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">Evidence-based private training & nutrition coaching in Williamsburg, Brooklyn.</p>
          <p className="mt-3 text-sm"><span className="font-bold">4.9</span> <Stars /> <span className="text-muted-foreground">(70+ Google Reviews)</span></p>
          <div className="mt-6 flex gap-3">
            {SOCIAL_LIST.map(({ label, href, Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="grid h-10 w-10 place-items-center rounded-lg border border-border bg-background transition hover:border-primary hover:text-primary">
                <Icon />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className={head}>Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className={link}>Home</Link></li>
            {quick.map((q) => <li key={q.hash}><Link to="/" hash={q.hash} className={link}>{q.label}</Link></li>)}
            <li><Link to="/contact" className={link}>Contact Us</Link></li>
            <li><Link to="/book-a-session" className={link}>Book A Session</Link></li>
            <li><Link to="/high-protein-vegan-recipes" className={link}>Vegan Recipes</Link></li>
            <li><Link to="/fitness-articles" className={link}>Articles</Link></li>
            <li><Link to="/client-login" className={link}>Client Login</Link></li>
          </ul>
        </div>
        <div>
          <h4 className={head}>Programs</h4>
          <ul className="space-y-2 text-sm">
            {programs.map((p) => <li key={p}><Link to="/" hash="pricing" className={link}>{p}</Link></li>)}
          </ul>
        </div>
        <div>
          <h4 className={head}>Legal & Studio</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/privacy-policy" className={link}>Privacy Policy</Link></li>
            <li><Link to="/terms-of-service" className={link}>Terms & Conditions</Link></li>
            <li><Link to="/disclaimer" className={link}>Health & SMS Disclaimer</Link></li>
            <li><Link to="/contact" className={link}>Contact Us</Link></li>
          </ul>
          <div className="mt-6 space-y-1 text-sm text-muted-foreground">
            <p>139 Frost St, Brooklyn, NY 11211</p>
            <p>Tel: <a href={PHONE_HREF} className="hover:text-primary">{PHONE}</a></p>
            <p><a href={`mailto:${EMAIL}`} className="hover:text-primary">{EMAIL}</a></p>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-12 max-w-7xl border-t border-border py-6 text-center text-xs text-muted-foreground">
        © 2026 The Workout Plant LLC. All rights reserved. Williamsburg, Brooklyn, NY.
      </div>
    </footer>
  );
}
