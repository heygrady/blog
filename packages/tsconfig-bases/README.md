# @heygrady/tsconfig-bases

Shared TypeScript configuration bases for various project types.

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
yarn add -D @heygrady/tsconfig-bases
```

### npm

Create a `.npmrc` file:

```
@heygrady:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install --save-dev @heygrady/tsconfig-bases
```

## Available Configurations

### TypeScript + Node.js (ESM)

For TypeScript projects running in Node.js with ES Modules.

```json
{
  "extends": "@heygrady/tsconfig-bases/ts-node-esm/tsconfig.json"
}
```

Extends: `@tsconfig/node24`, `@tsconfig/strictest`

### TypeScript + React (ESM)

For TypeScript projects using React with Vite.

```json
{
  "extends": "@heygrady/tsconfig-bases/tsx-react-esm/tsconfig.json"
}
```

Extends: `@tsconfig/vite-react`, `@tsconfig/strictest`

### TypeScript + Solid (ESM)

For TypeScript projects using SolidJS.

```json
{
  "extends": "@heygrady/tsconfig-bases/tsx-solid-esm/tsconfig.json"
}
```

Extends: `@tsconfig/vite-react`, `@tsconfig/strictest` (with JSX preserve for Solid)

### TypeScript Web (ESNext)

For TypeScript web projects targeting modern browsers.

```json
{
  "extends": "@heygrady/tsconfig-bases/ts-web-esnext/tsconfig.json"
}
```

Extends: `@tsconfig/vite-react`, `@tsconfig/strictest`

## Common Settings

All configurations include these defaults:

- `allowJs: true` - Allow JavaScript files
- `checkJs: false` - Don't type-check JavaScript files
- `declaration: false` - Don't emit declaration files (override as needed)
- `noEmit: true` - Type-checking only by default
- `isolatedModules: true` - Required for tools like esbuild/swc
- Strict mode enabled via `@tsconfig/strictest`
- Default includes: `src`, `test`
- Default excludes: `node_modules`, `dist`

## Customizing

Extend a base and override as needed:

```json
{
  "extends": "@heygrady/tsconfig-bases/ts-node-esm/tsconfig.json",
  "compilerOptions": {
    "declaration": true,
    "outDir": "dist"
  },
  "include": ["src"]
}
```
