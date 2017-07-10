---
title: "Upgrading Gatsby to 1.0"
date: "2017-07-03T18:00:01Z"
readNext: "/fix-me/"
path: "/upgrading-gatsby/"
---

In a previous post I installed [Gatsby 0.12.48](https://github.com/gatsbyjs/gatsby/tree/73dcc32d0041de6057d6328f0563b4e6cfb5e160) as [an upgrade to my blog](../new-blog/). Now it's already time to upgrade Gatsby. Version [1.0 of Gatsby](https://github.com/gatsbyjs/gatsby/tree/1.0) has been [released](https://www.gatsbyjs.org/blog/gatsby-v1/). There are already docs available for [upgrading to the new version](https://www.gatsbyjs.org/docs/migrating-from-v0-to-v1/). Here we're going to upgrade this blog to Gatsby 1.0.

## Big changes
Gatsby has changed in some significant ways since the pre-1.0 days. It has added an application framework -- designed around GraphQL -- to the existing static site generator. Some of those changes are disorienting but it's clear that they're changes for the better. It creates a structure that's more like what you find in the react-redux-starter-kit, except Gatsby has a focus on *pages* instead of components or routes.

## Make a fresh Gatsby blog
Let's install a new blog as an example of what we need to change. The 1.0 version of Gatsby includes an upgrade to their [blog starter](https://github.com/gatsbyjs/gatsby-starter-blog/tree/ec2f17b6ac61b12a64c335f8facf1ed7590833b9). We'll want to make [our old site](https://github.com/heygrady/blog/tree/16fe1912b2ce87616ecd7922d8d6de38db41ef27) (based on the [old blog starter](https://github.com/gatsbyjs/gatsby-starter-blog/tree/f404f3a1bfddcb17aeb038b60a7cf2a025c44550)) work with the new version of Gatsby.

Installing a fresh copy in a new directory makes it easy to see what's new.

```bash
# upgrade to the latest gatsby cli
npm install -g gatsby

# create a fresh blog
gatsby new blog-upgrade gatsbyjs/gatsby-starter-blog
```

### Moving over posts
The old blog was mostly an unaltered version of the Gatsby starter. It should be possible to move the posts from the `pages` folder of the old site to the `src/pages` folder of the new site. For now it's best to only move the blog posts themselves because the other files in the pages folder have changed in the new release.

You should be able to move your old posts over and start up the new Gatsby blog and see everything working. The differences between the two versions is pretty minor with regards to posts themselves. Most of the changes to Gatsby are upgrades to the core.

Once you're happy that the new site can load your posts, it's time to systematically migrate over the new files into your old site.

## Make an upgrade branch
This will be a big change to the site. Because our blog is so vanilla, we should be able to do an in-place upgrade, copying over only the files we need.

### Add the `src` folder
The most obvious change in Gatsby is the addition of a src folder. This is a [common convention](https://medium.com/@tarkus/how-to-build-and-publish-es6-modules-today-with-babel-and-rollup-4426d9c7ca71) in babel-based projects and it's great that Gatsby is embracing it.

```bash
mkdir src && \
mv components ./src/ && \
mv css ./src/ && \
mv pages ./src/ && \
mv source ./src/ && \
mv utils ./src/ && \
mv wrappers ./src/ && \
mv html.js ./src/
```
