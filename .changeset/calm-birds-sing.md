---
"@heygrady/eslint-config": patch
---

Fix ESLint configuration issues:
- Disable n/no-missing-import for TypeScript files since it doesn't properly resolve external package subpaths
- Fix vitest overrides to properly register @typescript-eslint plugin for TypeScript test files
- Fix markdown overrides to separate JS and TS file handling, ensuring @typescript-eslint rules only apply when the plugin is registered
- Add projectService: false for markdown code blocks to prevent project service errors
