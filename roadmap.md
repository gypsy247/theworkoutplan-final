# Studio update
- [x] Apply neon pink and black branding and four exclusively 1:1 training tiers across site-owned pages.
- [x] Add live Acuity booking to the popup and a dedicated booking page with policies and fallback link.
- [x] Add studio and app galleries ready for real photos/screenshots.
- [x] Place real logo, trainer portraits, studio photos and app screenshots across the site.
- [x] Add the supplied Google review quotes.
- [ ] Update group and Pilates listings inside Acuity (requires owner changes in external Acuity account).

# CMS
- [x] Add and remove pricing tiers, FAQs, reviews and gallery photos with source-compatible JSON exports; browser-tested all four dynamic collections.
- [x] Add owner sign-in, server-verified roles, atomic GitHub JSON commits, loading/error states and separate Netlify status checking.
- [ ] Assign publishing access to gypsytalha@gmail.com and verify authenticated publishing end-to-end (approved email supplied, but no matching registered account exists; owner must sign in first).
- [ ] Enable photo file uploads (workspace blocks public storage buckets; HTTPS photo URL entry works).
- [x] Remove legacy static admin files and verify /admin and /admin/ directly render the React PIN and six-tab flow; browser checks and eight focused tests pass.
- [ ] Confirm GitHub sync and Netlify deployment (requires owner checking Project settings → Git and Netlify deploy status).
- [x] Replace /admin with a six-tab visual editor, PIN privacy screen, in-tab drafts and verified JSON downloads (29 tests and end-to-end export check pass).
- [x] Centralize all site content into src/data/siteContent.json and src/data/articles.json; wire every section to read from them.
- [x] Copy all uploaded images into public/images for CMS media management.
- [x] Add Decap CMS (public/admin + config.yml), Pages CMS (.pages.yml), /admin hosting rewrites, and Netlify Identity invite redirect.
- [x] Remove remaining Pilates mentions from trainer roles/bios and gallery captions.
- [x] Retire the Netlify Identity requirement in favor of the user-selected PIN and JSON-download workflow.
- [x] Test prices, policies, booking flow and page layout.

# Indexed Google URLs
- [x] Add membership and studio photos pages, and update client login instructions.
- [x] Preserve retired service and articles URLs with permanent redirects.
- [x] Match requested metadata, canonical URLs, gym schema and sitemap using native server-rendered page heads and redirects instead of incompatible SPA hosting fallbacks.
- [x] Restore the sixth indexed hydration article using original indexed text from /post/tips-for-drinking-more-water (original image/link destinations unavailable).
- [x] Verify indexed links, page metadata, gallery and onboarding navigation: 17 pages return 200, four old URLs return 301, all nine gallery images load, 24 tests pass.