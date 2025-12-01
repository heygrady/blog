# @heygrady/eslint-config

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
