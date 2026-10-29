import { createContext, useContext, useState, type ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Link } from "@tanstack/react-router";
import { AcuityScheduler } from "./AcuityScheduler";

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
        <DialogContent className="max-h-[90vh] overflow-y-auto border-border bg-card sm:max-w-5xl">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-extrabold">Book A Session</DialogTitle>
            <DialogDescription>Use code BOGO: buy one intro session, get the second free.</DialogDescription>
          </DialogHeader>
          <Link to="/book-a-session" onClick={() => setOpen(false)} className="text-sm font-semibold text-primary hover:underline">Open the full booking page →</Link>
          <AcuityScheduler key={tier ?? "none"} tierId={tier} />
        </DialogContent>
      </Dialog>
    </BookingContext.Provider>
  );
}
