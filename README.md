# The Workout Plant — Website

Marketing website for The Workout Plant, a private 1-on-1 personal training and nutrition coaching studio at 139 Frost St, Williamsburg, Brooklyn.

## Editing Content (No Code Required)

All editable site content lives in two JSON files:

- `src/data/siteContent.json` — promo banner, homepage hero, studio info, The Plan pillars, studio photos, app screenshots, trainers, pricing tiers, Google reviews, FAQs, and studio policies.
- `src/data/articles.json` — the full articles shown on the Articles pages.

You can edit these files directly, or use the Studio Manager:

- **Studio Manager** — open `/admin` and enter PIN `1390`. This is a convenience privacy screen, not secure authentication. Edit six content tabs, then select **Save & Download JSON** and download both files. Send them in the project chat to apply them, or replace the matching files in `src/data/`, then publish. Downloads do not update the live site. Unsaved drafts exist only in the current browser tab and disappear on refresh.
- **Pages CMS** — connect the repository at [pagescms.org](https://pagescms.org). Configuration: `.pages.yml` in the project root.

Images are stored in `public/images/` and referenced as `/images/...`; the Studio Manager can change these references or use HTTPS image URLs. The former Decap configuration remains available for optional repository tooling, but its interface is no longer served at `/admin`.

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
