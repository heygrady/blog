---
layout: "../../layouts/BlogPost.astro"
title: "Creating a Yarn Monorepo in 2022"
description: "Setting up a productive monorepo with modern tooling."
pubDate: "2022-09-01T06:58:32.817Z"
heroImage: "hero-create-yarn-monorepo.jpg"
---

The goal here is to create an new monorepo that is ready to start creating packages and apps. This is similar to the Turborepo starter but it doesn't use turbo to initialize the repo.

### Tooling

To manage our code we need to combine a variety of different tools together. These can be grouped into a few distinct sets.

This document will focus on the tooling needed by the workspace root. The tooling for workspace packages will be handled in other documents.

**Workspace Root:**
- Git
- [Volta](https://volta.sh/) + [Yarn Berry](https://yarnpkg.com/getting-started) + NPM
- [Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Husky](https://typicode.github.io/husky/#/?id=automatic-recommended)
- [Commitlint](https://github.com/conventional-changelog/commitlint#getting-started)
- [Turborepo](https://turborepo.org/docs/getting-started#install-turbo)


# Initialize a Blank Repo

This document is written in a way that should enable you cut and paste commands into a terminal. It was written on a Mac and should work with the factory defaults on any similar system.

Here we want to start with a blank folder and bootstrap a git repo to hold our monorepo workspace.

```sh
# Start with an empty folder.
mkdir -p ~/repos/my-repo

cd ~/repos/my-repo

# Initialize Git.
git init

# Initialize Gitignore
curl -o .gitignore https://raw.githubusercontent.com/github/gitignore/main/Node.gitignore

# Open it in Vs Code (if you like VS Code).
code .
```

## Install a Default Node with Volta

It's a good idea to set your default Node to be the latest stable version.

Volta is a portable way to install Node. With Volta there's never a question if you are using the correct versions of Node, NPM and Yarn.

- [Install Volta](https://volta.sh/)

```sh
# Install a global default node on your system
volta install node@lts npm@latest yarn@latest
```

# Initialize a Yarn Berry Workspace

We need to initialize and configure the tooling we use in the workspace root.

- [Yarn Berry](https://yarnpkg.com/getting-started)
- [Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Husky](https://typicode.github.io/husky/#/?id=automatic-recommended)
- [Commitlint](https://github.com/conventional-changelog/commitlint#getting-started)
- [Turborepo](https://turborepo.org/docs/getting-started#install-turbo)

From here, we presume you are using the repo directory we created as your working directory.

```sh
# repo root
cd ~/repos/my-repo
```

## Initialize Workspace Root

Now that we have a blank repo and a current default version of Node on our system it's time to create our workspace root `package.json`.

This step will install Yarn Berry, create a `package.json` pre-configured for workspaces and configure Yarn Berry for the best mix of compatibility and portability.

- Optional: [Install Corepack](https://github.com/volta-cli/volta/issues/987#issuecomment-914502143)
- [Install Yarn Berry](https://yarnpkg.com/getting-started/install)
- [Yarn Init Command](https://yarnpkg.com/cli/init)

```sh
# from repo root (i.e. ~/repos/my-repo)

# Initialize the workspace root
yarn init -2 -w

# Use node_modules for maximum compatibility
echo "nodeLinker: node-modules" >> .yarnrc.yml 

# Add some helpful yarn plugins
yarn plugin import interactive-tools
yarn plugin import typescript
yarn plugin import workspace-tools

# Configure Yarn for NOT zero-installs
cat >> .gitignore <<'endmsg'

# Yarn Not-Zero-Installs
# https://yarnpkg.com/getting-started/qa/#which-files-should-be-gitignored
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/sdks
!.yarn/versions
endmsg

# Pin Volta
volta pin node@lts npm@latest yarn@latest
```

## Configure Github Package Registry

I want to publish my packages to the Github Package Registry instead of NPM. This is a better default for your personal or professional work. You can skip this step if you know you want to publish your package to NPM.

- [Github Package Registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [NPM Scopes](https://docs.npmjs.com/cli/v8/using-npm/scope)
- [Yarn Config for `npmScopes`](https://yarnpkg.com/configuration/yarnrc#npmScopes)

The Github Package Registry requires you to use scoped packages where the scope matches the repository owner, not the repo name. Github refers to these values as `@OWNER` and `@REPO`. In order to publish an NPM package to the Github Package Registry you need to have write permissions to a Github account or organization (`@OWNER`) with the same name as your package scope.

For instance, I manage the code for this blog at this URL https://github.com/heygrady/blog so I will need to prefix all of my package names with `@heygrady`.

- `@OWNER` -- "heygrady"
- `@REPO` -- "blog"

```sh
# FIXME: use your github account here
cat >> .yarnrc.yml <<'endmsg'
npmScopes:
  heygrady:
    npmPublishRegistry: "https://npm.pkg.github.com"
    npmRegistryServer: "https://npm.pkg.github.com"
    npmAlwaysAuth: true
endmsg

echo "@heygrady:registry=https://npm.pkg.github.com" >> .npmrc
```

## Initialize Changesets

Changesets is a spiritual successor to Lerna and it sheds much of the unnecessary weight and magic of Lerna. What's left is a tool focused on releasing workspace packages.

We're going to configure our repo to use the Changesets Github Action to automate the release process. You should review the documentation for [automating changesets](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md).

- [Using Changesets](https://github.com/changesets/changesets/blob/main/docs/intro-to-using-changesets.md)
- [Automating Changesets](https://github.com/changesets/changesets/blob/main/docs/automating-changesets.md)
- [Changsets Github Action](https://github.com/changesets/action#with-publishing)
- [Changeset Bot](https://github.com/changesets/bot)

```sh
# Add changesets CLI
yarn add @changesets/cli && yarn changeset init

# Enable Changesets Github Action
mkdir -p .github/workflows

cat > .github/workflows/release.yml <<'endmsg'
# https://github.com/changesets/action#with-publishing
name: Release

on:
  push:
    branches:
      - main

concurrency: ${{ github.workflow }}-${{ github.ref }}

jobs:
  release:
    name: Release
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 16
          cache: 'yarn'
          registry-url: 'https://npm.pkg.github.com'
          scope: '@heygrady'
      - name: Cache node_modules and yarn cache
        uses: actions/cache@v3
        with:
          path: |
            node_modules
            apps/*/node_modules
            packages/*/node_modules
            scripts/*/node_modules
            .yarn/cache
          key: root-node-modules-folder-v1
          restore-keys: |
            root-node-modules-folder-
      - run: yarn install
      # FIXME: run yarn lint and yarn test before releasing
      - name: Create Release Pull Request or Publish to Github Package Registry
        id: changesets
        uses: changesets/action@v1
        with:
          # This expects you to have a script called version which updates the lockfile after calling `changeset version`.
          version: yarn version
          # This expects you to have a script called release which builds your packages and then calls `changeset publish`.
          publish: yarn release
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          # https://docs.github.com/en/actions/publishing-packages/publishing-nodejs-packages#example-workflow
          NODE_AUTH_TOKEN: ${{ secrets.GITHUB_TOKEN }}
          YARN_ENABLE_IMMUTABLE_INSTALLS: false
endmsg
```

We need to add the `release` and `version` scripts to our workspace root `package.json`. We'll make the `build` script work when we configure Turborepo below.

Calling `build` before `changeset publish` ensures that all of our typescript and/or bundled app packages are ready to be published. Calling `yarn install` after `changeset version` will update the `yarn.lock` file when the release PR is created.

```json
{
  "scripts": {
    "build": "turbo run --concurrency=4 build",
    "release": "yarn build && changeset publish",
    "version": "changeset version && yarn install"
  }
}
```


## Initialize Husky

Husky is the defacto tool for managing precommit hooks within a JavaScript repo. We use it for enforcing linting rules for commit messages (commitlint), package.json files (manypkg) and source files (eslint).

- [Husky Automatic Installation](https://typicode.github.io/husky/#/?id=automatic-recommended)

```sh
# Install Husky
yarn dlx husky-init --yarn2 && yarn install

# Configure husky in your home directory
cat >> ~/.huskyrc <<'endmsg'
# https://typicode.github.io/husky/#/?id=command-not-found

# volta
export VOLTA_HOME="$HOME/.volta"
export PATH="$VOLTA_HOME/bin:$PATH"
endmsg
```

## Initailize Commitlint

Commitlint enforces the rules of conventional commits. This makes it possible to use tools like changesets for automatically versioning packages and generating changelogs.

- [Installing Commitlint](https://github.com/conventional-changelog/commitlint#getting-started)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
- [@commitlint/config-lerna-scopes](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-lerna-scopes)

```sh
# Add Commitlint CLI and presets
yarn add @commitlint/cli @commitlint/config-conventional @commitlint/config-lerna-scopes

# Add Commitlint config
cat > commitlint.config.js <<'endmsg'
module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
}
endmsg

# Add commitlint hook
yarn husky set .husky/commit-msg 'yarn commitlint --edit ${1}' 
```

## Add Manypkg

Manypkg enforces some basic rules for packages in a monorepo. This ensures that dependency versions are consistent within the workspace and follow best practices.

- [@manypkg/cli](https://github.com/Thinkmill/manypkg)

```sh
# Add Manypkg
yarn add @manypkg/cli

# Fix all packages
yarn manypkg fix

# Add manypkg hook
yarn husky set .husky/manypkg-check 'yarn manypkg check' 
```

## Initialize Turborepo

Turborepo speeds up the process of running commands in all workspace packages. This is very helpful for CI/CD workflows and for bootstrapping a repo after checkout. This document does not cover any of the advanced configuration where you can pay money to Vercel to maintain a shared workspace cache.

- [Configuring Turbo](https://turborepo.org/docs/getting-started#create-turbojson)

```sh
# Add Turborepo
yarn add turbo

# Add Pre-commit Hook
yarn husky set .husky/pre-commit "yarn turbo run --concurrency=1 --filter=[HEAD^1] precommit"

# Ignore Turbo Folder
echo ".turbo" >> .gitignore

# Configure Turborepo
cat > turbo.json <<'endmsg'
{
  "$schema": "https://turborepo.org/schema.json",
  "baseBranch": "origin/main",
  "pipeline": {
    "build": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "outputs": ["dist/**"],
      "dependsOn": ["^build"]
    },
    "clean": {},
    "coverage": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "test/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "outputs": ["coverage/**"],
      "dependsOn": ["^build"]
    },
    "format": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "test/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "dependsOn": ["^build"]
    },
    "lint": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "test/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "dependsOn": ["^build"]
    },
    "precommit": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "test/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "dependsOn": ["^build"]
    },
    "test": {
      "inputs": ["src/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "test/**/*.{cjs,mjs,js,jsx,cts,mts,ts,tsx}", "package.json"],
      "dependsOn": ["^build"]
    }
  }
}
endmsg
```

## Add Scripts to Workspace Root

We expose some common commands that most of our workspace packages will expose. We use turborepo to ensure we're running the commands efficiently. If an individual package doesn't support a command (i.e. a node package does not have a build script) it will be skipped.

```json
{
  "scripts": {
    "build": "turbo run --concurrency=4 build",
    "clean": "turbo run clean",
    "coverage": "turbo run --concurrency=4 coverage",
    "coverage:ci": "turbo run --concurrency=2 coverage -- --maxWorkers=2 --forceExit",
    "format": "turbo run --concurrency=4 format",
    "lint": "turbo run --concurrency=4 lint",
    "postinstall": "husky install",
    "release": "yarn build && changeset publish",
    "test": "turbo run --concurrency=4 test",
    "test:ci": "turbo run --concurrency=2 test -- --maxWorkers=2 --forceExit",
    "version": "changeset version && yarn install"
  }
}
```

## Create App and Scripts Workspaces

It's a common convention to have an `apps` folder separate from the `packages` folder to distinguish specialized application packages from standard library packages. We're going to also create a `scripts` folder for holding common script our repo needs. This may be covered in a future post.

```sh
mkdir apps
mkdir scripts
touch apps/.gitkeep
touch scripts/.gitkeep
touch packages/.gitkeep
```

Add apps and scripts to the package.json in the workspace root.

```json
{
  "workspaces": [
    "apps/*",
    "packages/*",
    "scripts/*"
  ]
}
```

# Next Steps

From this point we have a fully functioning workspace with some sensible defaults and professional-grade tooling.

The next step is to create a workspace package.
