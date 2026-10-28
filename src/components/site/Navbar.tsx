import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, Sprout, X } from "lucide-react";
import { PHONE, PHONE_HREF } from "./brand";
import { useBooking } from "./BookingModal";

const hashLinks = [
  { label: "Google Reviews", hash: "reviews" },
  { label: "The Plan", hash: "the-plan" },
  { label: "Trainers", hash: "trainers" },
  { label: "Pricing", hash: "pricing" },
  { label: "FAQ", hash: "faq" },
];

export function Navbar() {
  const { open } = useBooking();
  const [mobile, setMobile] = useState(false);
  const linkCls = "transition hover:text-foreground";
  const items = (
    <>
      {hashLinks.map((l) => (
        <Link key={l.hash} to="/" hash={l.hash} className={linkCls} onClick={() => setMobile(false)}>{l.label}</Link>
      ))}
      <Link to="/contact" className={linkCls} onClick={() => setMobile(false)}>Contact Us</Link>
    </>
  );
  return (
    <>
      <button onClick={() => open()} className="block w-full bg-primary px-4 py-2 text-center text-sm font-bold text-primary-foreground">
        🌱 NEW CLIENT SPECIAL: Buy One Get One Free on Intro Sessions! Use Code: BOGO at Booking →
      </button>
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <Link to="/" className="flex items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary text-primary-foreground">
              <Sprout className="h-5 w-5" />
            </span>
            <span className="hidden sm:inline">THE WORKOUT PLANT</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">{items}</nav>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden items-center gap-2 text-sm font-semibold xl:flex">
              <Phone className="h-4 w-4 text-primary" /> {PHONE}
            </a>
            <button onClick={() => open()} className="rounded-lg bg-primary px-4 py-2 text-sm font-bold text-primary-foreground transition hover:opacity-90">
              Book A Session
            </button>
            <button aria-label="Menu" onClick={() => setMobile((m) => !m)} className="rounded-lg border border-border p-2 lg:hidden">
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>
        {mobile && (
          <nav className="flex flex-col gap-4 border-t border-border px-6 py-4 text-muted-foreground lg:hidden">
            {items}
            <a href={PHONE_HREF} className="font-semibold text-foreground">{PHONE}</a>
          </nav>
        )}
      </header>
    </>
  );
}
