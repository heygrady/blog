# Session 2: Root Setup

## Goal

Install BiomeJS and tsgo at the root level and create shared configuration.

---

## Prerequisites

- Working worktree at `/Users/heygrady/.claude-worktrees/blog/reverent-raman`
- Research complete (see `00_RESEARCH.md`)

---

## Tasks

### 1. Install Dependencies

```bash
yarn add -D -E @biomejs/biome @typescript/native-preview
```

### 2. Create Root biome.json

Create `biome.json` at repository root with:
- Shared formatter settings (match current Prettier config)
- Shared linter rules
- VCS integration (respect .gitignore)
- Astro file overrides

### 3. Update Root package.json Scripts

Add/update scripts:
- `lint` - Run biome lint across workspace
- `format` - Run biome format across workspace
- `check:biome` - Run biome check (lint + format)

### 4. Test Configuration

Verify biome runs without errors:
```bash
yarn biome check --write
```

---

## Configuration Reference

### Formatter Settings (from current .prettierrc.mjs)

Current Prettier config uses `prettier-config-standard` with:
- `trailingComma: 'es5'`

Standard config defaults:
- Single quotes
- No semicolons
- 2 space indent

### Biome Equivalent

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "single",
      "trailingCommas": "es5",
      "semicolons": "asNeeded"
    }
  }
}
```

### Astro Overrides

```json
{
  "overrides": [{
    "include": ["**/*.astro"],
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
  }]
}
```

---

## Commits

After completing tasks:

1. `build: add biome and tsgo to root dependencies`
2. `build: add root biome.json configuration`

---

## Issues Encountered

_Document any issues here during execution_

---

## Verification Checklist

- [ ] `@biomejs/biome` installed at root
- [ ] `@typescript/native-preview` installed at root
- [ ] `biome.json` created at root
- [ ] `yarn biome check` runs without crashing
- [ ] Root package.json scripts updated
- [ ] Changes committed
