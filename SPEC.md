# SPEC.md — marekzp.com personal site

## Purpose (read first)

Build a personal site for **Marek Zaremba-Pike** whose primary job is to rank #1 on
Google for his name and act as the canonical hub linking his professional identity
together. Secondary job: host original writing (blog) that accrues SEO authority to
his own domain rather than to his employer's.

Success criteria, in order:
1. Google indexes the site and associates it with the name "Marek Zaremba-Pike"
   (via content + JSON-LD Person schema).
2. Every profile that matters is linked from one page: GitHub, LinkedIn, Photoroom
   blog posts, Substack.
3. New blog posts can be added as plain Markdown files with zero framework work.
4. Site is fast (Lighthouse ≥95 across the board), accessible, and costs £0/month.

## Stack

- **Astro** (latest), static output. No client-side JS framework unless a specific
  component needs it (default: zero first-party JS shipped).
- **Deploy target: Cloudflare Workers with static assets** (not classic Pages — CF
  now recommends Workers for new projects). Use `wrangler` and provide a working
  `wrangler.jsonc`. Custom domain: `marekzp.com` (zone already in the account,
  currently empty).
- **Canonical host: apex** (`https://marekzp.com`). 301 `www` → apex. Astro
  `trailingSlash: 'always'`; canonical URLs include the trailing slash and must
  match the served URL exactly (no redirect hops on canonical links).
- Git repo pushed to GitHub under the `marekzp` account, repo name `marekzp.com`.
  Public repo (it doubles as portfolio evidence).
- Content collections for the blog (`src/content/blog/*.md` with typed frontmatter).

## Pages & routes

### `/` — the hub (single page, most important)
Sections, top to bottom:
1. **Intro**: Name (H1: "Marek Zaremba-Pike"), title line: "Staff Engineer,
   Head of Backend at Photoroom" (matches LinkedIn). One-paragraph bio (placeholder below, Marek will edit):
   > I lead the backend platform at Photoroom — Django and FastAPI serving 2,500+
   > requests per second — and build production AI systems: LLM gateways with
   > fallbacks, rate limiting and abuse prevention, and agentic coding pipelines
   > that ship the majority of our merged PRs. MSc Computer Science (Bath,
   > in progress). MBCS.
2. **Writing**: one reverse-chronological list of all posts. Photoroom posts
   are republished locally in full (see SEO section for canonical/attribution
   mitigations), labelled "originally on the Photoroom blog" in the list and
   attributed on the post page. Photoroom posts (confirmed complete Jul 2026):
   - "Senior Claude reviewer is not a good use of engineering talent" (19 May 2026) —
     https://www.photoroom.com/inside-photoroom/senior-claude-reviewer-is-not-a-good-use-of-engineering-talent
   - "The laptop is the wrong place to run coding agents" (22 Apr 2026) —
     https://www.photoroom.com/inside-photoroom/the-laptop-is-the-wrong-place-to-run-coding-agents
   - "AI coding guardrails are mostly the old guardrails" (26 Mar 2026) —
     https://www.photoroom.com/inside-photoroom/ai-coding-guardrails-are-mostly-the-old-guardrails
3. **Projects**: Savin Hood — UK income tax calculator (Rust + Python/Django
   backend, TypeScript + Astro frontend, built end-to-end with agentic tooling).
   Link to https://savinhood.com (repo is private, so link the product; swap in
   the GitHub link if/when it goes public).
