# Loredana Piazza — personal website

[Live website](https://yulomja.github.io/personal-website/en/)

A bilingual English/German CV, projects and blog website built with React, TypeScript and Next.js. Pages are exported as static files to `out/`, with English as the default language. No database or CMS is required.

## Run locally

Use Node.js 24 and npm:

```sh
npm ci
npm run dev
```

Open [localhost:3000](http://localhost:3000). English and German pages are available under `/en/` and `/de/`.

## Check and build

```sh
npm test
npm run typecheck
npm run test:pages
npm run build
npm start
```

`test:pages` checks an isolated export with the GitHub Pages path prefix. `build` validates content and creates the static website; `start` previews it locally. Stop the development server first if it uses the same port.

## Update content

Edit career information and interface copy in `lib/copy.ts`. Projects live in `content/projects/`; blog posts live in `content/posts/`.

Keep paired English and German Markdown files with the same `id`. Start from the existing getting-started templates, replace their content and metadata, then set `draft: false` in both translations to publish. Drafts stay off the website. Run a new build after content changes.

## CV PDFs

With Python 3 and ReportLab installed, regenerate both downloads with `python3 scripts/generate-cv.py`. Keep the PDFs in `public/cv/` consistent with the website’s career information.

## Deploy

Pushing to `main` automatically builds and deploys through `.github/workflows/deploy-pages.yml`. The GitHub Pages workflow can also be run manually from the repository’s Actions tab.
