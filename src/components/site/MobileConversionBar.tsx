import { MessageCircle, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLiveContent } from "@/lib/live-content";
import { useBooking } from "./BookingModal";

export function MobileConversionBar() {
  const { site } = useLiveContent();
  const { open } = useBooking();
  const bookingUrl = site.hero.primaryCtaUrl || site.studioInfo.bookingUrl;
  return (
    <aside aria-label="Quick contact and booking" className="mobile-conversion-bar fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 px-3 pt-3 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-lg grid-cols-[auto_auto_minmax(0,1fr)] items-center gap-2">
        <Button asChild variant="outline" className="h-[52px] w-[52px]" title="Call (917) 992-2395"><a href="tel:+19179922395" aria-label="Call (917) 992-2395"><Phone /></a></Button>
        <Button asChild variant="outline" className="h-[52px] w-[52px]" title="Text (917) 992-2395"><a href="sms:+19179922395" aria-label="Text (917) 992-2395"><MessageCircle /></a></Button>
        {bookingUrl ? <Button asChild className="h-auto min-h-[52px] whitespace-normal text-center font-bold"><a href={bookingUrl} {...(bookingUrl.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}>Book Intro Session</a></Button> : <Button onClick={() => open()} className="h-auto min-h-[52px] whitespace-normal text-center font-bold">Book Intro Session</Button>}
      </div>
    </aside>
  );
}