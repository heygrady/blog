# Session 10: Cleanup & Verification

## Goal

Final cleanup and verification that all packages work correctly after migration.

---

## Verification Tasks

### 1. Run Turbo Lint
```bash
yarn lint
```
Verify all packages pass biome lint.

### 2. Run Turbo Build
```bash
yarn build
```
Verify all packages build successfully.

### 3. Run Turbo Test
```bash
yarn test
```
Verify all tests pass.

### 4. Run Root Biome Check
```bash
yarn check:biome
```
Verify biome ci passes from root.

---

## Cleanup Tasks

### 5. Consider: Remove tsgo from Root

The `@typescript/native-preview` was installed at root, but per our decision, each package that needs it has its own copy. Consider removing from root devDependencies.

**Current root devDependencies:**
- `@biomejs/biome` - Keep (for `yarn check:biome` from root)
- `@typescript/native-preview` - Consider removing (packages have their own)

### 6. Review: Pre-commit Hook

The `.husky/pre-commit` hook has the turbo precommit command commented out:
```bash
# yarn turbo run --concurrency=1 --force --no-cache --filter=[HEAD^1] precommit
```

Options:
- Leave as-is (no lint-staged on commit)
- Uncomment to enable lint-staged per package
- Add root-level biome check instead

---

## Success Criteria

- [ ] `yarn lint` passes (all packages)
- [ ] `yarn build` passes (all packages)
- [ ] `yarn test` passes (all packages)
- [ ] `yarn check:biome` passes (root)
- [ ] No unused dependencies at root

---

## Commits

After completing tasks:

1. `build: remove tsgo from root devDependencies` (if decided)
2. `build: update pre-commit hook for biome` (if decided)

---

## Issues Encountered

_Document any issues here during execution_
