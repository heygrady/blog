# Session 3: templates/ts-node-esm

## Goal

Migrate the TypeScript Node.js ESM template from ESLint to Biome and from tsc to tsgo.

---

## Prerequisites

- Root setup complete (session 02)
- Root `biome.json` exists with shared configuration

---

## Current State

**Package:** `@heygrady/ts-node-esm`
**Location:** `templates/ts-node-esm/`

### Files to Remove
- `eslint.config.mjs` - ESLint configuration
- `.prettierignore` - Prettier ignore file (Biome uses .gitignore via VCS integration)

### Files to Add
- `biome.json` - Package-level config extending root (if customization needed)

### Dependencies to Add
```json
{
  "@biomejs/biome": "2.3.11",
  "@typescript/native-preview": "7.0.0-dev.20260120.1"
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

### Scripts to Update

| Current | New |
|---------|-----|
| `"lint": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,.ts,ts,tsx,json}\""` | `"lint": "biome lint"` |
| `"format": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,.ts,ts,tsx,json}\" --fix"` | `"format": "biome check --write"` |
| `"build:types": "tsc --declaration --emitDeclarationOnly --project tsconfig.types.json --outDir dist/types"` | `"build:types": "tsgo --declaration --emitDeclarationOnly --project tsconfig.types.json --outDir dist/types"` |
| `"dev:types": "tsc --watch ..."` | Keep as `tsc --watch` (tsgo watch is unoptimized) |
| _(new)_ | `"check:types": "tsgo --noEmit"` |

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
yarn workspace @heygrady/ts-node-esm add -D -E @biomejs/biome @typescript/native-preview
```

### 2. Remove ESLint Files
- Delete `eslint.config.mjs`
- Delete `.prettierignore`

### 3. Update package.json
- Remove ESLint-related devDependencies
- Update `lint` script to use biome
- Update `format` script to use biome
- Update `build:types` script to use tsgo
- Add `check:types` script using tsgo --noEmit
- Update `lint-staged` config

### 4. Create Package biome.json (Optional)
If package needs custom rules, create `biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["//"]
}
```

For ts-node-esm, the root config should suffice (no customization needed).

### 5. Run Biome and Fix Issues
```bash
cd templates/ts-node-esm && yarn biome check --write
```

### 6. Run tsgo and Verify Type Checking
```bash
cd templates/ts-node-esm && yarn check:types
```

### 7. Test Build
```bash
yarn workspace @heygrady/ts-node-esm build
```

### 8. Run Tests
```bash
yarn workspace @heygrady/ts-node-esm test
```

---

## Notes

- Keep `typescript` devDependency for `dev:types` watch mode (tsgo watch is unoptimized)
- Package extends root `biome.json` via `"extends": ["//"]` if customization is needed
- The `--no-errors-on-unmatched` flag in lint-staged prevents errors on non-JS files
- Deps installed at package level so `yarn biome` works from within the package directory

---

## Commits

After completing tasks:

1. `build(ts-node-esm): migrate from eslint to biome`
2. `build(ts-node-esm): migrate from tsc to tsgo for declaration emit`

---

## Issues Encountered

_Document any issues here during execution_

---

## Verification Checklist

- [ ] `@biomejs/biome` added to devDependencies
- [ ] `@typescript/native-preview` added to devDependencies
- [ ] `eslint.config.mjs` removed
- [ ] `.prettierignore` removed
- [ ] ESLint dependencies removed from package.json
- [ ] `yarn lint` runs biome (from package directory)
- [ ] `yarn format` runs biome check --write
- [ ] `yarn check:types` runs tsgo --noEmit
- [ ] `yarn build` succeeds (uses tsgo for types)
- [ ] `yarn test` passes
- [ ] Changes committed
