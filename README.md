# @heygrady/blog

My [blog](https://heygrady.com/). Built with [Astro](https://astro.build/). A rebuild of my [Gatsby blog](https://github.com/heygrady/blog/blob/c5660d45c348d87967ce511dde22442743b87100/README.md), itself a rebuild of my [Octopress blog](https://2012.heygrady.com/).

Read about [relaunching on Astro](https://heygrady.com/posts/2022-08-29-relaunching-on-astro) on the blog.

## Monorepo Structure

This is a Yarn 4 monorepo using [Turborepo](https://turbo.build/) for task orchestration.

```
apps/
  blog-app/           # Main Astro blog (heygrady.com)

packages/
  eslint-config/      # Shared ESLint flat config for ESLint 9+
  jest-preset-ts-node-esm/  # Jest preset for TypeScript ESM projects
  tsconfig-bases/     # Shared TypeScript configurations

scripts/
  create-post/        # CLI tool for creating new blog posts

templates/
  node-esm/           # Package template for Node.js ESM
  ts-node-esm/        # Package template for TypeScript ESM
```

## Getting Started

### Prerequisites

- Node.js 20+ (managed via [Volta](https://volta.sh/))
- Yarn 4

### Installation

```bash
yarn install
```

### Development

```bash
# Start the blog dev server
yarn dev

# Build all packages
yarn build

# Run linting
yarn lint
yarn format

# Run tests
yarn test
```

### Creating a New Post

```bash
yarn create-post
```

## Commands

| Command | Description |
|---------|-------------|
| `yarn start` | Start the blog dev server |
| `yarn build` | Build all packages |
| `yarn lint` | Lint all packages |
| `yarn format` | Lint and fix all packages |
| `yarn test` | Run tests across all packages |
| `yarn coverage` | Run tests with coverage |
| `yarn create-post` | Create a new blog post |
| `yarn clean` | Clean turbo cache |
| `yarn clean:hard` | Full clean including node_modules |

## Release Workflow

This repo uses [Changesets](https://github.com/changesets/changesets) for version management and publishes packages to [GitHub Package Registry](https://github.com/features/packages).

## Deployment

The blog is deployed to [Firebase Hosting](https://firebase.google.com/docs/hosting). Production deploys happen automatically when the "Version Packages" PR is merged to main.

## Previous Posts

- [Updating my blog to Gatsby](https://heygrady.com/posts/2017-06-30-new-blog)
- [Migrating the old site](https://heygrady.com/posts/2017-06-30-migrating-old-site)