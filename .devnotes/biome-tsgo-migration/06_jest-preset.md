# Session 6: packages/jest-preset-ts-node-esm

## Goal

Migrate the Jest preset package from ESLint to Biome.

---

## Prerequisites

- Root setup complete (session 02)
- Root `biome.json` exists with shared configuration

---

## Current State

**Package:** `@heygrady/jest-preset-ts-node-esm`
**Location:** `packages/jest-preset-ts-node-esm/`

This is a plain JavaScript package (CommonJS), so only Biome migration is needed.

### Files to Remove
- `eslint.config.mjs` - ESLint configuration

### Dependencies to Add
```json
{
  "@biomejs/biome": "2.3.11"
}
```

### Dependencies to Remove
```json
{
  "@heygrady/eslint-config": "workspace:^",
  "@types/eslint": "^9.6.1",
  "@types/prettier": "^2.7.3",
  "eslint": "^9.39.1"
}
```

Note: `@types/rimraf` can also be removed as rimraf is not a devDependency.

### Scripts to Update

| Current | New |
|---------|-----|
| `"lint": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,.ts,ts,tsx,json}\""` | `"lint": "biome lint"` |
| `"format": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,.ts,ts,tsx,json}\" --fix"` | `"format": "biome check --write"` |

### lint-staged to Update

```json
// Current
"lint-staged": {
  "*.{md,cjs,mjs,js,jsx,cts,.ts,ts,tsx,json}": [
    "eslint --fix"
  ]
}

// New
"lint-staged": {
  "*": [
    "biome check --write --no-errors-on-unmatched"
  ]
}
```

---

## Tasks

### 1. Install New Dependencies
```bash
yarn workspace @heygrady/jest-preset-ts-node-esm add -D -E @biomejs/biome
```

### 2. Remove ESLint Files
- Delete `eslint.config.mjs`

### 3. Update package.json
- Remove ESLint-related devDependencies
- Remove `@types/rimraf` (unused)
- Update `lint` script to use biome
- Update `format` script to use biome
- Update `lint-staged` config

### 4. Run Biome Lint
```bash
cd packages/jest-preset-ts-node-esm && yarn lint
```

---

## Notes

- No TypeScript in this package, so no tsgo needed
- No test script exists for this package
- Package extends root `biome.json` automatically

---

## Commits

After completing tasks:

1. `build(jest-preset-ts-node-esm): migrate from eslint to biome`

---

## Issues Encountered

_Document any issues here during execution_

---

## Verification Checklist

- [ ] `@biomejs/biome` added to devDependencies
- [ ] `eslint.config.mjs` removed
- [ ] ESLint dependencies removed from package.json
- [ ] `yarn lint` runs biome (from package directory)
- [ ] `yarn format` runs biome check --write
- [ ] Changes committed
