import { createFileRoute } from "@tanstack/react-router";
import { AdminDashboard } from "@/components/admin/AdminDashboard";
import { pageHead } from "@/lib/site-seo";

export const Route = createFileRoute("/admin")({
  head: () => {
    const head = pageHead("/admin", "Studio Manager | The Workout Plant", "The Workout Plant studio content editor.");
    return { ...head, meta: [...head.meta, { name: "robots", content: "noindex, nofollow" }] };
  },
  component: AdminDashboard,
});
