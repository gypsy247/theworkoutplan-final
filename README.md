# The Workout Plant — Website

Marketing website for The Workout Plant, a private 1-on-1 personal training and nutrition coaching studio at 139 Frost St, Williamsburg, Brooklyn.

## Editing Content (No Code Required)

All editable site content lives in two JSON files:

- `src/data/siteContent.json` — promo banner, homepage hero, studio info, The Plan pillars, studio photos, app screenshots, trainers, pricing tiers, Google reviews, FAQs, and studio policies.
- `src/data/articles.json` — the full articles shown on the Articles pages.

You can edit these files directly, or use the Studio Manager:

- **Studio Manager** — open `/admin` on the deployed Netlify site. Sign in with Netlify Identity to publish, or enter PIN `1390` for draft-only preview access. Unsaved drafts exist only in the current browser tab and disappear on refresh.
- **Pages CMS** — connect the repository at [pagescms.org](https://pagescms.org). Configuration: `.pages.yml` in the project root.

**Dynamic items:** Pricing tiers, trainers, reviews, FAQs, studio photos, app screenshots and articles support adding, moving up/down and removal. Photos can use existing `/images/` paths, HTTPS addresses, or JPG/PNG/WebP/GIF uploads up to 10 MB each. Uploads are staged with previews and saved into `public/images/` with the next publish, keeping photos and content in one deploy.

**Owner publishing:** Select **Publish Changes Live**. Both JSON files, referenced uploaded photos and a release marker are saved in one non-forced commit to `The-Workout-Plant/theworkoutplant`, branch `main`. The dashboard polls the deployed release marker and only says “live” once that exact release is served. Concurrent branch updates stop the publish rather than overwriting them. This uses Git tree/commit APIs instead of sequential Contents PUTs to avoid partial multi-file deployments.

**Netlify owner setup:** Connect this repository and `main` branch to your Netlify site. Enable Identity with invite-only registration, invite the owner, and enable Git Gateway against this repository. Restrict Git Gateway's allowed roles to an owner-controlled publisher role and assign it to the invited owner in Netlify. Netlify—not the PIN or browser—must enforce that restriction. Use the Netlify TanStack Start/Nitro SSR adapter, not an SPA catch-all rewrite; build with `bun run build` and publish `dist` using the included Netlify configuration. The Netlify site must serve its own `/.netlify/identity` and `/.netlify/git` endpoints. No Lovable Cloud credentials or GitHub connector secrets are used by this app's publishing flow.

**Important:** Netlify Git Gateway is deprecated and may not be available for a newly configured site. If unavailable, use the dashboard's GitHub token fallback: create a fine-grained token restricted to this repository, granting Contents read/write. Enter it only in the password field in the dashboard, never in chat, source, or environment files. It is kept only in memory and cleared on refresh/sign-out. GitHub enforces token permissions and branch protections. There is no cross-owner Cloud role assignment in this workflow.

**Verification:** Real Netlify sign-in, Gateway authorization and deployment need checking on the owner's Netlify site. They cannot be established from the Lovable preview, whose origin is not the Netlify site.

Images are stored in `public/images/` and referenced as `/images/...`; the Studio Manager can change these references or use HTTPS image URLs. The former static Decap files have been removed so `/admin` is served only by the React dashboard.

## Development

Requires Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

## Built With

- TanStack Start (React + SSR)
- TypeScript
- Tailwind CSS
- shadcn/ui
