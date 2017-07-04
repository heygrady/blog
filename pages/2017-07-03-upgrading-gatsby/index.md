---
title: "Upgrading Gatsby to 1.0"
date: "2017-07-03T18:00:01Z"
readNext: "/fix-me/"
path: "/upgrading-gatsby/"
hidden: true
---

In a previous post I installed [Gatsby 0.12.48](https://github.com/gatsbyjs/gatsby/tree/73dcc32d0041de6057d6328f0563b4e6cfb5e160) as [an upgrade to my blog](../new-blog/). Now it's already time to upgrade Gatsby. Version [1.0 of Gatsby](https://github.com/gatsbyjs/gatsby/tree/1.0) will be [released soon](https://www.gatsbyjs.org/blog/gatsby-first-beta-release/). There are already docs available for [upgrading to the new version](https://www.gatsbyjs.org/docs/migrating-from-v0-to-v1/). Here we're going to upgrade this blog to Gatsby 1.0.

## Make a fresh Gatsby blog
Let's install a new blog as an example of what we need to change. The next version of Gatsby includes an upgrade to their [blog starter](https://github.com/gatsbyjs/gatsby-starter-blog/tree/1.0). We'll want to make [our old site](https://github.com/heygrady/blog/tree/16fe1912b2ce87616ecd7922d8d6de38db41ef27) look more like the new site.

Installing a fresh copy in a new directory makes it easy to see what's new.

```bash
# in a fresh directory
npm install -g gatsby@next
gatsby new blog-upgrade gatsbyjs/gatsby-starter-blog#1.0
```

## Work in progress
Turns out that a bunch of things have changed and the blog template is a little different. Stay tuned.
