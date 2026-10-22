# Improvement roadmap

This list covers remaining work verified against the checked-in code and workflows.
See the [user guide](user-guide.md) for current features and the
[development guide](development.md) for setup and commands.

## Add pull request verification

The deployment workflows run unit tests and a production build, but none runs on
`pull_request`. Browser regressions have a local command and are not run by any
workflow.

Add a dedicated CI workflow that:

- Runs on pull requests and pushes to `master`.
- Installs dependencies with `bun install --frozen-lockfile`.
- Runs `bun run test` and `bun run build` without publishing the site.
- Installs Node and Playwright Chromium, then runs `bun run test:browser`.
  On Linux, `bunx playwright install --with-deps chromium` installs the browser
  and its system dependencies; the browser-test script runs under Node.

There are no lint or format-check scripts in `package.json`. Configure those
tools and scripts before adding corresponding CI checks.
