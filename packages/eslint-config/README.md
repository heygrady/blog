# @heygrady/eslint-config

My personal, shared [ESLint](https://eslint.org/) configuration.

## Installation

This package is hosted on [GitHub Packages](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry). You'll need to configure your package manager to use the GitHub Packages registry for the `@heygrady` scope.

Create a `.npmrc` file in your project root with the following content:

```
@heygrady:registry=https://npm.pkg.github.com
```

Then, install the package and its peer dependencies:

```bash
yarn add -D eslint @heygrady/eslint-config
```

or with npm:

```bash
npm install --save-dev eslint @heygrady/eslint-config
```

## Usage

This package provides several configurations. Extend the one that best fits your project in your `.eslintrc.js` or `.eslintrc.cjs` file.

It's recommended to use `@rushstack/eslint-patch/modern-module-resolution` to ensure ESLint can correctly resolve the configuration.

### Node.js

For Node.js projects (CommonJS or ES Modules).

```js
// .eslintrc.cjs
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@heygrady/eslint-config/node']
}
```

### TypeScript + Node.js

For TypeScript projects running in Node.js (ES Modules).

```js
// .eslintrc.cjs
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@heygrady/eslint-config/ts-node-esm']
}
```

### TypeScript + React

For TypeScript projects using React (ES Modules).

```js
// .eslintrc.cjs
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@heygrady/eslint-config/tsx-react-esm']
}
```

### ZX

For scripts written with [zx](https://github.com/google/zx).

```js
// .eslintrc.cjs
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  extends: ['@heygrady/eslint-config/zx']
}
```