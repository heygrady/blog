---
"@heygrady/eslint-config": minor
---

- Rename react.js to react-base.js and solid.js to solid-base.js (breaking: import paths changed)
- Presets now explicitly compose jsx-a11y where needed instead of bundling it
- Remove eslint-plugin-storybook entirely (unused legacy feature)
- Add comprehensive test suite with 380 tests covering all presets and compositions
- Add TypeScript type checking for test files via `yarn check`
