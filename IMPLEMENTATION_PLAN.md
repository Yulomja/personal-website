# Implementation plan

1. Use React, TypeScript, Next.js App Router and npm. Export a static website; no server-side runtime, database or CMS.
2. Serve complete English and German home, CV, projects and blog pages under `/en/` and `/de/`. The root is an English landing page. Retain the corresponding page when changing language.
3. Centralize sourced career content and localized interface copy. Include corrected education dates, contact details, languages, interests, current PostFinance work, certification and publication. Keep notably. clearly in development.
4. Store paired project and blog Markdown with stable translation ids. Validate metadata, dates, language pairs and uniqueness at build time; exclude drafts from metadata, listings and generated pages. Render Markdown safely without raw HTML execution.
5. Use a restrained, responsive visual foundation with self-hosted typography and accessible links, navigation and focus states. Detailed visual direction can be refined later.
6. Link matching English and German downloadable CV PDFs. Provide metadata and language alternates without inventing a production domain.
7. Verify content validation, locale mapping, types, static export and desktop/mobile browser behavior. Keep preview servers local; prepare the user-requested GitHub Pages deployment with a shared build-time mount prefix.
