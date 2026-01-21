# Session 9: packages/eslint-config (Deprecation)

## Goal

Mark the eslint-config package as deprecated since the monorepo has migrated to Biome.

---

## Current State

**Package:** `@heygrady/eslint-config`
**Location:** `packages/eslint-config/`

This package provides shared ESLint configurations that were used by other packages in the monorepo. Now that those packages use Biome, this package is no longer needed internally.

### Decision

**Keep but deprecate.** The package:
- Is published to npm and may have external consumers
- Should remain functional for backwards compatibility
- Should be marked as deprecated to discourage new usage

### What NOT to Change

- Keep the package fully functional
- Keep ESLint for self-linting (it's an ESLint config package)
- Don't remove any config variants
- Don't change dependencies

---

## Tasks

### 1. Update README with Deprecation Notice

Add a prominent deprecation notice at the top of README.md explaining:
- The package is deprecated
- Recommend Biome as an alternative
- Package will remain functional but not actively maintained

### 2. Consider: Add `@deprecated` to package.json

Optional: Add a `"deprecated"` field or update description to indicate deprecation.

---

## README Deprecation Notice

```markdown
> [!WARNING]
> **This package is deprecated.** The `@heygrady/blog` monorepo has migrated to [Biome](https://biomejs.dev/) for linting and formatting. This package will remain functional but is no longer actively maintained.
>
> Consider using Biome for new projects.
```

---

## Commits

After completing tasks:

1. `docs(eslint-config): mark package as deprecated`

---

## Issues Encountered

_Document any issues here during execution_

---

## Verification Checklist

- [ ] README updated with deprecation notice
- [ ] Package remains functional (no breaking changes)
- [ ] Changes committed
