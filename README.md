# marekzp.com

Personal site for Marek Zaremba-Pike. Astro, static output, two small inline
theme scripts, deployed to Cloudflare Workers static assets. See
[SPEC.md](SPEC.md) for what this site is for and [GUIDELINES.md](GUIDELINES.md)
for how it's built.

## Run

Use Node 22.

```sh
npm install
npm run dev        # http://localhost:4321
```

## Add a post

Create one Markdown file in `src/content/blog/` — that's the whole CMS:

```md
---
title: Post title
description: One line, ≤160 characters, used in meta tags and the blog index.
pubDate: 2026-07-05
draft: true # remove to publish; drafts are excluded from builds, RSS, and the sitemap
---

Post body.
```

The filename becomes the slug (`my-post.md` → `/blog/my-post/`).

## Checks

```sh
npm run check      # typescript + template checking
npm run build      # static build to dist/
npm run linkcheck  # internal link check over dist/ (external links skipped)
```

CI (GitHub Actions) runs all three on every PR and push to main, plus
Lighthouse CI against the built output with ≥95 budgets for performance,
accessibility, and SEO.

Local Lighthouse runs need Chrome or Chromium. If Lighthouse does not find the
macOS application automatically, run:

```sh
CHROME_PATH="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" npx lhci autorun
```

## Deploy

Push to `main` — the Cloudflare git integration builds and deploys.
`npx wrangler deploy` works as a manual escape hatch.

## Shared site identity

Shared identity data such as name, links, email, employer, and role lives in
[src/site.ts](src/site.ts). Page-specific copy lives beside its page, CV data
lives in [src/cv.ts](src/cv.ts), and posts live in `src/content/blog/`.

## OG image

`public/og-image.png` is static, rendered from
[scripts/og-image.html](scripts/og-image.html). To re-render after changing it:

```sh
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless \
  --disable-gpu --screenshot=public/og-image.png --window-size=1200,630 \
  --hide-scrollbars --allow-file-access-from-files \
  "file://$PWD/scripts/og-image.html"
```

## CV

`/cv/` renders from [src/cv.ts](src/cv.ts). `public/cv.pdf` is separately
exported from a gitignored CV document. The source document contains a phone
number, which is deliberately excluded from the web CV and PDF. Before the
next CV update, choose one source of truth and update both published versions
together.

## Dependencies (each needs a reason)

| Package | Reason |
| --- | --- |
| `astro` | The framework. |
| `@astrojs/rss` | Official RSS integration. |
| `@astrojs/sitemap` | Official sitemap integration. |
| `markdown-it` | Renders post Markdown to HTML for the full-content RSS feed (build-time only). |
| `sanitize-html` | Sanitises that rendered HTML before it goes in the feed (build-time only). |
| `@astrojs/check` / `typescript` | `npm run check`. |
| `linkinator` | Internal link checking in CI. |
| `@lhci/cli` | Lighthouse budgets in CI. |

The site ships no bundled application JavaScript. It has two small first-party
inline scripts for the theme toggle. The Cloudflare Web Analytics beacon is an
optional third-party script, included only once its token is set.

## Remaining manual configuration

1. **Cloudflare**: configure `www.marekzp.com` and a permanent redirect to
   `https://marekzp.com`, preserving the path. Redirect all HTTP traffic to
   HTTPS. Then add and verify the planned security headers.
2. **Analytics**: enable Cloudflare Web Analytics in the dashboard and paste
   the beacon token into `cloudflareAnalyticsToken` in `src/site.ts`.
3. **Search Console**: verify the domain via DNS TXT record in Cloudflare,
   then submit `https://marekzp.com/sitemap-index.xml`.
4. **Point profiles back here** — LinkedIn website field, GitHub profile URL,
   Substack about page. These inbound links are the single biggest lever for
   ranking on the name; `sameAs` alone is only half the loop.
5. **Email**: set up Cloudflare Email Routing for hello@marekzp.com → Gmail,
   then swap `email` in `src/site.ts`.
