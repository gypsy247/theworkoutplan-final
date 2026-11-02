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
- Centralize editable site content in src/data/siteContent.json and articles in src/data/articles.json; public consumers retain build-time JSON reads, while /admin edits isolated drafts and exports the two source-shaped JSON files because downloads must not claim to publish. CMS media lives in public/images; asset pointers stay untouched.
- Keep the custom Studio Manager in src/components/admin behind the /admin TanStack route, without public navbar/footer; its PIN is only a privacy screen for public-content drafts, never authorization for live writes.
- Store the editable shared logo path in studioInfo.logoImage so exported logo changes reach both navbar and footer after deployment.
- Use leaf TanStack route heads for canonical URLs and page metadata, with shared SEO helpers; root and index.html must not duplicate page-specific metadata.
- Preserve retired indexed URLs with HTTP 301 TanStack redirects, not SPA host fallbacks, because this site serves server-rendered pages on Lovable hosting.
- Share the real studio and app gallery between the homepage and photos page to keep images and captions consistent.
- Keep article content in src/data/articles.json (via src/data/articles.ts) and redirect known old slugs to the canonical article URL to avoid duplicate indexing.
