import { Phone, Sprout } from "lucide-react";
import { PHONE, PHONE_HREF } from "./brand";

const links = [
  { label: "Google Reviews", href: "#reviews" },
  { label: "The Plan", href: "#the-plan" },
  { label: "Google Map", href: "#map" },
];

export function Navbar() {
  return (
    <>
      <a href="#book" className="block bg-primary px-4 py-2 text-center text-sm font-bold text-primary-foreground">
        🌱 NEW CLIENT SPECIAL: Buy One Get One Free on Intro Sessions! Use Code: BOGO at Booking →
      </a>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <a href="#" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </span>
            THE WORKOUT PLANT
          </a>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">
            {links.map((l) => (
              <a key={l.href} href={l.href} className="transition hover:text-foreground">{l.label}</a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <a href={PHONE_HREF} className="hidden items-center gap-2 text-sm font-semibold md:flex">
              <Phone className="h-4 w-4 text-primary" /> {PHONE}
            </a>
            <a id="book" href={PHONE_HREF} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              Book A Session
            </a>
          </div>
        </div>
      </header>
    </>
  );
}
