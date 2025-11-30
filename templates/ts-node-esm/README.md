# Package Template: ts-node-esm

New package template for TypeScript with Node ESM.

```sh
yarn add @heygrady/ts-node-esm
```

## Usage

This package supports both CJS and ESM formats. You will see `cjs`, `esm` and
`types` builds in the `dist` folder to support Common JS, ECMAScript Modules and
TypeScript respectively. In practice you should be able to import it however you
prefer and it will just work.

### TypeScript and ESM (preferred)

Node ESM and TypeScript support the same modern syntax for imports.

```ts
import { example } from "@heygrady/ts-node-esm";

console.log(example);
```

### CJS

Legacy Node supports Common JS require syntax for imports.

```cjs
const { example } = require("@heygrady/ts-node-esm");

console.log(example);
```

## Development

```sh
# build (in watch mode)
yarn dev

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
