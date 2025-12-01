---
"@heygrady/eslint-config": patch
---

- Disable n/no-extraneous-import for markdown code blocks since examples often reference packages not in package.json
- Disable jsdoc/no-undefined-types and jsdoc/reject-any-type for TypeScript files (generics appear undefined, types redundant with TS)
- Allow empty interfaces with @typescript-eslint/no-empty-object-type (common pattern for extensible types)
- Add separate vitest config for .bench.* benchmark files with vitest/consistent-test-it and vitest/expect-expect disabled (rule doesn't support bench())
