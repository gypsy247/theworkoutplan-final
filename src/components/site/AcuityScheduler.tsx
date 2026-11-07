import { ExternalLink, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { POLICIES, SITE, TIERS } from "./data";
import { PHONE_HREF } from "./brand";

export const ACUITY_URL = SITE.acuityEmbedUrl;
export const ACUITY_FALLBACK = SITE.acuityDirectUrl;

export function AcuityScheduler({ tierId }: { tierId?: string | undefined }) {
  const tier = TIERS.find((item) => item.id === tierId);
  return (
    <div className="min-w-0 space-y-6">
      {tier && <p className="border-l-2 border-primary pl-3 text-sm font-semibold">{tier.name} · 1 Hour · ${tier.price}</p>}
      <div className="grid gap-5 border-y border-border py-6 text-sm md:grid-cols-2">
        <div>
          <h3 className="font-bold text-foreground">First-Timers</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">{POLICIES.firstTimers}</p>
          <Button asChild variant="link" className="mt-2 h-auto px-0"><a href={PHONE_HREF}><MessageCircle /> Introduce yourself</a></Button>
        </div>
        <div>
          <h3 className="font-bold text-foreground">What to Bring</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">Wear something comfortable and bring a water bottle. <strong className="text-foreground">No shoes</strong> in the studio! We provide towels and everything else you'll need.</p>
        </div>
        <div>
          <h3 className="font-bold text-foreground">Cancellation & Late Policy</h3>
          <p className="mt-2 leading-relaxed text-muted-foreground">{POLICIES.cancellation} {POLICIES.late}</p>
        </div>
        <p className="self-center font-bold text-primary">New client? Book your intro session to get started.</p>
      </div>
      <a href={ACUITY_FALLBACK} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm text-primary underline-offset-4 hover:underline">
        <span>Having trouble viewing the calendar? Open Scheduler in a New Tab ↗</span><ExternalLink className="h-4 w-4 shrink-0" />
      </a>
      <iframe src={ACUITY_URL} title="Schedule Appointment" width="100%" height="800" allow="payment" className="block min-h-[800px] w-full rounded-xl border-0 bg-scheduler" />
    </div>
  );
}