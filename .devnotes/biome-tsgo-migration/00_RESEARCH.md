# BiomeJS and TypeScript Go Migration Research

## Project Overview

This document captures research for migrating the `@heygrady/blog` monorepo from ESLint to BiomeJS and from TypeScript to tsgo for type checking.

**Session:** Research (Session 0)
**Date:** 2026-01-20
**Goal:** Understand requirements, limitations, and strategies for migration

---

## Current Tooling Stack

### Monorepo Structure

```
blog/
├── apps/
│   └── blog-app/          # Astro 5.16.3 blog (private)
├── packages/
│   ├── eslint-config/     # @heygrady/eslint-config (public)
│   ├── jest-preset-ts-node-esm/  # Jest preset (public)
│   └── tsconfig-bases/    # TypeScript configs (public)
├── scripts/
│   ├── create-post/       # CLI tool (public)
│   └── dependency-readme/ # Docs generator
└── templates/
    ├── node-esm/          # Node template
    └── ts-node-esm/       # TypeScript template (public)
```

**Package Manager:** Yarn 4.12.0 (workspaces)
**Build Orchestrator:** Turbo 2.6.1
**Node Version:** 24.11.1 (Volta)

### Current Linting & Formatting

| Tool | Version | Purpose |
|------|---------|---------|
| ESLint | 9.39.1 | Linting (flat config) |
| Prettier | 3.7.3 | Code formatting |
| @heygrady/eslint-config | 1.7.1 | Shared ESLint presets |

**ESLint Plugins in Use:**
- `@typescript-eslint/eslint-plugin` + `parser`
- `eslint-plugin-astro` + `astro-eslint-parser`
- `eslint-plugin-react` + `react-hooks`
- `eslint-plugin-solid`
- `eslint-plugin-jsx-a11y`
- `eslint-plugin-import`
- `eslint-plugin-vitest`
- `eslint-plugin-jest` + `jest-dom`
- `eslint-plugin-testing-library`
- `eslint-plugin-jsdoc`
- `eslint-plugin-json`
- `eslint-plugin-n`
- `eslint-plugin-promise`
- `eslint-plugin-compat`
- `eslint-plugin-eslint-comments`
- `eslint-plugin-prettier`
- `@eslint/markdown`

**ESLint Config Variants:**
1. `ts-node-esm.js` - TypeScript + Node + ESM
2. `node.js` - Plain Node ESM
3. `astro.js` - Astro framework
4. `astro-react.js` - Astro + React
5. `astro-solid.js` - Astro + Solid.js
6. `tsx-react-esm.js` - TypeScript + React
7. `tsx-solid-esm.js` - TypeScript + Solid.js
8. `zx.js` - Shell scripting

### Current TypeScript Setup

| Tool | Version | Purpose |
|------|---------|---------|
| TypeScript | 5.9.3 | Type checking |
| @heygrady/tsconfig-bases | 1.0.8 | Shared tsconfig presets |
| @swc/core | 1.15.3 | Fast compilation |
| @swc/cli | 0.7.9 | SWC command line |

**TSConfig Base Variants:**
1. `ts-node-esm/tsconfig.json` - Node + TypeScript + ESM
2. `ts-web-esnext/tsconfig.json` - Browser/ESNext
3. `tsx-react-esm/tsconfig.json` - React + TypeScript
4. `tsx-solid-esm/tsconfig.json` - Solid.js + TypeScript

### Current Build Pipeline (ts-node-esm template)

```json
{
  "build": "concurrently \"yarn build:cjs\" \"yarn build:esm\" \"yarn build:types\"",
  "build:cjs": "swc src -d dist/cjs ... -C module.type=commonjs",
  "build:esm": "swc src -d dist/esm ... -C module.type=es6",
  "build:types": "tsc --declaration --emitDeclarationOnly --outDir dist/types"
}
```

**Key Insight:** SWC handles JS compilation, TypeScript only emits `.d.ts` files.

---

## BiomeJS Research

### Overview

BiomeJS is a fast, unified toolchain for linting, formatting, and code checking. It replaces both ESLint and Prettier with a single tool written in Rust.

**Installation:**
```bash
yarn add -D -E @biomejs/biome
npx @biomejs/biome init  # Creates biome.json
```

### Core Commands

| Command | Purpose |
|---------|---------|
| `biome check --write` | Format + lint + organize imports |
| `biome format --write` | Format only |
| `biome lint --write` | Lint + auto-fix |
| `biome ci` | CI-optimized check (no writes) |

### Language Support

