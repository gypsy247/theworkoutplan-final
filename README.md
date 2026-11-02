# The Workout Plant — Website

Marketing website for The Workout Plant, a private 1-on-1 personal training and nutrition coaching studio at 139 Frost St, Williamsburg, Brooklyn.

## Editing Content (No Code Required)

All editable site content lives in two JSON files:

- `src/data/siteContent.json` — promo banner, homepage hero, studio info, The Plan pillars, studio photos, app screenshots, trainers, pricing tiers, Google reviews, FAQs, and studio policies.
- `src/data/articles.json` — the full articles shown on the Articles pages.

You can edit these files directly, or use the Studio Manager:

- **Studio Manager** — open `/admin` and enter PIN `1390`. This is a convenience privacy screen, not secure authentication. Edit six content tabs, then select **Save & Download JSON** and download both files. Send them in the project chat to apply them, or replace the matching files in `src/data/`, then publish. Downloads do not update the live site. Unsaved drafts exist only in the current browser tab and disappear on refresh.
- **Pages CMS** — connect the repository at [pagescms.org](https://pagescms.org). Configuration: `.pages.yml` in the project root.

**Dynamic items:** Pricing tiers, reviews, FAQs, studio photos, and app screenshots support adding and confirmed removal. Blank new entries must be completed before exporting or publishing. Photo URLs may use existing `/images/` paths or HTTPS addresses. File uploads are not enabled because workspace policy blocks public storage buckets.

**Owner publishing:** Select **Save & Publish**, sign in with an existing owner account (email/password, Google, or Lovable), and publish. Only accounts explicitly assigned the `admin` role can write. Both JSON files are saved in one non-forced commit to `gypsy247/screenshot-to-sight-383`, branch `main`. Netlify status is checked separately; a commit alone does not establish that the site is live. Password resets use `/reset-password`.

**Hosting:** Lovable injects the GitHub connector and Cloud credentials into its server environment. A Netlify deployment must separately supply the required server environment and a compatible TanStack Start server adapter; Git sync does not copy Lovable secrets to Netlify. Never put these credentials in browser code or the repository. If the Netlify build is not configured to report a GitHub status, the dashboard cannot confirm it is live.

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
