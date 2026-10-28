import { createFileRoute } from "@tanstack/react-router";
import { Smartphone } from "lucide-react";

export const Route = createFileRoute("/client-login")({
  head: () => ({
    meta: [
      { title: "Client Login | The Workout Plant" },
      { name: "description", content: "Log in to The Workout Plant App to access your workouts, recipes and coaching." },
      { property: "og:title", content: "Client Login | The Workout Plant" },
      { property: "og:description", content: "Access The Workout Plant App." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: () => (
    <section className="px-6 py-24">
      <div className="card-surface mx-auto max-w-xl p-10 text-center">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-xl bg-primary/15 text-primary"><Smartphone className="h-7 w-7" /></span>
        <h1 className="mt-6 text-3xl font-extrabold tracking-tight">Client Login</h1>
        <p className="mt-4 text-muted-foreground">To log in on mobile devices, please open The Workout Plant App using the invite link in your welcome email.</p>
      </div>
    </section>
  ),
});
