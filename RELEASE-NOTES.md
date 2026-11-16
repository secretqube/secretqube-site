# Secret Qube website, 16 November 2026 (matches Flux 1.0.12 / versionCode 42)

## What changed
- Content corrected to the current app: Business = up to 30 destinations per rule; Pro and Business Plus removed from the site; 14-day trial = every Business feature, up to 3 destinations per rule; Free = 1 SMS rule with 1 destination that is not a link.
- RCS removed everywhere (the app forwards SMS only). "No servers" wording replaced by "no Secret Qube server in between" (Gmail, Telegram, email providers and links are still third-party services).
- New real app screenshots (cropped, no status bar; only sample rule data) replace the old HTML mock-ups: home, recipes, which messages, destinations, SIM, schedule, format.
- Landing page redesigned: dark hero with a tilting phone and floating destination chips, live routing demo, scroll-driven story with a sticky phone, feature cards with a light that follows the pointer, scroll-filled privacy headline, count-up numbers, language marquee, FAQ.
- All motion respects prefers-reduced-motion; the page is fully readable without JavaScript.
- support.html: new "Why does it ask for SMS permissions?" section; share description no longer mentions RCS/Slack/Sheets.
- assets/og.png rebuilt without "RCS". sitemap lastmod updated. privacy.html unchanged (15 Nov 2026 version).

## Files
index.html, landing.css (new), landing.js (new), main.js (shared parts only), lang.js, style.css (unchanged), support.html, assets/app-*.webp (new), assets/og.png.

## When Google Play approves the app
In index.html find the comment "After Google Play approves the app" and point that button at the Play listing ("Get it on Google Play"). Also change the first FAQ answer ("It is not live on Google Play yet").

## Verification
Rendered with Chromium (Playwright) at 1440px and 390px in English and Arabic: no horizontal overflow, language toggle, demo scenarios and scroll story tested. Google Fonts could not load in the test environment (system fallback font was used); check the Readex Pro rendering after deploy. NOT deployed to secretqube.com. Upload the folder contents, keeping CNAME and .nojekyll.
