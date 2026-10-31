import { createFileRoute, redirect } from "@tanstack/react-router";

// The CMS admin UI is a static file in public/admin/. This route sends
// /admin to it on hosts where the SPA router would otherwise 404.
export const Route = createFileRoute("/admin")({
  beforeLoad: () => {
    throw redirect({ href: "/admin/index.html" });
  },
});
