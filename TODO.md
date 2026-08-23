# TODO

## Credibility and discoverability

- [ ] Configure `www.marekzp.com` and permanently redirect it to `https://marekzp.com`.
- [ ] Redirect HTTP traffic to HTTPS.
- [ ] Choose one CV source of truth, then regenerate `public/cv.pdf` and keep it aligned with `/cv/`. The web CV now says August 2026, but the downloadable PDF still shows the former role.
- [x] Derive the homepage title from the role and employer so it cannot drift from `jobTitle`.
- [x] Update `SPEC.md` to name the current Engineering Lead role.
- [ ] Enable Cloudflare Web Analytics and verify the site in Google Search Console.

## Reliability and security

- [ ] Verify `npm run linkcheck` in CI after the fixed-port workaround.
- [x] Document the required Chrome configuration for local Lighthouse runs.
- [ ] Add HTTPS, HSTS, Content Security Policy, `X-Content-Type-Options`, and `Referrer-Policy` response headers.
- [x] Replace Astro's deprecated `z` export in the content schema before a future upgrade turns the check hints into errors.

## Documentation

- [x] Correct the README's claim of zero first-party JavaScript: the site has a small inline theme-toggle script.
- [x] State the supported Node 22 runtime and document Chrome as a prerequisite for local Lighthouse checks.
- [x] Correct the README's claim that all identity data lives in `src/site.ts`; biography, CV content, and posts have separate sources.
- [x] Rename the README launch checklist to reflect the remaining deployment and discovery work.

## Content and navigation

- [ ] Revise the CV summary when the PDF is regenerated, leading with the Generative AI Platform role and positioning agentic engineering as the secondary theme.
- [x] Split the homepage biography into two paragraphs and remove the unsubstantiated “best-in-class” claim.
- [x] Pass each post's description to the homepage `PostList` so the writing section demonstrates the themes of the articles.
- [x] Add a CV link to the global navigation.

## Deliberately not planned

- Do not add original-publication metadata to the PR-review post. It was published on LinkedIn, not the Photoroom blog, and the site should not attribute it to LinkedIn.
- Do not hide “Why I'm writing here” from the homepage without evidence that it harms engagement. The post is already last in reverse-chronological order.