| Language | Status |
|----------|--------|
| JavaScript/TypeScript | ✅ Full |
| JSX/TSX | ✅ Full |
| JSON/JSONC | ✅ Full |
| HTML | ✅ Full |
| CSS | ✅ Full |
| GraphQL | ✅ Full |
| **Astro** | 🟡 **Experimental (v2.3.0+)** |
| Markdown | ⌛️ Parsing only |

### Astro Support (Experimental since v2.3.0)

Biome supports Astro files out of the box as of v2.3.0. It can format and lint the HTML, CSS, and JavaScript portions of `.astro` files.

**What Works:**
- Parsing Astro files
- Formatting HTML, CSS, and JavaScript portions
- Linting embedded languages
- Basic code structure handling

**Limitations:**
- Astro-specific syntax (like frontmatter boundaries) not fully parsed
- Cross-language lint rules may produce false positives (e.g., variables used in template but defined in script)
- No Astro-specific rules (unlike eslint-plugin-astro)

**Recommended overrides for Astro files:**
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

**Assessment:** Acceptable for this project. We can try it and back out if issues arise.

### Migration from ESLint

```bash
biome migrate eslint --write
biome migrate prettier --write
```

**Supported ESLint Plugins (built-in equivalents):**
- TypeScript ESLint ✅
- JSX A11y ✅
- React ✅
- Unicorn ✅

**Limitations:**
- YAML configs not supported
- Some plugins with cyclic refs may fail
- Rule behavior may differ from ESLint
- Not all ESLint rules have equivalents

### Configuration (biome.json)

