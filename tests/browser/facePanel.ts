import type { Page } from 'playwright'

export const facePanel = (page: Page, face: 'Front' | 'Back') =>
  page.getByRole('region', { name: `${face} artwork`, exact: true })

/** Turns on Advanced options, which stays on across reloads. */
export const showAdvanced = (page: Page) =>
  page.getByRole('checkbox', { name: 'Advanced options', exact: true }).check()
