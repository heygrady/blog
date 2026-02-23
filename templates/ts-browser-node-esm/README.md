# @heygrady/ts-browser-node-esm

A minimal TypeScript template for dual-runtime packages with distinct browser and Node entry points.

## What this template provides

- Dual build outputs: `cjs`, `esm`, and `types`
- Conditional exports for runtime-aware resolution
- Explicit subpath exports: `./browser` and `./node`
- Minimal source stubs you can replace with your own implementation

## Usage

```ts
import { runtime } from "@heygrady/ts-browser-node-esm";
import { runtime as browserRuntime } from "@heygrady/ts-browser-node-esm/browser";
import { runtime as nodeRuntime } from "@heygrady/ts-browser-node-esm/node";
```

## Development

```sh
yarn check
yarn build
yarn test
```
