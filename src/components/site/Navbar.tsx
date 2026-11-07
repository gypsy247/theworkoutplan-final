import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { Menu, Phone, X } from "lucide-react";
import { PHONE, PHONE_HREF } from "./brand";
import { useLiveContent } from "@/lib/live-content";
import { useBooking } from "./BookingModal";
import { Button } from "@/components/ui/button";

const navLinks = [
  { label: "The Plan", to: "/the-plan" },
  { label: "Trainers", to: "/trainers" },
  { label: "Pricing", to: "/pricing" },
  { label: "Gallery", to: "/gallery" },
  { label: "Reviews", to: "/reviews" },
  { label: "FAQ", to: "/faq" },
] as const;

export function Navbar() {
  const { open } = useBooking();
  const { site } = useLiveContent();
  const PROMO = site.promoBanner;
  const SITE = site.studioInfo;
  const NAVBAR_BOOKING_URL = SITE.bookingUrl;
  const [mobile, setMobile] = useState(false);
  const linkCls = "transition hover:text-foreground";
  const items = (
    <>
      {navLinks.map((l) => (
        <Link key={l.to} to={l.to} className={linkCls} onClick={() => setMobile(false)}>{l.label}</Link>
      ))}
      <Link to="/contact" className={linkCls} onClick={() => setMobile(false)}>Contact Us</Link>
      <Link to="/client-login" className={`${linkCls} text-xs opacity-80`} onClick={() => setMobile(false)}>Client Login</Link>
    </>
  );
  return (
    <>
      {PROMO.enabled && (
        <Button onClick={() => open()} className="block h-auto w-full whitespace-normal rounded-none px-4 py-2 text-center text-sm font-bold">
          {PROMO.text}
        </Button>
      )}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
        <div className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-5 py-3 md:px-6 md:py-4 lg:flex lg:justify-between lg:gap-6">
          <Link to="/" className="flex min-w-0 items-center gap-2 font-display text-lg font-extrabold tracking-tight">
            <img src={SITE.logoImage} alt="The Workout Plant logo" className="h-9 w-9 shrink-0 rounded-full object-cover" />
            <span className="hidden sm:inline">THE WORKOUT PLANT</span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm text-muted-foreground lg:flex">{items}</nav>
          <div className="flex items-center gap-3">
            <a href={PHONE_HREF} className="hidden items-center gap-2 text-sm font-semibold xl:flex">
              <Phone className="h-4 w-4 text-primary" /> {PHONE}
            </a>
            {NAVBAR_BOOKING_URL ? (
              <Button asChild className="rounded-lg px-4 py-2 text-sm font-bold">
                <a href={NAVBAR_BOOKING_URL} {...(NAVBAR_BOOKING_URL.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Book A Session</a>
              </Button>
            ) : (
              <Button onClick={() => open()} className="rounded-lg px-4 py-2 text-sm font-bold">
                Book A Session
              </Button>
            )}
            <Button aria-label="Menu" variant="outline" size="icon" onClick={() => setMobile((m) => !m)} className="rounded-lg lg:hidden">
              {mobile ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
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
