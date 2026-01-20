/// <reference types="vitest/config" />
import { getViteConfig } from 'astro/config'

export default getViteConfig({
  // @ts-expect-error - Astro's getViteConfig doesn't include vitest types
  test: {
    /* for example, use global to avoid globals imports (describe, test, expect): */
    // globals: true,
  },
})
