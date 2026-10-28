import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ConsultationForm } from "./ConsultationForm";
import { POLICIES } from "./data";

type Ctx = { open: (tierId?: string) => void };
const BookingContext = createContext<Ctx>({ open: () => {} });
export const useBooking = () => useContext(BookingContext);

export function BookingProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [tier, setTier] = useState<string | undefined>();
  return (
    <BookingContext.Provider value={{ open: (t) => { setTier(t); setOpen(true); } }}>
      {children}
      <Dialog open={isOpen} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">Book Your Intro Session</DialogTitle>
            <DialogDescription>Use code BOGO: buy one intro session, get the second free.</DialogDescription>
          </DialogHeader>
          <ConsultationForm key={tier ?? "none"} defaultTier={tier} onDone={() => setOpen(false)} />
          <div className="space-y-2 rounded-xl border border-border bg-background p-4 text-xs text-muted-foreground">
            <p><strong className="text-foreground">Cancellation:</strong> {POLICIES.cancellation}</p>
            <p><strong className="text-foreground">Late arrival:</strong> {POLICIES.late}</p>
            <p><strong className="text-foreground">Studio:</strong> {POLICIES.attire}</p>
          </div>
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
