# @heygrady/eslint-config

My personal, shared [ESLint](https://eslint.org/) configuration for ESLint 9+ with flat config.

## Installation

This package is hosted on [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). You'll need to configure your package manager to use the GitHub Packages registry for the `@heygrady` scope.

Create a `.npmrc` file in your project root with the following content:

```
@heygrady:registry=https://npm.pkg.github.com
```

Then, install the package:

```bash
yarn add -D eslint @heygrady/eslint-config
```

or with npm:

```bash
npm install --save-dev eslint @heygrady/eslint-config
```

## Usage

This package provides several configurations using ESLint 9's flat config format. Import the one that best fits your project in your `eslint.config.mjs` or `eslint.config.js` file.

### Node.js

For Node.js projects (CommonJS or ES Modules).

```js
// eslint.config.mjs
import node from '@heygrady/eslint-config/node'

export default [
  ...node,
]
```

### TypeScript + Node.js

For TypeScript projects running in Node.js (ES Modules).

```js
// eslint.config.mjs
import tsNodeEsm from '@heygrady/eslint-config/ts-node-esm'

export default [
  ...tsNodeEsm,
]
```

### TypeScript + React

For TypeScript projects using React (ES Modules).

```js
// eslint.config.mjs
import tsxReactEsm from '@heygrady/eslint-config/tsx-react-esm'

export default [
  ...tsxReactEsm,
]
```

### Astro

For Astro projects with TypeScript support.

```js
// eslint.config.mjs
import astro from '@heygrady/eslint-config/astro'

export default [
  ...astro,
]
```

### ZX

For scripts written with [zx](https://github.com/google/zx).

```js
// eslint.config.mjs
import zx from '@heygrady/eslint-config/zx'

export default [
  ...zx,
]
```

## Configuration Architecture

The package is organized into reusable modules:

```
lib/
├── commonExtensions.js  # Shared file extension lists
├── overrides/           # File-specific rule overrides
│   ├── astro.js
│   ├── configFiles.js
│   ├── jest.js
│   ├── json.js
│   ├── markdown.js
│   ├── testingLibrary.js
│   ├── typescript.js
│   └── vitest.js
├── rules/               # Shared rule configurations
│   ├── common.js
│   ├── import.js
│   ├── jsdoc.js
│   ├── node.js
│   └── prettier.js
└── settings/            # Plugin settings
    ├── import.js        # eslint-plugin-import resolver
    ├── jsdoc.js         # eslint-plugin-jsdoc
    ├── node.js          # eslint-plugin-n TypeScript support
    ├── react.js         # eslint-plugin-react
    └── zx.js            # zx globals
```

## Known Limitations

### eslint-plugin-n and TypeScript

The `n/no-missing-import` rule only applies TypeScript extension mapping when the **source file is TypeScript**. JavaScript files importing TypeScript files with `.js` extensions will fail validation.

**Workaround:** This config disables `n/no-missing-import` for JS files in `src/` and relies on `import/no-unresolved` with `eslint-import-resolver-typescript` instead.

## Migration from ESLint 8

If you're migrating from ESLint 8 with `.eslintrc.js` or `.eslintrc.cjs`:

1. Remove `@rushstack/eslint-patch` - it's no longer needed with flat config
2. Rename your config file to `eslint.config.mjs`
3. Update to use the import syntax shown above
