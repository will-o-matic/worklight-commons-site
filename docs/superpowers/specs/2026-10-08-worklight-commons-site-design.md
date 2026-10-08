# Worklight Commons Site — Design

**Date:** 2026-10-08
**Status:** Approved in brainstorming; awaiting written-spec review

## Purpose

A credible public website for Worklight Commons LLC at `https://worklightcommons.com`. It must:

- satisfy Apple Developer Program **Organization** enrollment (a working site on the LLC's domain), and
- provide the **privacy URL** and **support URL** App Store Connect asks for.

Success = the site builds, deploys via GitHub Actions to GitHub Pages, serves on the custom domain over HTTPS (apex and `www`), and email at `info@worklightcommons.com` keeps working.

## Decisions

| Topic | Decision |
|---|---|
| Repo | `will-o-matic/worklight-commons-site`, **public**, `main` only (no `staging`) |
| Stack | Astro (static output), hand-written CSS, no UI framework, no Tailwind, no theme |
| Visual direction | **Patchwork commons** — chunky friendly sans (Bricolage Grotesque), quilt-square color blocks, projects as stitched "patches" |
| Font loading | Self-hosted via `@fontsource/bricolage-grotesque` (no Google Fonts request) |
| Contact | Email only (`mailto:info@worklightcommons.com`); no forms, no form services |
| Privacy scope | This website only; apps (e.g. Knit) have their own policies |
| JavaScript | None shipped to the browser |

## Design tokens

- Background `#fbf7ef` (cream), band `#efe6d3`, ink `#23302a`, muted text `#4b5a52`
- Patch palette: sage `#7a9e7e`, mustard `#e3a83b`, terracotta `#c7643f`, slate `#4f6d7a`, linen `#e8dcc4`
- Radii: 6px (quilt squares), 12px (cards), 14px (patches), pill buttons
- Stitch: `1.5px dashed` light border inset 6px inside each patch
- Text on colored patches must meet WCAG AA contrast; darken a patch color or switch to ink text where it doesn't.

## Pages

### Home `/`
1. **Nav** — logo (2×2 quilt mark + "worklight commons"), links: Projects (`#projects`), Support, Privacy.
2. **Hero** — headline "Built together. Made to make life a little better."; lede with the mission ("a collective of creators who build apps and systems to make the world a little better"); a decorative row of quilt squares (`aria-hidden`).
3. **How we work** — band with heading "Many hands, one quilt." and three values: Useful first / Made with care / Respectful (copy as in the approved mockup).
4. **Projects** (`#projects`) — one patch per entry in `src/data/projects.ts`: status label, name, blurb, outbound link. Knit Life Manager (`https://knitlifemanager.com`, "Makes managing complex households and lives easier.", status "Web app · live", sage). Followed by a dashed "More on the way" placeholder patch.
5. **Contact band** — "Say hello." with a pill `mailto:` button.
6. **Footer** — "© {current year} Worklight Commons LLC", links to Support and Privacy.

### Support `/support`
- Intro paragraph and the support email (`info@worklightcommons.com`).
- What to include: which app, device/browser, what happened (steps, screenshots welcome).
- Response expectation: "within a few business days."
- Note that each app may have its own help resources, with a link to Knit.

### Privacy `/privacy`
Plain-language policy for this website only, with a "Last updated" date:
- No cookies, analytics, trackers, accounts, or forms.
- Email you send is used only to reply and isn't sold or shared.
- Hosting by GitHub Pages, which may log visitor IP addresses for security; link to GitHub's privacy statement.
- Each app has its own privacy policy; this page doesn't cover them.
- Contact for privacy questions: `info@worklightcommons.com`.

### 404
Patchwork-styled "This patch is missing" page with a link home.

### Site-wide
- `<title>` and meta description per page; Open Graph/Twitter tags with `og-image.png` (1200×630, quilt + wordmark).
- `favicon.svg` = the 2×2 quilt mark.
- Responsive down to 360px wide; no horizontal scroll.
- Semantic landmarks, visible focus styles, `prefers-reduced-motion` respected (any hover motion disabled).

## Code structure

```
astro.config.mjs            site: "https://worklightcommons.com"
src/styles/global.css       tokens, base type, layout, patch/quilt/band styles
src/layouts/Base.astro      <head>, meta/OG, nav, footer, slot
src/components/Quilt.astro        decorative square row (props: count)
src/components/ProjectPatch.astro one project patch (props: Project)
src/components/ContactBand.astro  dark mailto band
src/data/projects.ts        typed Project[] list
src/pages/index.astro, support.astro, privacy.astro, 404.astro
public/CNAME                worklightcommons.com
public/favicon.svg, public/og-image.png
.github/workflows/deploy.yml
```

Adding a project = appending one object to `projects.ts`.

## Deploy

- `.github/workflows/deploy.yml`: on `push` to `main` and `workflow_dispatch` → `withastro/action` build → `actions/deploy-pages`. Permissions `pages: write`, `id-token: write`; concurrency group `pages`.
- On `pull_request` to `main`: build only (no deploy) as a check.

## Verification (before calling it done)

- `npx astro check` and `npm run build` succeed with no errors.
- Browser walk-through of every page at desktop and ~375px widths; screenshots reviewed.
- All links work (nav anchors, Knit, mailto, GitHub privacy link, 404 → home).
- Lighthouse accessibility ≥ 95 on Home, Support, Privacy.

## Rollout (manual steps Will performs; Claude provides exact instructions)

1. Claude creates the GitHub repo and pushes **only after Will approves** the locally built site.
2. Repo Settings → Pages → Source: GitHub Actions.
3. Account Settings → Pages → Verified domains: add `worklightcommons.com`, add the `_github-pages-challenge-will-o-matic` TXT record in Namecheap.
4. Namecheap Advanced DNS: remove parking/URL-redirect records for `@` and `www`; add `A @` → `185.199.108.153`, `.109.153`, `.110.153`, `.111.153`; `CNAME www` → `will-o-matic.github.io.`. Leave MX/mail records untouched.
5. Repo Settings → Pages → Custom domain `worklightcommons.com`; enable Enforce HTTPS once the cert issues.
6. Confirm apex and `www` load over HTTPS; send a test email to `info@`.

## Out of scope

Blog, contact form, analytics, member/team pages, staging environment, per-app privacy policies.
