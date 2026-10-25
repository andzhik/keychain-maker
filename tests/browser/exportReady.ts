import type { Page } from 'playwright'

export const waitForExportReady = (page: Page, baseOnly = false) =>
  page.getByRole('button', { name: baseOnly ? 'Download .3mf (base only)' : 'Download .3mf', exact: true })
    .and(page.locator(':enabled')).waitFor()
