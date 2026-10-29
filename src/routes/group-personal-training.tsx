import { createFileRoute, redirect } from "@tanstack/react-router";
import { LEGACY_REDIRECTS } from "@/lib/legacy-urls";

export const Route = createFileRoute("/group-personal-training")({
  beforeLoad: () => { throw redirect({ to: LEGACY_REDIRECTS["/group-personal-training"], statusCode: 301, replace: true }); },
});