4. **Elsewhere**: GitHub (https://github.com/marekzp), LinkedIn
   (https://www.linkedin.com/in/marekzp/), Substack
   (https://marekzp.substack.com), email: marekzp@gmail.com for now, swapped for
   hello@marekzp.com once routing is set up. No X/Twitter (account inactive —
   revisit if it comes back to life).

### `/blog/` — index of local posts
Reverse-chronological list: title, date, one-line description. No pagination
needed until >20 posts.

### `/blog/[slug]/` — post page
Rendered Markdown. Frontmatter: `title`, `description`, `pubDate`, `updatedDate?`,
`tags?`, `draft?`. Include one **seed post** so the blog isn't empty at launch —
placeholder title: "Why I'm writing here" (3–4 paragraphs, Marek will rewrite;
keep it honest and short, no filler).

### `/cv/` — curriculum vitae
Rendered from structured data in `src/cv.ts` (added Jul 2026): summary,
technologies, experience, personal projects, education, languages. Linked from
the hub's response block alongside a downloadable `/cv.pdf` (a print-styled
render of the same page). The phone number from the source document is
excluded everywhere — public site, public repo.

### Plumbing routes
- `/rss.xml` — via @astrojs/rss, full-content feed (Markdown rendered to HTML at
  build time via `markdown-it` + sanitised with `sanitize-html` — the two
  permitted build-time deps, documented in the README).
- `/sitemap-index.xml` — via @astrojs/sitemap.
- `/robots.txt` — allow all, reference the sitemap.
- Custom 404.

## SEO requirements (non-negotiable)

- **JSON-LD `Person` schema** on `/`:
  `name`, `alternateName: "marekzp"`,
  `jobTitle: "Staff Engineer, Head of Backend"`,
  `worksFor: {Organization: Photoroom}`, `url: https://marekzp.com`,
  `alumniOf: {CollegeOrUniversity: University of Bath}`,
  `memberOf: {Organization: BCS, The Chartered Institute for IT}`,
  `sameAs: [LinkedIn, GitHub, Substack]` — no X/Twitter (a `sameAs` pointing at
  an inactive profile weakens the identity claim). This is the machine-readable
  statement that ties every profile to one identity — it's the point of the
  whole site.
- **JSON-LD `BlogPosting`** on each post (headline, datePublished, author → Person).
- Unique `<title>` and `<meta name="description">` per page; canonical URLs
  (apex, trailing slash — see Stack); Open Graph + Twitter card tags (generate a
  simple OG image, can be static).
- Semantic HTML: one H1 per page, landmarks, descriptive link text.
- Photoroom posts are republished locally in full (Marek's call, Jul 2026,
  reversing the earlier link-out-only rule). Mitigations: every republished
  post carries a cross-domain `rel=canonical` to the Photoroom original
  (which concedes the ranking signal to Photoroom but avoids duplicate-content
  penalties) plus a visible "Originally published on the Photoroom blog"
  attribution. Known residual risks: Photoroom owns the copyright — get their
  OK — and the local copies accrue no SEO authority of their own.

## Analytics & verification

- **Cloudflare Web Analytics**: include the beacon `<script>` in the base layout
  behind a single config constant (token to be pasted in after Marek enables it
  in the CF dashboard). No cookies, no consent banner needed.
- **Google Search Console**: leave a commented slot in the `<head>` for the HTML
  verification tag as fallback; primary verification will be via DNS TXT record
  in Cloudflare (manual dashboard step — note it in the README).
- No Google Analytics. No cookie banner. No tracking beyond the CF beacon.

## Design brief

Audience: engineering leaders, recruiters, and engineers who clicked through from
LinkedIn or a Photoroom post. The page's single job: confirm in five seconds that
this is *the* Marek Zaremba-Pike who runs backend at Photoroom, then route the
visitor to proof (writing, code, LinkedIn).

Direction: quiet, precise, engineered — the design equivalent of a well-kept
codebase.

**Palette (decided): warm paper + cobalt.**
- Light: paper `#F1ECE1` background, ink `#1D1A14` text, muted `#5C564A`,
  accent `#2144C4`.
- Dark: `#161310` background, `#EAE4D6` text, muted `#A39B8B`,
  accent `#93A9FF`.
- Near-monochrome otherwise; the cobalt accent is used only for links and
  interactive states, never decoratively. Both accent pairs pass 4.5:1 on their
  backgrounds; re-verify in `tokens.css` if any value shifts.
- The beige-paper direction deliberately avoids the AI-default look by pairing
  with a sans display face and a cobalt (not terracotta) accent — do not drift
  toward cream + serif + terracotta in execution.

**Type (decided): IBM Plex superfamily, self-hosted.**
- Display: IBM Plex Sans SemiBold (600) — name/H1 only.
- Body: IBM Plex Sans Regular (400) / Medium (500).
- Mono: IBM Plex Mono — dates, metadata, code.
- One superfamily keeps the payload small and the feel consistent; the masthead
  identity comes from weight, scale, and the paper/cobalt palette rather than a
  novelty face.

**Signature element** (the one memorable thing): suggestion — render the
name/route metadata like structured log output or an HTTP response header block
(subtle, one instance, must stay legible and accessible; Plex Mono makes this
cheap). If that reads as gimmick in execution, cut it and let typography be the
signature.

- Zero stock imagery, zero decorative icons, no hero gradient, no cards-with-
  shadows grid. Whitespace and hierarchy instead.
- Quality floor: responsive to 320px, visible focus states, `prefers-reduced-
  motion` respected, dark mode via `prefers-color-scheme` (both modes designed,
  not auto-inverted), Lighthouse ≥95 performance/accessibility/SEO.

## Repo hygiene & delivery

- `README.md`: local dev (`npm run dev`), how to add a post (create one Markdown
  file), deploy (push to `main` — see below), the manual Cloudflare dashboard
  steps, and the launch checklist.
- **Deploy: Cloudflare git integration.** Push to `main` → CF builds and deploys.
  `wrangler.jsonc` stays in the repo (CF's build system uses it; `wrangler deploy`
  remains available as a manual escape hatch).
- CI: GitHub Action on PRs — build + `astro check` + link check must pass (see
  GUIDELINES quality gates). No deploy step in the Action.
- Conventional commits; small, reviewable history (this repo is itself portfolio
  evidence of his agentic workflow).
- `.editorconfig`, `.gitignore`, committed lockfile with no churn.

## Launch checklist (manual steps, in the README)

1. Connect the GitHub repo to Cloudflare Workers builds; attach custom domain
   `marekzp.com`; add the 301 `www` → apex redirect.
2. Enable Cloudflare Web Analytics; paste the beacon token into the config.
3. Verify domain in Google Search Console via DNS TXT record; submit the sitemap.
4. **Point every profile back at marekzp.com** — LinkedIn website field, GitHub
   profile URL, Substack about page. Outbound links + `sameAs` are only half the
   identity loop; these inbound links are the single biggest lever for success
   criterion #1.
5. Set up hello@marekzp.com routing (Cloudflare Email Routing → Gmail), then swap
   the email in `site.ts`.

## Explicit non-goals

- No CMS, no database, no auth, no newsletter signup (Substack handles email).
- No comments system.
- No multi-language.

## Decisions log (was: open items)

1. Photoroom posts: all three confirmed and listed in the Writing section
   (verified against photoroom.com bylines, Jul 2026).
2. Substack: https://marekzp.substack.com. X/Twitter: not shown, not in `sameAs`
   (account inactive).
3. Palette: warm paper + cobalt (see Design brief). Type: IBM Plex superfamily.
4. Email: show marekzp@gmail.com until hello@marekzp.com routing exists.
5. Deploys: Cloudflare git integration; CI on PRs is build-check only.
6. Photoroom posts republished in full locally (Jul 2026), reversing the
   original link-out-only rule, with cross-domain canonicals + attribution.
   Risk accepted by Marek after flagging: copyright sits with Photoroom
   (needs their OK) and canonicals concede the SEO value of those pages.