```json
{
  "$schema": "https://biomejs.dev/schemas/2.3.11/schema.json",
  "extends": ["//"],  // Monorepo extends marker
  "vcs": {
    "enabled": true,
    "clientKind": "git",
    "useIgnoreFile": true
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
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

**Monorepo Support:**
- Root `biome.json` with shared config
- Nested configs with `"extends": ["//""]` and `"root": false`
- Per-directory overrides supported

---

## TypeScript Go (tsgo) Research

### Overview

TypeScript Go is Microsoft's native port of TypeScript written in Go. It's being developed as "Project Corsa" and will become TypeScript 7.

**Installation:**
```bash
npm install @typescript/native-preview
npx tsgo  # Use like tsc
```

### Current Status (January 2026)

| Feature | Status |
|---------|--------|
| Type checking | ✅ Done |
| Parsing | ✅ Done |
| tsconfig support | ✅ Done |
| Build mode (project refs) | ✅ Done |
| Incremental builds | ✅ Done |
| JSX support | ✅ Done |
| Declaration emit (.d.ts) | ✅ Most features done (edge cases in progress) |
| JS emit | ⚠️ In Progress |
| Watch mode | ⚠️ Prototype (unoptimized) |
| Language Server (LSP) | ⚠️ In Progress |
| Public API | ❌ Not Ready |

**VS Code Extension:**
```json
{ "typescript.experimental.useTsgo": true }
```

### Performance Gains

| Project | Speedup vs TS 6.0 |
|---------|-------------------|
| VSCode | 10.2x faster |
| Sentry | 7.5x faster |

### Feature Parity

- Targets **TypeScript 5.9** behavior
- ~20,000 test cases pass (only 74 differences)
- Type errors match TS 5.9 locations and messages
- Some intentional divergences documented in CHANGES.md

### Key Limitations

1. **Declaration emit** - Most common features work; some edge cases/flags still in progress
2. **Watch mode unoptimized** - Works but no incremental recheck
3. **ES2021 downlevel limit** - Can't target older than ES2021
4. **No public API** - Can't use programmatically yet
5. **Not all resolution modes** - Some module resolution gaps

**Assessment:** Declaration emit should work for this project (no exotic edge cases). We can use tsgo for both type checking and `.d.ts` generation.

### TypeScript 7 Timeline

- TypeScript 6.0 = last JS-based release
- No TypeScript 6.1 planned
- TypeScript 7.0 = native Go implementation
- Migration tool: `ts5to6` for config updates

### Breaking Changes in TS 7

- `--strict` enabled by default
- `--target` defaults to ES2025
- ES5 support dropped
- `--baseUrl` removed

---

## Migration Strategy Analysis

### BiomeJS Migration

#### What Can Migrate

| Current | BiomeJS Equivalent |
|---------|-------------------|
| ESLint core rules | ✅ Built-in |
| TypeScript ESLint | ✅ Built-in |
| React rules | ✅ Built-in |
| JSX A11y | ✅ Built-in |
| Import sorting | ✅ Built-in |
| Prettier | ✅ Built-in formatter |
| JSON linting | ✅ Built-in |

#### What Cannot Migrate (Gaps)

| Current Plugin | BiomeJS Status |
|----------------|----------------|
| eslint-plugin-astro | ❌ No equivalent |
| eslint-plugin-solid | ❌ No equivalent |
| eslint-plugin-vitest | ❌ No equivalent |
| eslint-plugin-jest | ❌ No equivalent |
| eslint-plugin-testing-library | ❌ No equivalent |
| eslint-plugin-jsdoc | ❌ No equivalent |
| eslint-plugin-promise | ⚠️ Partial |
| eslint-plugin-n | ⚠️ Partial |
| eslint-plugin-compat | ❌ No equivalent |
| @eslint/markdown | ⚠️ Parsing only |

#### Impact Analysis

| Package | Migration Difficulty | Notes |
|---------|---------------------|-------|
| blog-app | 🟡 Medium | Astro experimental but workable; loses Astro-specific rules |
| eslint-config | N/A | Will be deprecated/kept for legacy |
| ts-node-esm | 🟢 Low | Standard TS, easy migration |
| create-post | 🟢 Low | Standard TS scripts |
| templates | 🟢 Low | Standard TS |

### tsgo Migration

#### Use Cases

| Task | Tool | Notes |
|------|------|-------|
| Type checking | tsgo | 7-10x faster |
| Declaration emit | tsgo or tsc | tsgo in progress |
| JS compilation | SWC | Keep existing |
| Watch mode | tsc | tsgo unoptimized |

#### Recommended Approach

```json
{
  "check": "tsgo --noEmit",
  "build:types": "tsgo --declaration --emitDeclarationOnly"
}
```

Use tsgo for both type checking and declaration emit. Fall back to tsc only if issues arise.

---

## Risks and Mitigations

### BiomeJS Risks

| Risk | Mitigation |
|------|------------|
| Astro support experimental | Use overrides to disable problematic rules; back out if needed |
| No Vitest/Jest rules | Accept this gap - these rules aren't critical |
| Rule behavior differs | Run `biome check` and fix any new issues |
| Fewer plugins | Core functionality sufficient for this project |

### tsgo Risks

| Risk | Mitigation |
|------|------------|
| Preview status | This is a worktree; can back out |
| Declaration emit edge cases | This project has standard types; unlikely to hit edge cases |
| Watch mode slow | Use tsc for watch mode if needed |

### Overall Risk Assessment

**Low risk** - This is a git worktree, so we can experiment freely. If migration causes problems, we simply don't merge to main.

---

## Recommended Migration Order

### Phase 1: Setup (Single Session)

1. Install BiomeJS at root
2. Install `@typescript/native-preview` at root
3. Create root `biome.json` configuration
4. Test on this worktree - can back out if issues arise

### Phase 2: Migrate All Packages

Migrate all packages in one pass (this is a worktree, safe to experiment):

1. **templates/ts-node-esm** - Standard TS template
2. **templates/node-esm** - Plain Node template
3. **scripts/create-post** - CLI tool
4. **packages/jest-preset-ts-node-esm** - Jest preset
5. **packages/tsconfig-bases** - TSConfig bases (minimal changes)
6. **apps/blog-app** - Astro app (with Astro overrides)

For each package:
- Remove ESLint dependencies and config
- Update lint/format scripts to use Biome
- Update check/build:types scripts to use tsgo
- Test that everything works

### Phase 3: eslint-config Package Decision

Options:
1. **Keep as-is** - Don't migrate, leave for reference/external consumers
2. **Deprecate** - Mark as deprecated in README
3. **Delete** - Remove from monorepo entirely

**Recommendation:** Keep for now, mark as deprecated. Can delete later.

---

## Decisions Made

1. **Astro Support** - Try experimental support; back out if issues
2. **Testing Rules** - Accept losing Vitest/Jest ESLint rules (not critical)
3. **tsgo Declaration Emit** - Use for `.d.ts` generation (no exotic edge cases in this project)
4. **eslint-config Package** - Keep but mark deprecated
5. **Migration Approach** - Full migration in worktree; back out if problems

---

## Next Steps

1. Create `01_PLAN.md` with detailed implementation plan
2. Execute migration in subsequent sessions
3. Document any issues in session notes

---

## References

- [BiomeJS Getting Started](https://biomejs.dev/guides/getting-started/)
- [BiomeJS Migration Guide](https://biomejs.dev/guides/migrate-eslint-prettier/)
- [BiomeJS Language Support](https://biomejs.dev/internals/language-support/)
- [BiomeJS HTML Super Languages](https://biomejs.dev/internals/language-support/#html-super-languages-support)
- [BiomeJS Configuration](https://biomejs.dev/reference/configuration/)
- [TypeScript Go Repository](https://github.com/microsoft/typescript-go)
- [TypeScript 7 Progress (Dec 2025)](https://devblogs.microsoft.com/typescript/progress-on-typescript-7-december-2025/)
