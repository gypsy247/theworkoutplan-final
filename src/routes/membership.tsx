import { createFileRoute, Link } from "@tanstack/react-router";
import { CalendarDays, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/membership")({
  head: () => pageHead("/membership", "Membership | The Workout Plant", "Activate your Workout Plant account by booking a consultation or first 1:1 session, then access your coaching app using your welcome email."),
  component: MembershipPage,
});

function MembershipPage() {
  return (
    <section className="px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary">Membership</p>
        <h1 className="mt-3 text-4xl font-extrabold md:text-5xl">Create Your Account</h1>
        <p className="mt-8 text-lg leading-relaxed text-muted-foreground"><strong className="text-foreground">IMPORTANT!</strong> Complete your consultation or first session booking to activate your account and receive your invite link to The Workout Plant App.</p>
        <p className="mt-5 leading-relaxed text-muted-foreground">If you already have an account with us, please use your registered email address and password in The Workout Plant App (passwords must be between 5 and 15 characters; check your inbox or junk folder for your welcome email).</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Button asChild className="h-auto whitespace-normal px-5 py-3"><Link to="/book-a-session"><CalendarDays />Book 1:1 Intro Session (Code: BOGO)</Link></Button>
          <Button asChild variant="outline" className="h-auto whitespace-normal px-5 py-3"><Link to="/client-login"><LogIn />Existing Client Login</Link></Button>
        </div>
      </div>
    </section>
  );
}