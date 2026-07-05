# GUIDELINES.md — style & architecture for marekzp.com

Companion to SPEC.md. SPEC says what; this says how. When they conflict, SPEC wins.

## Architecture

### Project layout

```
src/
  content/
    blog/                 # one .md file per post — this is the whole CMS
    config.ts             # zod schema for frontmatter (strict, no optional-by-accident)
  layouts/
    Base.astro            # <head>, meta/OG/JSON-LD plumbing, header, footer
    Post.astro            # extends Base; article layout, BlogPosting schema
  components/             # .astro only; smallest useful set (PostList, Prose, ExternalLink…)
  pages/
    index.astro           # the hub
    blog/index.astro
    blog/[...slug].astro
    rss.xml.ts
    404.astro
  styles/
    tokens.css            # design tokens: the only place raw values live
    global.css            # reset + base typography + prose styles
  site.ts                 # single source of truth for identity (see Principles)
public/
  fonts/                  # self-hosted IBM Plex woff2 files
  favicon set, og-image, robots.txt
```

### Principles

- Static-first, zero JS by default. No `client:*` directives unless a feature is
  impossible without them (currently: none). If one appears in a diff, that's a
  smell — justify it in the PR description or remove it.
- Content is data. Posts are Markdown with schema-validated frontmatter (`title`,
  `description` ≤160 chars, `pubDate`, `updatedDate?`, `tags?`, `draft?: boolean`
  — drafts excluded from builds, RSS, and sitemap). Adding a post must never
  require touching a template.
- One source of truth for identity. Site metadata (name, title, URLs for
  GitHub/LinkedIn/Substack/Photoroom posts, email) lives in a single `src/site.ts`
  config object. The hub page, JSON-LD, footer, and RSS all read from it. When a
  link changes, one edit updates everything — this is the plumbing lesson the
  whole project exists to fix. (The pending gmail→hello@ swap is exactly one line
  here.)
- Dependencies: Astro + official integrations (@astrojs/rss, @astrojs/sitemap),
  plus exactly two build-time deps for the full-content RSS feed: `markdown-it`
  (render Markdown to HTML) and `sanitize-html` (sanitise it for the feed).
  Neither ships to the client. Every dependency needs a reason written in the
  README; these two are the existing exceptions. No date libraries (use `Intl`),
  no CSS frameworks, no icon packs (inline the 3–4 SVGs needed).
- TypeScript strict (`astro/tsconfigs/strict`). No `any`. Frontmatter types come
  from the content collection schema, not hand-written interfaces.

### CSS approach: vanilla CSS with custom properties (no Tailwind)

Rationale: the site is small, the design is bespoke, and tokens-as-custom-
properties keep the design system inspectable in devtools and portable to any
future stack. Rules:

- `tokens.css` defines all raw values: colours (light + dark via
  `prefers-color-scheme`), type scale, spacing scale, radii, transitions.
  Components reference tokens only — a raw hex or px in a component file is a bug.
- Core colour tokens (from SPEC's decided palette):

  ```css
  :root {
    --bg: #F1ECE1;        /* paper */
    --text: #1D1A14;      /* ink */
    --text-muted: #5C564A;
    --accent: #2144C4;    /* cobalt — links/interactive only */
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --bg: #161310;
      --text: #EAE4D6;
      --text-muted: #A39B8B;
      --accent: #93A9FF;
    }
  }
  ```

  Derived tokens (hover states, focus ring, borders, code background) are defined
  in `tokens.css` from these — never inline. Any change to an accent/background
  pair must re-verify 4.5:1 contrast in both modes.
- Scoped styles in `.astro` files for component-specific layout; `global.css`
  owns typography and prose. No utility-class soup, no `!important`.
- Spacing/type scales are modular (e.g. 1.25 ratio), not ad-hoc values.
- Watch selector specificity: prefer classes, keep flat, don't let a `.section`
  type-selector fight an element selector over margins.

## Style guide (visual)

Derives from SPEC's design brief; these are the concrete rules.

- Palette: near-monochrome warm paper (see tokens above). One accent — cobalt —
  used only for interactive states (links, focus, hover). Accent passes 4.5:1 on
  both backgrounds. Never use the accent decoratively.
- Type: IBM Plex superfamily, 2 families / 3 roles — IBM Plex Sans SemiBold 600
  (name/H1 only), IBM Plex Sans 400/500 (body), IBM Plex Mono (dates, metadata,
  code). Self-host woff2 subsets via `@font-face` with `font-display: swap` and
  preload the body face; no Google Fonts CDN (performance + EU privacy). Subset
  to latin; expect ~4 font files total (Sans 400/500/600, Mono 400). Line length
  capped ~70ch; body ≥16px; real type scale from tokens.
- Signature element: one only (per SPEC). Execute it subtly or cut it.
- Motion: at most one considered transition (e.g. link underline, theme fade).
  Everything inside `@media (prefers-reduced-motion: no-preference)`.
- Imagery: none decorative. OG image is generated once, static, text-based, on
  the paper/ink palette.

## Style guide (writing/copy)

- Sentence case everywhere, including headings and buttons.
- Links say where they go ("AI coding guardrails — Photoroom blog"), never
  "click here" / "read more".
- External links marked visually or with "↗"; no `target="_blank"` on internal
  links.
- Dates: `12 Jan 2026` format, `<time datetime>` always, set in Plex Mono.
- No filler bio-speak ("passionate", "results-driven"). Plain claims with proof
  links.

## Quality gates (CI enforces what it can)

- Build passes; no TypeScript errors (`astro check`); no broken internal links
  (separate link-check step — `astro check` does not check links).
- Lighthouse budgets: ≥95 performance / accessibility / SEO on `/` and one post,
  run in CI via Lighthouse CI against a locally served `astro preview` build
  (there is no preview deploy). Total transfer for `/` ≤ 150KB excluding fonts;
  **0KB first-party JS** (the Cloudflare Web Analytics beacon is third-party and
  explicitly excluded from this budget — it is the only script on the site).
- HTML validates; exactly one `<h1>` per page; heading levels never skip.
- Keyboard walk-through: every interactive element reachable, visible focus.
- JSON-LD validates against schema.org (test with a validator before first
  deploy).

## Git & workflow

- Conventional commits (`feat:`, `fix:`, `content:` for posts, `chore:`).
- Small commits with honest messages — the history is portfolio evidence.
- `main` deploys via Cloudflare git integration; work in branches; PRs even solo
  (they trigger CI and read well to visitors).
- README documents: run, add-a-post, deploy, and the launch checklist (see SPEC).

## Things that look like improvements but aren't (don't add)

- Tag pages, search, pagination, reading-time badges, view counters — YAGNI
  below ~20 posts; each adds surface without serving the two success criteria.
- A headless CMS. The CMS is `git`.
- Analytics beyond the CF beacon.
- Auto-generated OG images per post (nice later; static is fine at launch).
- A manual dark-mode toggle. `prefers-color-scheme` only — a toggle means JS and
  a stored preference for no real gain at this scale.
