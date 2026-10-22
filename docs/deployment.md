# Deployment

[All documentation](README.md)

In GitHub, set **Settings -> Pages -> Build and deployment -> Source** to **GitHub Actions**. The `gh-pages` branch stores the built site; an explicit Pages deployment makes it live.

- `.github/workflows/deploy.yml` runs on every push to `master`: it tests, builds, and publishes production to the branch root, keeping any existing previews.
- `.github/workflows/preview.yml` is manual (**Actions -> Deploy Branch Preview -> Run workflow**): it publishes the selected branch under `preview/<branch-slug>/`.
- `.github/workflows/publish-pages.yml` runs after either workflow succeeds: it uploads the entire `gh-pages` branch as a Pages artifact, deploys it, and verifies that production and every retained preview serve the uploaded HTML. It can also be run manually to redeploy the stored site.

All three workflows share one concurrency group so production, previews, and Pages deployments cannot race. The final deployment runs from `master`, including after a feature branch preview, so the `github-pages` environment can keep its deployment restriction to `master`.

Pushing to `gh-pages` with `GITHUB_TOKEN` does **not** trigger a Pages build. A successful build-and-push workflow alone does not mean the live site was updated; check **Publish GitHub Pages** for the deployment result.

After a production build, check the live HTML against `dist` with `node .github/scripts/verify-pages.mjs https://andzhik.github.io/keychain-maker/ dist`. The check retries while Pages propagates; set `VERIFY_PAGES_ATTEMPTS=1` for an immediate pass/fail result.

The Vite base path is controlled by `VITE_BASE_PATH`, so the same build can target local preview, production, or a branch preview path.
