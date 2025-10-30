---
layout: "../../layouts/BlogPost.astro"
title: "Enable linting: eslint"
description: "I implemented eslint to show linting errors in my editor while I worked on my blog."
pubDate: "2017-07-03T11:59:28Z"
---

In the previous post about [automating deployments with Travis](/posts/2017-07-02-deploying-travis/) I noted that it's a good idea to lint your code before deploying it. In past React projects I've started with the [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit) which comes preconfigured to use [eslint](http://eslint.org/) with the [Standard JS](https://standardjs.com/) package. We need linting for this blog, so let's copy what the starter-kit is doing.

## Grab the files from the starter-kit
Probably the easiest way to grab our files is using `wget`. You might need to [install wget](http://brewformulas.org/Wget) on your system. You can always manually pull down these files.

From the root of the blog, run these commands:

```bash
wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.editorconfig
wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintignore
wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintrc
```

### Customize the files for our needs
We need to make sure we ignore the `public` folder.

```bash
echo "public/**" >> .eslintignore
```
## Install eslint
We need to install eslint for our project. We can also remove [`gh-pages`](https://github.com/tschaub/gh-pages) from our project since we're not hosting our blog on [GitHub Pages](https://pages.github.com/).

```bash
yarn add --dev babel-eslint \
  eslint \
  eslint-config-standard \
  eslint-config-standard-react \
  eslint-plugin-babel \
  eslint-plugin-import \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-react \
  eslint-plugin-standard

yarn remove gh-pages
```

## Add some linting scripts
Gatsby adds a `lint` script to your `package.json` but it's not exactly what we need. We're going to rely instead on the [`.eslintrc`](https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintrc) that we downloaded from the starter-kit. This means that we can simplify the lint command. We'll also add the [`lint:fix`](https://github.com/davezuko/react-redux-starter-kit/blob/c1c4e8c3369d4d9397fa65149acbe6410892b0cf/package.json#L14) from the starter-kit.

```json
{
  "scripts": {
    "lint": "eslint .",
    "lint:fix": "yarn lint -- --fix",
    "test": "echo \"Warning: no test specified\" && exit 0"
  }
}
```

At this point we can run our linter. If you are using an editor like [Atom](https://atom.io/) you should install the [ESLint package](https://atom.io/packages/eslint) to see linting errors in your editor. This is preferred to using an ESLint watch option.

```bash
# this should show some errors
yarn lint

# this should fix most errors
yarn lint:fix
```

## Require linting to deploy
We can require the project to pass our linter before we will deploy it. All we need to do is call `lint` from our script block in our `.travis.yml` file.

```yaml
# make your .travis.yml script section look more like this
script:
  - "yarn lint"
  - "yarn test"
  - "yarn build:prod"
```

## Fix all of the linting errors
If you have already run `yarn lint:fix` there should be very few errors.

These are the errors I had to fix:

```
/project/path/blog/components/Bio.js
  26:1  error  Line 26 exceeds the maximum line length of 120  max-len

/project/path/blog/html.js
  20:55  error  Unexpected '!' in '!raw!./public/styles.css'. Do not use import syntax to configure webpack loaders  import/no-webpack-loader-syntax

/project/path/blog/pages/_template.js
  71:10  error  'route' PropType is defined but prop is never used  react/no-unused-prop-types

/project/path/blog/pages/index.js
  18:38  error  Unexpected mix of '&&' and '||'  no-mixed-operators
  18:69  error  Unexpected mix of '&&' and '||'  no-mixed-operators
```

## Try to deploy
Once you are able to run `yarn lint` locally, try committing your files and seeing if Travis can build your project. From now on your project will need to pass the linter before it can be deployed.
