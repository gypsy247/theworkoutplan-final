import { Button } from "@/components/ui/button";
import { pageHead } from "@/lib/site-seo";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";

export const Route = createFileRoute("/client-login")({
  head: () => pageHead("/client-login", "Client Login | The Workout Plant", "Client login portal for The Workout Plant app, workout tracking, and personalized nutrition guides."),
  component: () => (
    <section className="px-6 py-24">
      <div className="card-surface mx-auto max-w-xl p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary/15 text-primary"><Smartphone className="h-7 w-7" /></span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Client Login</h1>
        <p className="mt-4 text-muted-foreground">To log in on mobile devices, you must use The Workout Plant app. Please follow the link in your welcome email.</p>
        <p className="mt-4 text-muted-foreground">Your welcome email includes your app download and access instructions. Check your inbox or junk folder, then sign in with your registered email address and password.</p>
        <p className="mt-4 text-muted-foreground">Missing your invite or having trouble downloading or accessing the app?</p>
        <Button asChild variant="outline" className="mt-6"><Link to="/contact">Contact Us for App Support</Link></Button>
      </div>
    </section>
  ),
});
