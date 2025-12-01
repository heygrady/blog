---
"@heygrady/ts-node-esm": patch
"@heygrady/node-esm": patch
---

Fix test scripts to run once instead of in watch mode:
- `ts-node-esm`: Change `vitest` to `vitest run`
- `node-esm`: Add `--no-watch` flag to Jest command
