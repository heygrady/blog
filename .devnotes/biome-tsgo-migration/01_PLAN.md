# BiomeJS and tsgo Migration Plan

## Overview

Migrate the `@heygrady/blog` monorepo from ESLint/Prettier to BiomeJS and from tsc to tsgo for type checking and declaration emit.

**Approach:** Small, focused sessions with commits after each package migration.

---

## Session Structure

Each session should:
- Focus on 1-2 packages maximum
- Complete with working lint/check/build
- End with conventional commits per package
- Document any issues encountered

---

## Sessions

### Session 1: Root Setup
**File:** `02_root-setup.md`

**Goal:** Install tools and create root configuration

**Tasks:**
1. Install `@biomejs/biome` at root
2. Install `@typescript/native-preview` at root
3. Create root `biome.json` with shared configuration
4. Update root `package.json` scripts
5. Test that biome runs from root

**Commits:**
- `build: add biome and tsgo to root dependencies`
- `build: add root biome.json configuration`

---

### Session 2: templates/ts-node-esm
**File:** `03_ts-node-esm.md`

**Goal:** Migrate the TypeScript Node.js ESM template

**Tasks:**
1. Remove ESLint dependencies from package.json
2. Remove eslint.config.mjs
3. Update lint/format scripts to use biome
4. Update check script to use tsgo
5. Update build:types script to use tsgo
6. Run biome check and fix issues
7. Run tsgo and verify no errors
8. Run build and verify outputs

**Commits:**
- `build(ts-node-esm): migrate from eslint to biome`
- `build(ts-node-esm): migrate from tsc to tsgo`

---

### Session 3: templates/node-esm
**File:** `04_node-esm.md`

**Goal:** Migrate the plain Node.js ESM template

**Tasks:**
1. Remove ESLint dependencies from package.json
2. Remove eslint.config.mjs
3. Update lint/format scripts to use biome
4. Run biome check and fix issues

**Commits:**
- `build(node-esm): migrate from eslint to biome`

---

### Session 4: scripts/create-post
**File:** `05_create-post.md`

**Goal:** Migrate the create-post CLI tool

**Tasks:**
1. Remove ESLint dependencies from package.json
2. Remove eslint.config.mjs
3. Update lint/format scripts to use biome
4. Update check script to use tsgo (if applicable)
5. Run biome check and fix issues
6. Test CLI works

**Commits:**
- `build(create-post): migrate from eslint to biome`

---

### Session 5: packages/jest-preset-ts-node-esm
**File:** `06_jest-preset.md`

**Goal:** Migrate the Jest preset package

**Tasks:**
1. Remove ESLint dependencies from package.json
2. Remove eslint.config.mjs
3. Update lint/format scripts to use biome
4. Run biome check and fix issues

**Commits:**
- `build(jest-preset-ts-node-esm): migrate from eslint to biome`

---

### Session 6: packages/tsconfig-bases
**File:** `07_tsconfig-bases.md`

**Goal:** Migrate the tsconfig bases package (minimal changes expected)

**Tasks:**
1. Remove ESLint dependencies from package.json (if any)
2. Remove eslint.config.mjs (if exists)
3. Update lint/format scripts to use biome
4. Run biome check and fix issues

**Commits:**
- `build(tsconfig-bases): migrate from eslint to biome`

---

### Session 7: apps/blog-app
**File:** `08_blog-app.md`

**Goal:** Migrate the Astro blog application

**Tasks:**
1. Remove ESLint dependencies from package.json
2. Remove eslint.config.mjs
3. Add biome.json with Astro overrides (or use root config)
4. Update lint/format scripts to use biome
5. Run biome check and fix issues
6. Test astro check still works
7. Test build works

**Commits:**
- `build(blog-app): migrate from eslint to biome`

---

### Session 8: packages/eslint-config (Deprecation)
**File:** `09_eslint-config-deprecation.md`

**Goal:** Mark eslint-config as deprecated

**Tasks:**
1. Update README with deprecation notice
2. Keep package functional for external consumers
3. Optionally: add biome.json for self-linting

**Commits:**
- `docs(eslint-config): mark package as deprecated`

---

### Session 9: Cleanup & Verification
**File:** `10_cleanup.md`

**Goal:** Final cleanup and verification

**Tasks:**
1. Run `turbo lint` from root - verify all packages pass
2. Run `turbo check` from root - verify type checking works
3. Run `turbo build` from root - verify builds work
4. Run `turbo test` from root - verify tests pass
5. Update root README if needed
6. Remove any unused root-level ESLint config
7. Update lint-staged configuration

**Commits:**
- `build: update turbo tasks for biome`
- `build: remove root eslint configuration`
- `docs: update README for biome migration`

---

## Rollback Plan

If any session encounters blocking issues:

1. Note the issue in the session document
2. Revert uncommitted changes: `git checkout .`
3. Decide: fix the issue or skip the package
4. If skipping: document why and keep ESLint for that package

---

## Success Criteria

- [ ] All packages lint with `biome check`
- [ ] All packages type-check with `tsgo`
- [ ] All packages build successfully
- [ ] All tests pass
- [ ] No ESLint dependencies remain (except eslint-config package)
- [ ] Turbo tasks work from root

---

## Notes

- Commit messages follow conventional commits format
- No signed commit footers
- Each session is self-contained and can be paused/resumed
- Document issues in session files for future reference
