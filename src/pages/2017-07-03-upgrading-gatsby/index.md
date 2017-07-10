---
title: "Upgrading Gatsby to 1.0"
date: "2017-07-03T18:00:01Z"
readNext: "/fix-me/"
path: "/upgrading-gatsby/"
---

In a previous post I installed [Gatsby 0.12.48](https://github.com/gatsbyjs/gatsby/tree/73dcc32d0041de6057d6328f0563b4e6cfb5e160) as [an upgrade to my blog](../new-blog/). Now it's already time to upgrade Gatsby. Version [1.0 of Gatsby](https://github.com/gatsbyjs/gatsby/tree/36e5fce58cccd1be09183a3573b234c87bd0c85d) has been [released](https://www.gatsbyjs.org/blog/gatsby-v1/). There are already docs available for [upgrading to the new version](https://www.gatsbyjs.org/docs/migrating-from-v0-to-v1/). Here we're going to upgrade this blog to Gatsby 1.0.

## Big changes
Gatsby has changed in some significant ways since the pre-1.0 days. Some of those changes are disorienting but it's clear that they're changes for the better. The bug upgrade is that there's a new an application framework -- designed around GraphQL. It creates a structure that's more like what you'd find in the [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit#project-structure), except Gatsby has a focus on *pages* instead of components or routes. After all, Gatsby is still *just* a static site generator.

The 1.0 version of Gatsby includes an upgrade to their [blog starter](https://github.com/gatsbyjs/gatsby-starter-blog/tree/ec2f17b6ac61b12a64c335f8facf1ed7590833b9).We're trying to make [our old site](https://github.com/heygrady/blog/tree/16fe1912b2ce87616ecd7922d8d6de38db41ef27) (based on the [old blog starter](https://github.com/gatsbyjs/gatsby-starter-blog/tree/f404f3a1bfddcb17aeb038b60a7cf2a025c44550)) work with the new version of Gatsby.

Let's install a new blog as an example of what we need to change. This will give us a local example of an already-upgraded Gatsby site to work from.

## Make a fresh Gatsby blog
Install a fresh blog in a new directory. I installed it in the directory *next to* my existing blog. This will make it easy to copy files over when it's time for that.

```bash
# upgrade to the latest gatsby cli
npm install -g gatsby

# install the fresh blog next to your blog
cd blog
cd ..
gatsby new upgrade-test gatsbyjs/gatsby-starter-blog
```

### Moving over posts
The old blog was a vanilla clone of the Gatsby starter. It should be possible to move the posts from the `pages` folder of the old site to the `src/pages` folder of the new site. For now it's best to only move the blog posts themselves. While many of the boilerplate files have changed in the new release, Gatsby is pretty much the same with regards to posts themselves.

- Copy just the posts from your blog to the fresh blog
- Delete the example posts
- Start the fresh blog to see if it works

```
cd upgrade-test
yarn dev
```

Once you're happy that the new site can load your posts, it's time to systematically migrate over the new files into your existing blog.

Because our blog is so vanilla, we should be able to do an in-place upgrade, copying over only the files we need.

## Make an upgrade branch
This will be a big change to the site. We're going to following a [feature-branch workflow](https://guides.github.com/introduction/flow/).

```bash
cd blog
git branch gatsby-upgrade && \
git checkout gatsby-upgrade
```

### Add the `src` folder
The most obvious change in Gatsby is the addition of a src folder. This is a [common convention](https://medium.com/@tarkus/how-to-build-and-publish-es6-modules-today-with-babel-and-rollup-4426d9c7ca71) in babel-based projects and it's great that Gatsby is embracing it.

```bash
mkdir src && \
mv components ./src/ && \
mv css ./src/ && \
mv pages ./src/ && \
mv utils ./src/ && \
mv wrappers ./src/ && \
mv html.js ./src/
```

### Out with the old, in with the new
The Gatsby works differently enough that we want to blow away our old blog and copy the new blog on top of it. We're going to do this somewhat surgically but there is a first step that's pretty easy. We should be able to rename our `src` folder and replace it with the source folder from the fresh new blog we created at the beginning of this post.

**Note:** If you haven't created that fresh copy (see above), do so now. We're going to be grabbing a bunch of files from it.

```bash
# stash old files and copy over the new ones
echo old-src >> .gitignore
mv src old-src
cp ../upgrade-test/src ./
```

Now we need to reconcile the two `src` folders.
- If you haven't already, move all of your posts from `old-src` to `src` -- and make sure to remove the example posts.
- Make sure to replace your profile pic in the `src/components` folder.
- Note that the new blog doesn't have a `ReadNext` component anymore. You can choose to get the old one working. I'm choosing to follow along and drop the read next feature.

### Add `src/config.js`
The new Gatsby relies on GraphQL to manage the config, but this idea hasn't been fully ported over to the blog example. Whatever the reason, the new blog is using hard-coded values in `src/components/Bio.js` and `src/layouts/index.js`. As a temporary fix we're going to add a `src/config.js` file with the values we need.

Eventually this should be replaced by GraphQL lookups. If you were trying to get ReadNext working this might be a good place to start. We're going to use the config to remove the hard-coded values.

You should port over all of the values from your [`config.toml`](https://github.com/heygrady/blog/blob/df6d9cc3d52ee0aaac703b6b4511b016092909b8/config.toml) because we'll be deleting that in a later step.

```js
export default {
  blogTitle: 'Heygrady',
  author: 'Grady Kuhnline',
  twitterHandle: 'heygrady'
}
```

### Fix `src/layouts/index.js`

- Import the temporary config
- Import the required [prism css](https://github.com/gatsbyjs/gatsby/tree/master/packages/gatsby-remark-prismjs#include-css). I added the additional CSS in a `src/css/prism.css` file.
- Replace instances of `Gatsby Starter Blog` with `{config.blogTitle}`
- Fix [PropTypes warnings](https://github.com/react-toolbox/react-toolbox/issues/1410)
- Fix ESLint errors

```js{2,6,8-9,14-15}
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from 'gatsby-link'
import { Container } from 'react-responsive-grid'
import { rhythm, scale } from '../utils/typography'
import config from '../config'

import 'prismjs/themes/prism-solarizedlight.css'
import '../css/prism.css'

// ... Replace the hard-coded blog title with a config variable

Template.propTypes = {
  children: PropTypes.func,
  location: PropTypes.object
}

export default Template
```

### Fix `src/pages/index.js`

- Add back the link to the old blog.
- Fix sorting
- Fix PropTypes warnings
- Fix ESLint errors

### Fix `src/components/Bio.js`

- Import the temporary config
- Replace instances of `Kyle Mathews` with `{config.author}`
- Add back your customized bio
- Fix PropTypes warnings
- Fix ESLint errors

### Fix `src/templates/blog-post.js`

- Fix PropTypes warnings
- Fix ESLint errors

### Merge `package.json`
- Update `name`, `description`, etc to match your blog.
- Copy the `dependencies` from the new blog
- Keep the `devDependencies` from the old blog (see previous [post on eslint](../enable-linting/))
- Grab the `fix-semi` script from the new blog
- Update `build:prod` to use `--prefix-paths` instead of `--prefix-links`

### Copy over other important files
We need to drop our `config.toml` and grab the bootstrap config files from the new blog.

```
rm config.toml && \
rm .gitignore && \
cp ../upgrade-test/.gitignore ./ && \
cp ../upgrade-test/.babelrc ./ && \
cp ../upgrade-test/gatsby-config.js ./ && \
cp ../upgrade-test/gatsby-node.js ./
```

Gatsby uses a new [path-prefix](https://www.gatsbyjs.org/docs/path-prefix/) functionality. We need to add this to the `gatsby-config.js`. We also need to add our `siteMetadata` to match what we added in `src/config.js`.

- Add a `pathPrefix`
- Update the `siteMetadata`

```js{2,4-6}
module.exports = {
  pathPrefix: '/',
  siteMetadata: {
    title: 'Heygrady',
    author: 'Grady Kuhnline',
    twitterHandle:'heygrady'
  },
  // ...
}
```

### Reinstall everything

The new version of Gatsby has totally different dependencies. We need to blow away the `public` and `node_modules` folders and reinstall all of our packages. This will remove any files related to the old version of Gatsby.

```bash
rm -drf public && \
rm -drf node_modules && \
yarn install
```

### Test it Out
If everything is working, we should be able to boot up the test site using `yarn dev`.

```
# see if the site works on http://localhost:8000
yarn dev
```

Load the site in your browser and see if everything looks correct.

You also need to test the production build. Because we're building static files, we can easily test the build using [http-server](https://www.npmjs.com/package/http-server). This allows us to server the `public` folder locally to ensure the site is building correctly.

```bash
yarn global add http-server

yarn build:prod && \
cd public && \
http-server -c-1
```

## Wrapping up
If you customized your old blog more heavily than I did, you may need to fix up a few more things. In cases where the new graphql functionality isn't obvious, fall back on the `src/config.js` file and leave yourself a `TODO`. At the time of this writing the [graphql documentation is incomplete](https://github.com/gatsbyjs/gatsby/blob/e4457d155840f4e08c46397cba944abd38dc5934/docs/docs/querying-with-graphql.md) ([latest](https://www.gatsbyjs.org/docs/querying-with-graphql/)) and upgrading may be non-trivial.

## Deploying
Once you are happy with your upgrade, commit it to the `gatsby-upgrade` branch and push it to github.

```bash
git add . && \
git commit -m "Upgrading to Gatsby 1.0" && \
git push origin gatsby-upgrade
```

On Github you will want to merge your feature branch using a [pull request](https://help.github.com/articles/about-pull-requests/). This should trigger the [travis deploy](../deploying-travis/). Be sure to check every link on your site before doing the final merge.
