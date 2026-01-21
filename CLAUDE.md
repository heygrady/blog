# CLAUDE.md

This file provides guidance to Claude Code when working with this repository.

## Project Overview

Personal blog (heygrady.com) built with Astro, organized as a Yarn 4 monorepo using Turborepo for task orchestration.

## Commands

```bash
yarn install          # Install dependencies
yarn build            # Build all packages
yarn lint             # Lint all packages (biome + eslint for legacy)
yarn format           # Format all packages
yarn test             # Run tests
yarn create-post      # Create a new blog post
```

## Monorepo Structure

- `apps/blog-app` - Main Astro blog application
- `packages/eslint-config` - Shared ESLint config (deprecated, use Biome)
- `packages/jest-preset-ts-node-esm` - Jest preset (deprecated, use Vitest)
- `packages/tsconfig-bases` - Shared TypeScript configurations
- `scripts/create-post` - CLI tool for creating blog posts
- `templates/ts-node-esm` - TypeScript package template

## Tooling

- **Linting/Formatting**: Biome (migrated from ESLint/Prettier)
- **Type Checking**: tsgo (`@typescript/native-preview`) for fast type checks
- **Testing**: Vitest
- **Build**: SWC for transpilation, tsgo for declarations
- **Versioning**: Changesets

## Key Patterns

- Biome config: root `biome.json` with package-level overrides using `"extends": "//"`
- Type checking: `yarn check` in packages (tsgo --noEmit or astro check)
- Blog posts: `apps/blog-app/src/pages/posts/` as markdown with date-prefixed filenames

## Running Commands in Packages

Turbo (run tasks across packages):

```bash
turbo run build --filter=@heygrady/blog-app           # Single package
turbo run build --filter='@heygrady/blog-app...'      # Package and its dependencies
turbo run build --filter='@heygrady/blog-app^...'     # Package dependencies only
```

Yarn workspaces (run scripts in a specific package):

```bash
yarn workspace @heygrady/blog-app build
yarn workspace @heygrady/ts-node-esm test
```

## Commits and Changesets

- Use conventional commits (e.g., `feat:`, `fix:`, `build:`, `chore:`, `docs:`)
- Releases are automated via GitHub workflows
- Manually create changeset files in `.changeset/` (CLI is interactive-only)

Changeset file format:

```md
---
"@heygrady/package-name": patch
---

Description of the change
```
