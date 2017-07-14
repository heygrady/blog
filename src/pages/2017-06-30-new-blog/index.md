---
title: "Updating my blog to Gatsby"
description: "I updated my old Octopress blog to Gatsby. My goal was to make it easier to post new content. Gatsby is interesting because it uses a modern React workflow."
date: "2017-06-30T10:58:49Z"
readNext: "/first-launch/"
path: "/new-blog/"
---

This is my updated blog. The old content will be [kept around](https://2012.heygrady.com) for posterity but it hasn't really be updated in the least 5 years. The old blog was built with [Octopress](http://octopress.org/). This new blog is built with [Gatsby](https://github.com/gatsbyjs/gatsby) (for now).

**NOTE:** This was written for [Gatsby 0.12.48](https://github.com/gatsbyjs/gatsby/tree/73dcc32d0041de6057d6328f0563b4e6cfb5e160). Version 1.0 [has been released](https://www.gatsbyjs.org/blog/gatsby-v1/). A later post post demonstrates [how to upgrade](../upgrading-gatsby/).

## I want a new blog
A lot has changed since 2012. Publishing static content on the web has gotten much easier. This blog will be an experimental place for me to make posts. Mostly I'm just trying to reduce my barrier to making posts to near-zero and giving myself a more stable place to make notes. Choosing Gatsby is a way to get up and running quickly, bonus points for being built on top of the React stack.

## More practical posts
I going to try and document my adventures of trying to get things done using modern tooling. This is mostly about capturing my own notes. Who knows. At this very moment I'm just dumping text into a markdown file to get a feel for it.

## What did I do?
- Made a new `gatsby` branch
- Cleaned out all of the old files
- Installed the Gatsby [starter blog](https://github.com/gatsbyjs/gatsby-starter-blog)
- Did some basic configuration

### Make a new branch
I had an [old blog](https://github.com/heygrady/blog/tree/9d1717812a2562bbb3136faaf0238365f091ace8) already in my Github. I cloned `heygrady/blog` master and branched it as `gatsby`. Then I wiped the directory clean and installed Gatsby.

```bash
git clone git@github.com:heygrady/blog.git
git checkout -b gatsby
# manually move all of the files to an _old folder, keeping only .git in place
```

### Install Gatsby
This is covered better elsewhere, you should follow the latest [instructions for Gatsby](https://github.com/gatsbyjs/gatsby/blob/v0.12.48/README.md). For posterity, this is what I did:

```bash
npm install -g gatsby
gatsby new blog https://github.com/gatsbyjs/gatsby-starter-blog
```

### Basic configurtion
- Reviewed `config.toml` (set the link prefix to an empty string)
- Added a personal profile pic
- Added a custom config value for my twitter handle and updated `components/Bio.js`

### New pages
It's tedious to make new pages. Let's add a dead-simple starter script that makes a generic post with all of the timestamps in place.

Gatsby initializes projects with a few [scripts](https://docs.npmjs.com/misc/scripts) in the `package.json` file. This makes it easy to collect scripts that are important to your project. For instance, you can see that `yarn dev` will execute the `dev` script, which is just an alias for `gatsby dev`. It's [pretty handy](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/).

Here's my starter script for making new posts. It creates a timestamped folder in the `pages/` directory and adds an `index.md` with a timestamp as well as some default [frontmatter](https://github.com/gatsbyjs/gatsby#frontmatter-and-metadata).

```json
{
  "scripts": {
    "page": "DATE=\"$(date '+%Y-%m-%d')\" FOLDER=\"pages/$DATE-title\" FILE=\"$FOLDER/index.md\" && mkdir $FOLDER && touch $FILE && echo \"---\ntitle: \\\"Title\\\"\ndate: \\\"$(date '+%Y-%m-%dT%H:%M:%S')\\\"\nreadNext: \\\"/fix-me/\\\"\npath: \\\"/title/\\\"\n---\" >> $FILE",
  }
}
```

## What's next?
This blog has two main goals that I will try to cover in two upcoming posts.

- [Launching this blog on Firebase](../first-launch/)
- [Moving the old blog and setting up redirects](../migrating-old-site/)
- [Setting up continuous deployment for the new blog](../deploying-travis/)
