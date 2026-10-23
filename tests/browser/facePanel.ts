import type { Page } from 'playwright'

export const facePanel = (page: Page, face: 'Front' | 'Back') =>
  page.getByRole('region', { name: `${face} artwork`, exact: true })
