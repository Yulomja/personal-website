# Loredana Piazza — personal website

A bilingual CV and project website built with React, TypeScript and the Next.js App Router. Pages are rendered at build time and exported to `out/`. English is the default; complete German pages live alongside it. No database, CMS, analytics or external font requests.

## Local development

Use Node.js 20.9 or newer (Node 22+ recommended) and npm.

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). The root is the English home page; `/en/` and `/de/` are the locale roots. The development server listens on loopback only.

```sh
npm test
npm run typecheck
npm run test:export
npm run test:pages
npm run build
npm start
```

`test:pages` runs the same isolated export audit mounted at `/personal-website`, verifying every exported internal link, image, PDF and runtime asset plus safe Markdown prefixes.

`test:export` builds a temporary isolated copy with paired published article fixtures to verify future publishing, translated slugs and draft exclusion. It cleans up afterwards and never changes working content.

`build` first validates all Markdown, including drafts, then creates the static export. `start` serves `out/` on loopback only at [localhost:3000](http://localhost:3000). Set `PORT=3001 npm start` for another port. Stop the dev server first if it uses the same port. `next start` is not used because this project exports static files.

## Content and translations

Professional facts and interface translations are in `lib/copy.ts`. Pages and dates have matching English and German versions; German uses Swiss spelling. Do not list React as a personal professional skill merely because it powers this website.

Projects live in `content/projects/` and posts in `content/posts/`. Add a pair of Markdown files such as `my-post.en.md` and `my-post.de.md`:

```yaml
---
id: a-stable-translation-id
locale: en
slug: my-post
title: A descriptive title
description: A short, accurate summary.
date: '2026-10-20'
tags: [Software]
draft: true
---
```

The German file must use the same `id` and `draft` status with `locale: de`. Slugs may differ: the language switch resolves translations by id. An id and slug must each be unique within a locale. Dates must be quoted real `YYYY-MM-DD` dates. Tags are an array of strings. Both language versions must exist, even for drafts.

Start with the paired getting-started templates. Replace their instructional text, metadata and examples with a real article. Set `draft: false` in **both** translations only when ready to publish. Drafts are excluded from navigation, listings, metadata and exported pages. Run `npm run validate:content` or `npm run build` to catch missing translations, invalid dates, malformed metadata and duplicates.

Supported Markdown includes headings, paragraphs, lists, links, images, code fences, tables and other GFM syntax. Raw HTML is discarded and output is sanitized; executable HTML and unsafe URLs are not supported. Place images under `public/images/` and reference them as `/images/name.webp` with useful alt text. The page title supplies the H1, so start article sections at H2. Use `lib/copy.ts` for UI copy rather than embedding a single-language label.

The renderer at `lib/routes/blog-post.tsx` generates only published translations. The first article introduces notably. in English and German. The paired getting-started templates remain unpublished drafts. Before `dev` or `build`, `prepare:routes` creates the dynamic article route only when published posts exist; Next.js static export requires non-empty dynamic route parameters. The generated `app/[locale]/blog/[slug]/page.tsx` is ignored. After publishing the first pair of posts, restart the dev server (or run a new build) to enable the article routes.

## CV PDFs

Matching downloadable files are in `public/cv/loredana-piazza-en.pdf` and `public/cv/loredana-piazza-de.pdf`. Regenerate with:

```sh
python3 scripts/generate-cv.py
```

The script requires Python 3 and ReportLab. It writes the public downloads and QA copies under `output/pdf/`. When changing career content, update and review both PDFs and `lib/copy.ts` together.

## Scope and configuration

Fonts are self-hosted from the installed DM Sans package. Dependencies are pinned through `package-lock.json`. The implementation was checked with Next.js 16.4.2, React 19.3.1 and TypeScript 7.0.2.

The build remains a static export. Production metadata uses `NEXT_PUBLIC_SITE_ORIGIN` for the actual host; canonical and alternate links include the configured mount path. No analytics, contact service or backend is introduced.

## GitHub Pages

The deployment workflow in `.github/workflows/deploy-pages.yml` targets the existing `Yulomja/personal-website` repository. It checks content and types, builds `out/`, uploads the Pages artifact, then deploys through the `github-pages` environment. It runs for pushes to `main` and manual dispatch. Configure **Settings → Pages → Build and deployment → Source: GitHub Actions** before the first deployment; availability depends on the repository's visibility and account plan. This workflow does not change repository visibility.

Pages supplies `base_path` and `origin` through `actions/configure-pages`; the expected project-site mount is `/personal-website`. Navigation, translated article links, Markdown links/images, downloads, fallback links and Next runtime assets share that build-time prefix. Local development defaults to no prefix.

To build the production layout locally:

```sh
NEXT_PUBLIC_BASE_PATH=/personal-website NEXT_PUBLIC_SITE_ORIGIN=https://yulomja.github.io npm run build
```

`out/` contains the site root; GitHub Pages mounts it below `/personal-website/`. Do not add another `personal-website` folder inside the artifact. To restore the ordinary loopback preview afterwards, run `npm run build` with those variables unset, then `npm start` as usual. The isolated `test:pages` command leaves the working `out/` untouched.

GitHub Pages serves the exported bilingual `404.html` for missing routes. Local preview additionally selects `/errors/de/` or `/errors/en/` for matching locale paths and preserves HTTP 404. A custom domain would require reviewing both build variables and Pages configuration.

The action versions were checked against their official repositories: [checkout](https://github.com/actions/checkout), [setup-node](https://github.com/actions/setup-node), [configure-pages](https://github.com/actions/configure-pages), [upload-pages-artifact](https://github.com/actions/upload-pages-artifact), and [deploy-pages](https://github.com/actions/deploy-pages).


See `PRODUCT.md`, `IMPLEMENTATION_PLAN.md` and `AGENTS.md` for scope and working conventions.
