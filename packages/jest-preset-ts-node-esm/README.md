# @heygrady/jest-preset-ts-node-esm

> [!WARNING]
> **This package is deprecated.** I've moved to [Vitest](https://vitest.dev/) for all projects. This package will remain functional but is no longer actively maintained.
>
> Consider using Vitest for new projects.

A Jest preset for TypeScript projects using ES Modules.

## Installation

This package is hosted on [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). Configure your package manager to use the GitHub Packages registry for the `@heygrady` scope.

### Yarn (v2+)

Add to your `.yarnrc.yml`:

```yaml
npmScopes:
  heygrady:
    npmAlwaysAuth: true
    npmRegistryServer: "https://npm.pkg.github.com"
```

Then install:

```bash
yarn add -D @heygrady/jest-preset-ts-node-esm
```

### npm

Create a `.npmrc` file:

```
@heygrady:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install --save-dev @heygrady/jest-preset-ts-node-esm
```

## Usage

Create a `jest.config.js` file in your project:

```js
module.exports = {
  preset: '@heygrady/jest-preset-ts-node-esm',
}
```

Or extend it in `jest.config.mjs`:

```js
import preset from '@heygrady/jest-preset-ts-node-esm'

export default {
  ...preset,
  // your overrides here
}
```

## Features

- Uses [ts-jest](https://kulshekhar.github.io/ts-jest/) with ESM support
- Configures `ts-jest-resolver` for proper module resolution
- Supports TypeScript extensions: `.ts`, `.tsx`, `.cts`, `.mts`
- Supports JavaScript extensions: `.js`, `.jsx`, `.cjs`, `.mjs`
- Includes mocks for static assets (images, fonts, styles)
- CSS Modules support via `identity-obj-proxy`
- Default coverage thresholds: 75% for branches, functions, lines, and statements

## Test File Location

By default, tests should be placed in a `test/` directory with `.spec.ts` or `.spec.tsx` extensions:

```
test/
├── example.spec.ts
└── component.spec.tsx
```

## Coverage

Run tests with coverage:

```bash
jest --coverage
```

Coverage reports are output to `coverage/` directory.
