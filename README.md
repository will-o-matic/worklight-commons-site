# worklight-commons-site

The website for Worklight Commons LLC — https://worklightcommons.com

Static [Astro](https://astro.build) site, no client JavaScript, deployed to GitHub Pages by
`.github/workflows/deploy.yml` on every push to `main`.

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
npm test         # builds, then runs tests/ against dist/
npm run check    # astro type-check
```

## Add a project

Append an entry to `src/data/projects.ts`:

```ts
{ name: 'New Thing', url: 'https://newthing.example', blurb: 'One sentence.', status: 'iOS app · beta', tone: 'slate' },
```

`tone` is one of `sage | mustard | terracotta | slate` (see `src/data/tones.ts`; the tests enforce text contrast).

## Update the privacy policy

Edit `src/pages/privacy.astro` and change the `updated` date at the top.

## Regenerate the social preview image

`npm run og` rewrites `public/og-image.png`; commit the result.
