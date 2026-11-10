# Keeta article staging and DispatchSEO workflows

This repository stores articles, covers and DispatchSEO workflow configuration for `www.keeta-global.com`. The owner selected **article storage integrated with the existing Keeta website**. It is not a standalone website and a merge here does not deploy a public page.

## Working with articles

Use Node 22 and npm 10. Each new article is a Schema.org `BlogPosting` JSON object at `content/guides/en/<id>.json` or `content/guides/pt-BR/<id>.json`. See [.dispatchseo/conventions.md](.dispatchseo/conventions.md), [the publishing contract](docs/publishing.md), and [existing reference posts](docs/reference/existing-posts.json).

```sh
npm ci
npm test
npm run build
```

`dist/blog-posts.additions.json` contains **only additions**. Never replace the official site's complete data file with this artifact.

To prepare an additive import against the current official website data:

```sh
npm run export:official -- --baseline /absolute/path/to/official/src/pages/blog/data/blog-posts.json --out dist/blog-posts.merged.json
```

The baseline is read-only. Review the merged result and submit the website data change through its existing review and release process. No deployment credential or automatic cross-repository publisher is configured here.

## DispatchSEO

Every run must first call `dispatchseo-www.get_instructions` for its workflow, confirm the returned project and domain, and follow its current instructions plus `.dispatchseo/conventions.md`. Never push directly to `main`; use a PR labeled `seo`.

Installed instruction version: `2026-09-27.1`. Pack version: `.dispatchseo/pipeline-version`.

The connected backend is local (`http://127.0.0.1:3000`). GitHub-hosted jobs cannot call it. After the install PR merges, disable the phone-home workflows as directed by the install playbook; keep the canary and tool validator enabled. The local builder requires the dashboard's automatic-build credential configuration. `.dispatchseo/serve` exposes JSON artifacts for local inspection only, not public article or tool pages.

IndexNow is an optional future integration; no IndexNow workflow was installed.

The daily SEO health check uses a dedicated self-hosted macOS runner labeled
`dispatchseo-local-health`, so it can reach the local backend. It runs only from
`main` on its daily schedule (12:18 Asia/Shanghai) or manual dispatch. The same
runner triggers `/api/cron/hourly-gsc` every three hours at :07 via
`local-hourly-gsc.yml`, using the encrypted `DISPATCHSEO_LOCAL_CRON_SECRET`
repository secret. Other phone-home workflows remain disabled. The Mac must be awake, logged in, and
serving DispatchSEO on port 3000 for the check to complete. Its runner is managed
by the GitHub runner LaunchAgent; installation files live outside this repo at
`~/.local/share/dispatchseo-health-runner`. Use `./svc.sh status`, `./svc.sh stop`,
or `./svc.sh start` there to manage it. A successful run requires the Codex key
check and an acknowledged report for `seo-token-check--www`; workflow success
must not hide failed steps or an unreachable reporting endpoint.
