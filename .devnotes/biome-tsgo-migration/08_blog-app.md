# Session 8: apps/blog-app

## Goal

Migrate the Astro blog application from ESLint/Prettier to Biome.

---

## Prerequisites

- Root setup complete (session 02)
- Root `biome.json` exists with Astro overrides configured

---

## Current State

**Package:** `@heygrady/blog-app`
**Location:** `apps/blog-app/`

This is an Astro application with TypeScript. Type checking is handled by `astro check`, not tsc, so no tsgo migration needed.

### Files to Remove
- `eslint.config.mjs` - ESLint configuration
- `.prettierrc.js` - Prettier configuration

### Files to Add
- `biome.json` - Package-level config with Astro overrides

### Root Changes
- Remove Astro overrides from root `biome.json` (move to blog-app)

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
  "eslint": "^9.39.1",
  "prettier": "^3.7.3",
  "prettier-config-standard": "^7.0.0",
  "prettier-plugin-astro": "^0.14.1"
}
```

Note: `@types/rimraf` can also be removed (rimraf is present but no types needed).

### Scripts to Update

| Current | New |
|---------|-----|
| `"lint": "eslint \"**/*.{astro,md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}\""` | `"lint": "biome lint"` |
| `"format": "eslint \"**/*.{astro,md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}\" --fix"` | `"format": "biome check --write"` |
| `"format:prettier": "prettier \"src/**/*.astro\" --write"` | Remove (no longer needed) |

### lint-staged to Update

```json
// Current
"lint-staged": {
  "*.{astro,md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}": [
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
yarn workspace @heygrady/blog-app add -D -E @biomejs/biome
```

### 2. Remove ESLint/Prettier Files
- Delete `eslint.config.mjs`
- Delete `.prettierrc.js`

### 3. Create Package biome.json
Create `apps/blog-app/biome.json`:
```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": "//",
  "overrides": [
    {
      "includes": ["**/*.astro"],
      "linter": {
        "rules": {
          "style": {
            "useConst": "off",
            "useImportType": "off"
          },
          "correctness": {
            "noUnusedVariables": "off",
            "noUnusedImports": "off"
          }
        }
      }
    }
  ]
}
```

Note: `"extends": "//"` inherits from root config. No need for `"root": false` when using extends.

### 4. Remove Astro Overrides from Root biome.json
Remove the `overrides` array from root `biome.json` (Astro rules now live in blog-app).

### 5. Update package.json
- Remove ESLint and Prettier devDependencies
- Remove `@types/rimraf` (unused)
- Update `lint` script to use biome
- Update `format` script to use biome
- Remove `format:prettier` script
- Update `lint-staged` config

### 6. Run Biome Lint
```bash
cd apps/blog-app && yarn lint
```

### 7. Test Astro Check
```bash
yarn workspace @heygrady/blog-app check
```

### 8. Test Build
```bash
yarn workspace @heygrady/blog-app build
```

---

## Notes

- Astro uses `astro check` for type checking (not tsc/tsgo)
- Biome has experimental Astro support - root config has overrides to disable problematic rules
- May see some lint warnings in .astro files due to experimental support
- Keep `typescript` devDependency (required by Astro)

---

## Commits

After completing tasks:

1. `build(blog-app): migrate from eslint/prettier to biome`

---

## Issues Encountered

_Document any issues here during execution_

---

## Verification Checklist

- [ ] `@biomejs/biome` added to devDependencies
- [ ] `biome.json` created with Astro overrides
- [ ] Root `biome.json` Astro overrides removed
- [ ] `eslint.config.mjs` removed
- [ ] `.prettierrc.js` removed
- [ ] ESLint and Prettier dependencies removed from package.json
- [ ] `yarn lint` runs biome (from package directory)
- [ ] `yarn format` runs biome check --write
- [ ] `yarn check` (astro check) passes
- [ ] `yarn build` succeeds
- [ ] Changes committed
