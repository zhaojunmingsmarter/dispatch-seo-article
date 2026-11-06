# Official-site article handoff

## Existing system

The owner selected article/workflow storage with publication through the existing Keeta website. No second content system is created here.

Inspected source: local `sailor_fe_c_pc`, branch `feature/zhaojunming-1103`, HEAD `3b050d1d884d7c5983fe1e99c5e3a87805b654ee`. Referenced working-tree files may include local changes; these observations are not a production deployment audit.

- `official/src/pages/blog/README.md`: production content source is `src/pages/blog/data/blog-posts.json`.
- `official/src/pages/blog/constants.ts`: only BR/en and BR/pt-BR are wired in this blog.
- `official/scripts/js/injectBlogsIntoNine.js`: builds detail entries and canonical URLs and injects list metadata in memory.
- `official/tpl/pages/blog/br/detail.njk`: emits BlogPosting JSON-LD, title, description, canonical and keywords. Its guard include is commented out; public 200 responses still require release-time verification.
- `official/src/pages/blog/pc/detail.tsx`: renders the author, cover, article HTML and recent posts; no automatic sticky ToC or product CTA rail is present in this inspected component.
- `official/package.json`: React 18/TypeScript/Nine; its full build invokes `pre-deploy`. This installation neither runs that remote-script build nor edits the official repository.

## Article contract

One JSON object per locale under `content/guides/<locale>/<id>.json`:

| Field | Contract |
| --- | --- |
| `@context`, `@type` | `https://schema.org`, `BlogPosting` |
| `id` | New slugs: lowercase ASCII kebab-case; must match filename; unique within locale |
| `headline`, `description` | Nonempty; repository editorial caps 120 / 160 characters |
| `inLanguage` | Exactly `en` or `pt-BR`, matching folder |
| `datePublished`, `dateModified` | Real `YYYY-MM-DD` dates; modified must not precede published |
| `mainEntityOfPage` | `WebPage` with `@id` = `https://www.keeta-global.com/BR/<locale>/blog/<id>` |
| `image` | Nonempty array of absolute HTTPS CDN URLs |
| `author`, `publisher` | `Organization`, `Keeta Brasil`, locale homepage URL; publisher includes ImageObject logo |
| `articleBody` | Reviewed HTML, not Markdown; no active scripts, event handlers, forms, embeds or active URL schemes |
| `articleSection`, `keywords` | Nonempty section and keyword array |
| `wordCount`, `readTime` | Positive word count and numeric reading time in minutes |

The limits and new-slug style are repository policies; historical source articles may differ. Existing articles are preserved without rewriting their metadata. English and Portuguese content require individual editorial review; no automatic cross-locale copying is implied.

## Handoff sequence

1. Call the current MCP workflow instructions and check `get_pages`, fresh official source slugs and the local slug snapshot.
2. Draft a localized article with evidence; generate a cover with `.dispatchseo/generate-cover.mjs` into `public/blog/covers/`. Upload through the existing approved asset workflow and put the resulting absolute CDN URL in `image`. A local cover path is not publicly hosted by this repo.
3. Run `npm ci`, `npm test`, `npm run build`, and `git diff --check`. Open a PR labeled `seo`. No sample article is staged by the installer.
4. At handoff, export with `--baseline` pointing at the CURRENT full official `blog-posts.json`. The exporter refuses duplicate locale/IDs, retains the original articles/order/extra metadata, and writes a separate merged artifact. Review the diff against the baseline; the official source is never edited by this command.
5. Submit the reviewed merged data through the official website's normal PR and release process. Asset upload, internal repository access and deployment are not configured by this installation.
6. Verify the final public URL without login/cookies, its rendered body, canonical and BlogPosting metadata, and sitemap coverage. Only then report it as publicly published. A staging PR or a valid JSON bundle is not live publication evidence.

`npm run build` without `--baseline` produces an ADDITIONS-ONLY artifact. Never copy that over the official site's full data file.

## Tools and future integration

This repository has no public runtime. The intended public tool surface, if implemented through a separate official-site change, is `/BR/<locale>/free-tools/<slug>`. A first tool build must add a registry, widget, index/detail renderer, route and sitemap integration in the existing site's React/Nine system; use the funnel contract from `get_instructions(build-tool)`, then verify logged-out 200 responses and interactivity. The renderer and public serving command must be wired before such a PR can pass browser validation. No tool-reference implementation has been inspected yet. This is an integration task for the first tool build, not evidence that a public tools home exists.

## Verification scope

This repository's CI checks article contracts and export behavior. `.dispatchseo/serve` starts a JSON artifact inspector on port 4173; it does not simulate public blog/tools pages. The official build, production sitemap and live anonymous article response remain part of website release validation. Sitemap/RSS/OG generation is not claimed for the staging repository.
