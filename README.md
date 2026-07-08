# marekzp.com

Personal site for Marek Zaremba-Pike. Astro, static output, zero first-party
JS, deployed to Cloudflare Workers static assets. See [SPEC.md](SPEC.md) for
what this site is for and [GUIDELINES.md](GUIDELINES.md) for how it's built.

## Run

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

## Deploy

Push to `main` — the Cloudflare git integration builds and deploys.
`npx wrangler deploy` works as a manual escape hatch.

## Site identity

All identity data — name, links, email, external posts — lives in
[src/site.ts](src/site.ts). The hub page, JSON-LD, footer, and RSS read from
it; change a link there and every consumer updates.

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

`/cv/` renders from [src/cv.ts](src/cv.ts); `public/cv.pdf` is the PDF export
of the CV source document. The source .docx is gitignored — it contains a
phone number, which is deliberately excluded from `src/cv.ts` and the exported
PDF (public site + public repo). To update the CV: export a phone-number-free
PDF from the source document, replace `public/cv.pdf`, and update `src/cv.ts`
to match so the `/cv/` page stays in sync.

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

Nothing here ships JavaScript to the client. The only script on the site is
the Cloudflare Web Analytics beacon, and only once its token is set.

## Launch checklist (manual, once)

1. **Cloudflare**: connect this repo to Workers Builds — dashboard → Workers &
   Pages → Create application → Import a repository → `marekzp/marekzp.com`,
   project name `marekzp-com` (must match `name` in wrangler.jsonc), build
   command `npm run build`, deploy command `npx wrangler deploy`. The custom
   domain attaches automatically on first deploy (routes in wrangler.jsonc).
   Then add a 301 redirect from `www` to the apex: dashboard → marekzp.com
   zone → Rules → Redirect Rules → create a rule matching hostname
   `www.marekzp.com` → 301 to `https://marekzp.com` preserving the path
   (plus a proxied AAAA `www` → `100::` DNS record if none exists).
2. **Analytics**: enable Cloudflare Web Analytics in the dashboard and paste
   the beacon token into `cloudflareAnalyticsToken` in `src/site.ts`.
3. **Search Console**: verify the domain via DNS TXT record in Cloudflare,
   then submit `https://marekzp.com/sitemap-index.xml`.
4. **Point profiles back here** — LinkedIn website field, GitHub profile URL,
   Substack about page. These inbound links are the single biggest lever for
   ranking on the name; `sameAs` alone is only half the loop.
5. **Email**: set up Cloudflare Email Routing for hello@marekzp.com → Gmail,
   then swap `email` in `src/site.ts`.
