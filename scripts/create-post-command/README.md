# create-post-command

Create a post in an astro app.

## Install

```sh
# in your repo root
yarn add @heygrady/create-post-command
```

## Usage

```sh
yarn create-post
# follow the prompts
```

## Prerequisites

This command requires a `heygrady.config.js` file in your repo root.

```js
module.exports = {
  // which package contains our app
  packageName: '@heygrady/blog-app',

  // where do we store posts (relative to app package root)
  postsDir: 'src/pages/posts',
}
```
