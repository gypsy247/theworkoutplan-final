# The Workout Plant — Website

Marketing website for The Workout Plant, a private 1-on-1 personal training and nutrition coaching studio at 139 Frost St, Williamsburg, Brooklyn.

## Editing Content (No Code Required)

All editable site content lives in two JSON files:

- `src/data/siteContent.json` — promo banner, homepage hero, studio info, The Plan pillars, studio photos, app screenshots, trainers, pricing tiers, Google reviews, FAQs, and studio policies.
- `src/data/articles.json` — the full articles shown on the Articles pages.

You can edit these files directly, or use a visual CMS connected to this GitHub repository:

- **Decap CMS** — available at `/admin` when the site is deployed on Netlify with Netlify Identity and Git Gateway enabled. Configuration: `public/admin/config.yml`.
- **Pages CMS** — connect the repository at [pagescms.org](https://pagescms.org). Configuration: `.pages.yml` in the project root.

Images uploaded through either CMS are stored in `public/images/` and referenced as `/images/...`.

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
