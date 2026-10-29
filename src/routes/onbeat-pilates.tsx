import { createFileRoute, redirect } from "@tanstack/react-router";
import { LEGACY_REDIRECTS } from "@/lib/legacy-urls";

export const Route = createFileRoute("/onbeat-pilates")({
  beforeLoad: () => { throw redirect({ to: LEGACY_REDIRECTS["/onbeat-pilates"], statusCode: 301, replace: true }); },
});
