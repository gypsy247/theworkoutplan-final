<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Keep brand colors in OKLCH semantic tokens in src/styles.css; the project uses Tailwind v4, so legacy CSS/config filenames are not applicable.
- Share Acuity scheduler and policy UI between the booking dialog and TanStack booking route to keep the two booking experiences consistent; load its embed script once in the root document.
- Centralize editable site content in source JSON; public consumers use useLiveContent(), hydrating via the uncached admin-publish GitHub API read, never raw GitHub CDN content. Compare site.updatedAt against the published-only browser backup so stale responses cannot undo confirmed saves.
- Studio publishes commit with a [skip ci] message and write public/site-content.json alongside the source JSON so Netlify never spends build minutes; uploaded photos are referenced by their raw.githubusercontent.com URL for the same reason.
- Studio login and publishing go through netlify/functions/admin-publish.ts: it checks admin credentials from server env, issues short-lived HMAC session tokens, and commits content with a server-held GitHub token; core logic lives alias-free in src/lib/admin-publish-core.ts so Netlify can bundle it.
- Preserve atomic source/runtime/photo commits rather than individual Contents PUTs; retry branch conflicts once from a fresh parent SHA and forward GitHub error statuses, never silently fall back to another repository.
- Keep repository operations in src/lib/netlify-publish.ts; non-forced main-branch writes detect concurrent changes, and a deployed studio-version.json release marker—not a commit—establishes live status.
- Use StudioSession once around the editor to hold the signed session token in memory only; Cloud clients and auth-attacher remain generated but unreferenced by the application.
- Keep the custom Studio Manager in src/components/admin behind the /admin TanStack route, without public navbar/footer; the email/password screen is the only gate.
- Do not recreate public/admin static files or a competing App.tsx/pages router; /admin belongs exclusively to TanStack Start so static hosting cannot shadow the dashboard.
- Store the editable shared logo path in studioInfo.logoImage so exported logo changes reach both navbar and footer after deployment.
- Use leaf TanStack route heads for canonical URLs and page metadata, with shared SEO helpers; root and index.html must not duplicate page-specific metadata.
- Preserve retired indexed URLs with HTTP 301 TanStack redirects, not SPA host fallbacks, because this site serves server-rendered pages on Lovable hosting.
- Share the real studio and app gallery between the homepage and photos page to keep images and captions consistent.
- Keep article content in src/data/articles.json (via src/data/articles.ts) and redirect known old slugs to the canonical article URL to avoid duplicate indexing.
- Render draft previews in same-origin iframes using a parent/source-checked postMessage handshake; preview frames skip remote content hydration so unsaved edits cannot be overwritten.
- Share public typography and mobile layout rules through the public-site wrapper and use fixed breakpoint font sizes, keeping text readable without viewport-scaled type.
- Normalize legacy facility photo keys through homepage-media into facilityImage; share provider-video URL conversion between editor and homepage so saved media renders consistently. Small video uploads use self-contained data URLs with a 3 MB cap to fit the existing JSON publish request; longer videos use hosted links.
