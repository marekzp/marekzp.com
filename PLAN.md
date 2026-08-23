# Website maintenance plan

## 1. `docs: add website maintenance roadmap`

- Commit both `TODO.md` and this `PLAN.md` so the audit findings and execution plan stay in repository history.
- Verify: Markdown renders cleanly and `git diff --check` passes.

## 2. `fix(cv): update web CV revision date`

- Commit the current `src/cv.ts` update to show August 2026 on `/cv/` and in its metadata.
- Leave `public/cv.pdf` unchanged, as requested. Its regeneration remains a tracked follow-up.
- Verify: `npm run check`, `npm run build`, and confirm `/cv/` contains August 2026.

## 3. Manual Cloudflare canonical-domain configuration

- Configure the Cloudflare `www` DNS record and permanently redirect it to `https://marekzp.com`.
- Redirect all HTTP traffic to HTTPS.
- No repository commit: this is DNS and dashboard configuration.
- Verify: `curl` shows one HTTPS canonical URL and `www` redirects to the apex.

## 4. Manual analytics and discovery configuration

- Enable Cloudflare Web Analytics, put its token in `src/site.ts`, and verify the beacon is present in production.
- Verify the domain in Google Search Console by DNS, submit the sitemap, and record the completion in `TODO.md`.
- No repository commit is needed unless the analytics token is deliberately stored in source.

## 5. Investigate local quality-gate failures

- Reproduce the Linkinator macOS and CI discrepancy with a clean `dist` directory, recording Node, npm, operating-system, and browser versions.
- Establish which pages Lighthouse actually audits. The intended minimum is `/` and one blog post.
- No commit until the root cause and supported execution environment are known.

## 6. `fix(tooling): stabilise local verification`

- Apply the confirmed Linkinator fix, make the check build or require a fresh `dist`, and declare Node 22 in `package.json` plus README.
- Document Chrome as a local Lighthouse prerequisite.
- Verify: `npm run check`, `npm run build`, `npm run linkcheck`, and `npx lhci autorun` pass in the documented environment.

## 7. `test(lighthouse): audit representative pages`

- Configure Lighthouse CI to audit the homepage and a representative blog post, then confirm the existing performance, accessibility, and SEO budgets apply to both.
- Verify: CI reports results for both URLs and fails when either budget regresses.

## 8. Manual Cloudflare security-header configuration

- Choose Cloudflare response-header rules or the supported Workers-assets mechanism before changing the repository.
- Configure HTTPS, HSTS only after redirects work, `X-Content-Type-Options`, and `Referrer-Policy`.
- Design a CSP that permits the two inline theme scripts and optional analytics beacon without weakening the policy unnecessarily.
- Verify the headers in production and confirm the theme toggle, analytics, and static assets still work.

## 9. `refactor(identity): derive site title`

- Derive the homepage title from the existing name, role, and employer values instead of maintaining a duplicate string.
- Verify: `npm run check`, `npm run build`, and inspect generated homepage metadata.

## 10. `docs: reconcile website documentation`

- Update README and SPEC claims about the role, the small inline theme scripts, Node and Chrome requirements, site-identity sources, and remaining deployment work.
- Correct the false `src/cv.ts` comment that says the PDF renders from that file. Document the chosen CV source of truth once it is decided.
- Verify: README instructions match `package.json`, CI, and the current implementation.

## 11. `feat(home): refine platform biography`

- Split the homepage biography into two paragraphs and remove the unsubstantiated “best-in-class” claim.
- Keep Generative AI Platform work primary and agentic engineering secondary.
- Verify: `npm run check`, `npm run build`, and inspect the homepage at desktop and mobile widths.

## 12. `feat(home): show writing descriptions`

- Pass post descriptions into the homepage `PostList` so readers can assess the writing without opening each post.
- Keep the existing reverse-chronological list and introductory post.
- Verify: `npm run check`, `npm run build`, and inspect homepage post listings.

## 13. `feat(nav): add CV link`

- Add a CV link to the global navigation without changing the existing visual system.
- Verify: `npm run check`, `npm run build`, `npm run linkcheck`, and keyboard navigation through the header.

## 14. `fix(cv): refresh the downloadable CV`

- Choose and document one CV source of truth, revise the summary to lead with the Generative AI Platform role, then regenerate `public/cv.pdf`.
- Update the web CV and PDF together to prevent another divergence.
- Verify: `npm run check`, `npm run build`, compare rendered `/cv/` content with extracted PDF text, and visually inspect the PDF.

## 15. `chore(content): migrate the deprecated schema API`

- Replace Astro's deprecated content-schema export with its supported equivalent.
- Verify: `npm run check` produces no deprecation hints and `npm run build` passes.
