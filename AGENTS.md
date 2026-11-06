# Repository workflow

- This is an article staging repository for the existing Keeta official site, not a standalone web application. Preserve that scope.
- Before each DispatchSEO run call the connected `dispatchseo-www` MCP `get_instructions` for the requested workflow. Confirm the project is `keeta-global`, domain `www.keeta-global.com`, and repo `zhaojunmingsmarter/dispatch-seo-article`; then read `.dispatchseo/conventions.md` completely.
- Follow the current returned instructions. Report the instruction version. Never invent research metrics, product capabilities, publication evidence or deployment status.
- Use a branch and PR labeled `seo`; never push directly to `main`.
- Write JSON articles in `content/guides/{en,pt-BR}/`, not MDX. Before opening a content PR run `npm ci`, `npm test`, `npm run build`, and `git diff --check`.
- Read `docs/publishing.md` before exporting. Preserve every existing official article; do not replace the official data file with an additions-only artifact. Updates require an explicitly reviewed update task.
- Merging an article here means the staging change merged. Public publication requires the separate official-site import/release and live verification. Report this distinction in PRs, run output and page logs.
- Do not commit secrets, `.env` files, `node_modules` or generated `dist` output.
- Pipeline pack files are upstream-owned. Repo-specific facts belong in `.dispatchseo/conventions.md`, `publish-paths`, and `serve`; preserve runtime package-manager and Node detection.
