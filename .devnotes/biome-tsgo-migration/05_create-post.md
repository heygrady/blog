# Session 5: scripts/create-post

## Goal

Migrate the create-post CLI tool from ESLint to Biome.

---

## Prerequisites

- Root setup complete (session 02)
- Root `biome.json` exists with shared configuration

---

## Current State

**Package:** `@heygrady/create-post`
**Location:** `scripts/create-post/`

This is a plain JavaScript CLI tool (no TypeScript), so only Biome migration is needed.

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
  "eslint": "^9.39.1"
}
```

### Scripts to Update

| Current | New |
|---------|-----|
| `"lint": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}\""` | `"lint": "biome lint"` |
| `"format": "eslint \"**/*.{md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}\" --fix"` | `"format": "biome check --write"` |

### lint-staged to Update

```json
// Current
"lint-staged": {
  "*.{md,cjs,mjs,js,jsx,cts,mts,ts,tsx,json}": [
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
yarn workspace @heygrady/create-post add -D -E @biomejs/biome
```

### 2. Remove ESLint Files
- Delete `eslint.config.mjs`

### 3. Update package.json
- Remove ESLint-related devDependencies
- Update `lint` script to use biome
- Update `format` script to use biome
- Update `lint-staged` config

### 4. Run Biome and Fix Issues
```bash
cd scripts/create-post && yarn biome check --write
```

### 5. Test CLI Works
```bash
yarn workspace @heygrady/create-post node index.js --help
```

---

## Notes

- No TypeScript in this package, so no tsgo needed
- No test script exists for this package
- Package extends root `biome.json` automatically

---

## Commits

After completing tasks:

1. `build(create-post): migrate from eslint to biome`

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
- [ ] CLI `--help` works
- [ ] Changes committed
