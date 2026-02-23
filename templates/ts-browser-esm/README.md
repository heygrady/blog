# @heygrady/ts-browser-esm

A TypeScript package template for browser environments with ESM builds, testing, and linting configured.

## Installation

This package is hosted on [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). You'll need to configure your package manager to use the GitHub Packages registry for the `@heygrady` scope.

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
yarn add @heygrady/ts-browser-esm
```

### npm

Create a `.npmrc` file in your project root:

```
@heygrady:registry=https://npm.pkg.github.com
```

Then install:

```bash
npm install @heygrady/ts-browser-esm
```

## Usage

This package is designed for browser environments and outputs `cjs`, `esm`, and `types` builds in the `dist` folder.

### TypeScript and ESM

```ts
import { message } from "@heygrady/ts-browser-esm";

console.log(message);
```

## Development

```sh
# build (in watch mode)
yarn dev

# check typescript types
yarn check

# build
yarn build

# lint
yarn lint

# fix linting errors
yarn format

# test
yarn test

# test (in coverage mode)
yarn coverage

# clean up generated files
yarn clean
```
