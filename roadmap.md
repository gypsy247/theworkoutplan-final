# Homepage media controls
- [ ] Connect facility compression (1600px, 0.80), preview and clear controls; preserve legacy facility keys.
- [ ] Support training video watch/embed/file URLs and persistent file uploads with previews.
- [ ] Test media rules and verify draft uploads and homepage playback; real Netlify publishing remains dependent on owner configuration.

# Mobile layout and draft preview
- [x] Recheck all five manual-content grids in the iframe and add explicit mobile single-column safeguards and 20px card padding; each measures 335px wide inside the 375px frame, with desktop columns preserved.
- [ ] Replace unnamed review attribution only when real client identities are supplied; blocked on verified names/photos.
- [x] Replace draft summary with the real site in isolated 375px/1280px viewports, syncing unsaved edits and pending photos.
- [x] Improve public mobile typography, single-column layouts, feature tags and hero actions; add sticky call/text and booking bar.
- [x] Verify draft sync using simulated admin login, booking dialog and public layouts at 375px, 640px, 767px and 1280px; 37 focused tests pass.

# Admin authentication replacement
- [x] Inspect current authentication and publishing; existing Cloud auth is healthy and profiles/user_roles tables exist.
- [x] Confirm no additional profile data and authorized admin email gypsytalha@gmail.com; no matching auth account currently exists.
- [ ] Replace login and add password recovery with no public registration; requires invited admin account, verified hosted signup/redirect settings and independent publishing configuration before replacing current access.
- [ ] Preserve publishing behind server-side admin checks; requires a client-owned server publishing connection and verified Netlify configuration.
- [ ] Verify authorized login, rejection of unauthorized users, recovery, image upload and real live publishing before removing old access options.

# Client revisions (Nov 2026)
- [x] Add dedicated routes /the-plan, /trainers, /pricing, /gallery, /reviews, /faq and point nav/footer at them.
- [x] Make /membership a private noindex PT Distinction funnel page, unlinked from nav and footer.
- [x] Disable BOGO banner, rename hero CTA, remove tier badges/featured highlight.
- [x] Upgrade reviews to a Google-style feed (6 reviews, dates, tags, See All button) with optional widget script in /admin.
- [x] Add Watch How We Train video showcase and 139 Frost St facility banner (URLs editable in /admin).
- [x] Expand gallery into filterable tabbed lightbox gallery ("The Studio & Our Community in Action").
- [ ] Supply the real training video URL and panoramic facility photo (currently empty placeholders).

# Studio update
- [x] Apply neon pink and black branding and four exclusively 1:1 training tiers across site-owned pages.
- [x] Add live Acuity booking to the popup and a dedicated booking page with policies and fallback link.
- [x] Add studio and app galleries ready for real photos/screenshots.
- [x] Place real logo, trainer portraits, studio photos and app screenshots across the site.
- [x] Add the supplied Google review quotes.
- [ ] Update group and Pilates listings inside Acuity (requires owner changes in external Acuity account).

# CMS
- [x] Replace Cloud publishing with standalone Netlify Identity/Git Gateway and optional in-memory GitHub token access.
- [x] Add repository photo uploads and add/reorder/delete support for every repeated editor collection.
- [x] Test standalone editor and simulated publishing behavior; 51 tests pass, photo previews and collection controls browser-verified, Netlify owner setup documented.
- [x] Add and remove pricing tiers, FAQs, reviews and gallery photos with source-compatible JSON exports; browser-tested all four dynamic collections.
- [x] Add Netlify owner sign-in, provider-enforced permissions, atomic GitHub JSON/image commits, loading/error states and deployed release verification.
- [ ] Verify real Netlify owner login and live publishing end-to-end (requires the owner's Netlify site with Identity and Git Gateway enabled).
- [x] Remove legacy static admin files and verify /admin and /admin/ directly render the React PIN and six-tab flow; browser checks and eight focused tests pass.
- [ ] Confirm GitHub sync and Netlify deployment (requires owner checking Project settings → Git and Netlify deploy status).
- [x] Replace /admin with a six-tab visual editor, PIN privacy screen, in-tab drafts and standalone publishing controls.
- [x] Centralize all site content into src/data/siteContent.json and src/data/articles.json; wire every section to read from them.
- [x] Copy all uploaded images into public/images for CMS media management.
- [x] Keep Pages CMS (.pages.yml), remove retired Decap static files, and configure standalone Netlify SSR hosting.
- [x] Remove remaining Pilates mentions from trainer roles/bios and gallery captions.
- [x] Keep PIN preview mode alongside Netlify Identity publishing; no manual downloads required.
- [x] Test prices, policies, booking flow and page layout.

# Indexed Google URLs
- [x] Add membership and studio photos pages, and update client login instructions.
- [x] Preserve retired service and articles URLs with permanent redirects.
- [x] Match requested metadata, canonical URLs, gym schema and sitemap using native server-rendered page heads and redirects instead of incompatible SPA hosting fallbacks.
- [x] Restore the sixth indexed hydration article using original indexed text from /post/tips-for-drinking-more-water (original image/link destinations unavailable).
- [x] Verify indexed links, page metadata, gallery and onboarding navigation: 17 pages return 200, four old URLs return 301, all nine gallery images load, 24 tests pass.

# GitHub repository
- [x] Recreate the owner repository as gypsy247/theworkoutplant (previous repo was deleted) and push all latest project files; publish flow constant updated.
- [ ] Re-link the Netlify site to the new repository (old repo deletion broke the deploy connection) — needs the owner in Netlify.

# Studio Manager live publishing (Nov 2026)
- [x] Remove all BOGO/Buy One Get One/promo-code copy from articles, consultation form, contact, booking, terms and privacy pages.
- [x] Add editable "The Plan" tab (badge, headline, intro, philosophy, 3 pillars) rendering on homepage and /the-plan.
- [x] Add editable gallery category names syncing to homepage and /gallery filter tabs.
- [x] Add "Add New Trainer", per-item remove, booking link URL fields (navbar, hero, per pricing tier) and a Desktop/Mobile live preview drawer in /admin.
- [x] Publish with [skip ci] commits plus public/site-content.json, a public ?action=content endpoint, runtime hydration on every page, repo-owner fallback and clear GITHUB_TOKEN/GITHUB_REPO errors; uploaded photos referenced via raw.githubusercontent.com URLs.
- [ ] Verify real zero-build publishing end-to-end on the owner's Netlify site (requires ADMIN_PASSWORD, GITHUB_TOKEN and GITHUB_REPO env vars set in Netlify).