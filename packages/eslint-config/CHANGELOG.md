# @heygrady/eslint-config

## 1.8.0

### Minor Changes

- 2044376: Mark packages as deprecated in favor of Biome and Vitest

### Patch Changes

- 2044376: Migrate from ESLint/Prettier to Biome for linting and formatting

## 1.7.1

### Patch Changes

- e5f5c0d: Improve README documentation with installation instructions, usage examples, and Yarn/npm configuration for GitHub Packages

## 1.7.0

### Minor Changes

- bd9d87d: - Rename react.js to react-base.js and solid.js to solid-base.js (breaking: import paths changed)
  - Presets now explicitly compose jsx-a11y where needed instead of bundling it
  - Remove eslint-plugin-storybook entirely (unused legacy feature)
  - Add comprehensive test suite with 380 tests covering all presets and compositions
  - Add TypeScript type checking for test files via `yarn check`

### Patch Changes

- 00b4d7f: - Disable n/no-extraneous-import for markdown code blocks since examples often reference packages not in package.json
  - Disable jsdoc/no-undefined-types and jsdoc/reject-any-type for TypeScript files (generics appear undefined, types redundant with TS)
  - Allow empty interfaces with @typescript-eslint/no-empty-object-type (common pattern for extensible types)
  - Add separate vitest config for .bench.\* benchmark files with vitest/consistent-test-it and vitest/expect-expect disabled (rule doesn't support bench())

## 1.6.1

### Patch Changes

- b3b808f: Fix ESLint configuration issues:
  - Disable n/no-missing-import for TypeScript files since it doesn't properly resolve external package subpaths
  - Fix vitest overrides to properly register @typescript-eslint plugin for TypeScript test files
  - Fix markdown overrides to separate JS and TS file handling, ensuring @typescript-eslint rules only apply when the plugin is registered
  - Add projectService: false for markdown code blocks to prevent project service errors

## 1.6.0

### Minor Changes

- c61c053: Upgrade to ESLint 9 flat config format with new entry points for different environments (node, ts-node-esm, tsx-react-esm, astro, zx)

## 1.5.1

### Patch Changes

- c804d1c: Upgrade packages; disable eslint prettier in astro files

## 1.5.0

### Minor Changes

- 3c6a3f9: Upgrade packages, fix some typos. Fixes vitest in ESLint.

## 1.4.0

### Minor Changes

- 1345b72: Fixing up some eslint stuff and updating the ts-node-esm package template.

## 1.3.1

### Patch Changes

- a1eeb5b: Typescript fixes

## 1.3.0

### Minor Changes

- 7dd00ea: Upgrade eslint-config-standard-with-typescript

## 1.2.4

### Patch Changes

- 31ea6fa: Upgrade all packages

## 1.2.3

### Patch Changes

- 88ea8b3: Upgrade all packages; Upgrade Astro.

## 1.2.2

### Patch Changes

- 4ec2872: Downgrade astro images, upgrade other packages to latest

## 1.2.1

### Patch Changes

- eb681c8: Upgrade package, fix typos, rename folders

## 1.2.0

### Minor Changes

- 0c61b6e: Enable eslint-plugin-eslint-comments and eslint-plugin-astro

### Patch Changes

- a9b1150: New Create Post Command
- 4483ae5: New post and some repo cleanup
- 993d388: Improving Eslint Config

## 1.1.0

### Minor Changes

- 501223c: Eslint Config

### Patch Changes

- 7794acb: Fixing a failed publish

## 1.0.1

### Patch Changes

- 3ec2b87: Publish packages to Github Package Registry
