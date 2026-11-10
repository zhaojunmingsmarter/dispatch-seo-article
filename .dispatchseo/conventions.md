# Keeta site facts

## Product

Keeta connects customers, restaurants and delivery partners through food delivery. This repository stages articles for the existing official site; it is not a web application (owner decision recorded in `README.md`). Current integration: BR English and Brazilian Portuguese, not every region on the global domain (`docs/publishing.md`).

Read fresh each research run:
- **Positioning:** `docs/product.md`, `README.md`; first-party local source, when available: `sailor_fe_c_pc/official/tpl/pages/home/br/en.njk`.
- **Capability:** `docs/reference/existing-posts.json`, `docs/publishing.md`; fresh official blog data and site pages when available. Reference snapshots are historical evidence, not current geography/pricing guarantees (`docs/product.md`).

Facets, in order: food delivery for customers; restaurant delivery partnerships; courier delivery partnerships. Every topic must lead naturally to Keeta's actual service, not this repo's engineering stack (`docs/product.md`).

## Stack & build

Staging: Node 22, npm 10.9.4, dependency-free JSON/HTML articles. `npm ci`; verify with `npm test && npm run build` and `git diff --check` (`package.json`, `.nvmrc`, `.github/workflows/content-check.yml`). Build emits additions-only JSON, not a website. Exact install and build commands have run successfully.

Existing website: React 18 + TypeScript + Nine. Separate repository and release process; its remote-script build has not been run by this installer (`docs/publishing.md`). Do not scaffold a second blog or assume Next.js/MDX/pnpm. Backend: local `127.0.0.1:3000`; GitHub-hosted phone-home schedules must be disabled after install merges (`.github/mcp-codex.toml`). Exception: `seo-token-check.yml` runs daily on the owner's Mac using the dedicated `dispatchseo-local-health` runner label. It must verify credential liveness and successful dashboard reporting; keep PR-triggered jobs on GitHub-hosted runners. Preserve this runner adaptation when updating the pipeline pack.

Local backend cron: the backend's native Node worker now owns the GSC schedule
and reads the same `docker/cron/crontab` as Docker deployments. The fallback
`.github/workflows/local-hourly-gsc.yml` is disabled; do not enable it alongside
the native worker. Local and server deployments run independent scheduler
instances with environment-specific configuration. The Mac runner is only for
this local instance's agent health check. A healthy cron can still report an
explicit GSC setup skip; that is not evidence of fresh GSC data.

## Guides

Files: `content/guides/{en,pt-BR}/<id>.json`. Full required BlogPosting contract and policies are in `docs/publishing.md` and enforced by `scripts/content.mjs`: id/filename, headline <=120 chars, description <=160, locale, dates, canonical, author/publisher, image, HTML body, section, keywords, numeric reading time and word count. No MDX/frontmatter. New slugs use lowercase ASCII kebab-case. Separate editorial review per locale.

Cover field: `image`, an array of absolute HTTPS asset URLs. Generate artwork in `public/blog/covers/` using `.dispatchseo/generate-cover.mjs`, then upload via the existing asset process. `/blog/covers/` is a local storage convention only; there is NO deployed URL-from-root prefix in this staging repo. Production uses CDN URLs as shown in `docs/reference/existing-posts.json`. Covers are expected; the existing website's placeholder does not waive that policy (`docs/publishing.md`).

Exemplars: the English and Portuguese entries in `docs/reference/existing-posts.json` (existing press releases: metadata/attribution examples, not proof that future guides meet the best-answer bar). Duplicate snapshot: `docs/reference/existing-slugs.json`; also check fresh source plus MCP `get_pages`.

Public URL: `https://www.keeta-global.com/BR/<locale>/blog/<id>`. Internal links use the exact existing locale path. The existing site's injection/template emits BlogPosting JSON-LD, title, description, canonical and keywords; no FAQPage emission is established. The inspected detail component has cover/author/recent posts but no automatic sticky ToC/product CTA rail. Preserve existing chrome; do not claim template-generated CTAs. Production sitemap, RSS and OG behavior is not verified here (`docs/publishing.md`).

Export: `npm run export:official -- --baseline <current-official-blog-posts.json> --out dist/blog-posts.merged.json`. Baseline is read-only, existing content retained, collisions fail. Without baseline, the output is additions only. Staging merge is not public deployment: website import/release plus live checks are separate (`scripts/content.mjs`, `docs/publishing.md`).

## Tools

Intended official public base: `/BR/<locale>/free-tools/<slug>`. No public tool renderer in this staging repo. First build integration steps: inspect current official routes, add an empty registry under the existing site's blog-adjacent content system, add React widgets, wire Nine index/detail routes and sitemap, follow the title/value/widget/CTA/description/FAQ funnel, update the real serve command and validate without login. Registry and widget paths must be established in that official-site PR rather than guessed as existing files. Reference: none yet - first build sets the reference (`docs/publishing.md`). The current artifact inspector is JSON only (`scripts/serve-artifacts.mjs`).

## Design system

Existing website visual references: `official/src/pages/blog/pc/index.less`, `pc/detail.less`, `pc/detail.tsx` in the inspected local source. Literal observed colors: accent `#FFE11C`, page `#FFFFFF`, title `#000000`, body `#3D3D3D`, muted `#999999`; these are observed literals, not invented CSS custom properties. Cards use image/title/date with hover scale and shadow; detail page uses breadcrumb, cover and recent-post cards. MT-Regular/NotoSans/KeeTa families appear in the existing home components. Publisher logo URL is in `docs/reference/existing-posts.json`. No design token/component runtime is copied into staging (`docs/publishing.md`, `docs/reference/site-style.md`).

## Voice & writing rules

Attribute BR articles to `Keeta Brasil` as Organization. Clear, concrete locale-appropriate English or Brazilian Portuguese; no invented quotes, stats, pricing, coverage, eligibility or promises. Reverify changing service claims from first-party sources. Historical examples contain press-release language; do not copy hype. No punctuation ban or humanizer skill exists in this repo. Required build-guide humanizing still applies. No first-person fabricated experiences. Do not translate or copy across locales without review (`docs/product.md`, `docs/publishing.md`).

## Analytics

Staging has no analytics runtime or event helpers. The inspected official template includes `official/tpl/partials/google.njk`, containing GTM `GTM-5X6JHLD8`; this establishes local template wiring only, not production ingestion or GA4 setup. No new event naming contract has been verified (`docs/reference/site-style.md`).
