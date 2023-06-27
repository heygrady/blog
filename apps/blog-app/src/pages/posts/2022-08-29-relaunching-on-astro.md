---
layout: "../../layouts/BlogPost.astro"
title: "Relaunching on Astro"
description: "Upgrading my blog from a very outdated version of Gastby to Astro."
pubDate: "2022-08-29T23:40:29Z"
heroImage: "hero-relaunching-on-astro.jpg"
---

I update my blog very rarely. It seems like I blog during the summer, in short bursts, every five years. My last [series of blog posts](https://heygrady.com/posts/2017-06-30-new-blog) are from 2017; and before that it was [my Octopress blog in 2012](https://2012.heygrady.com/). Upgrading from Octopress to Gatsby was a tough challenge and I give up entirely. I ended up archiving that old site on a sub-domain.

So, here I am in 2022 and wanting to revisit my blog. I've decided to relaunch on Astro because... upgrading a very old version of Gatsby sounds boring. Meanwhile, getting to know Astro sounds fun.

## Goals

1. Keep using Firebase
2. Switch to Github Actions
3. Switch to a monorepo setup; adopt conventional commits and changesets
4. Switch to [Astro](https://docs.astro.build/en/getting-started/)

### Host: Firebase

So, basically I want to change everything except Firebase. There are more popular hosts in the marketplace but Firebase is still working well for me and I don't have any reason to switch hosts. [Astro works great with Firebase](https://docs.astro.build/en/guides/deploy/google-firebase/) out of the box. If I decide to [enable SSR](https://docs.astro.build/en/guides/server-side-rendering/) in the future (unlikely for this blog) it may make sense to use a mainstream host like Netlify or Cloudflare because Astro does not yet have an official SSR integration with Firebase. There is [an unoffical plugin for using Firebase Functions with Astro](https://www.npmjs.com/package/astro-firebase) ([astro-firebase demo](https://github.com/thepassle/astro-firebase-demo)) but that is outside the scope of this project.

I did not need to change the `firebase.json` file except to point to the new build location and add some redirects for the old Gatsby URL scheme to the new Astro scheme.

### CI/CD: Github Actions

In 2017 it made sense to use an established open-source friendly tool like Travis for managing deploy tasks ([my previous notes on Travis](https://heygrady.com/posts/2017-07-02-deploying-travis)). Today, it makes sense to use Github Actions. It covers the same use-cases but it is much easier to work with because it is so tightly integrated with Github.

The official [Firebase Github Action](https://firebase.google.com/docs/hosting/github-integration) is amazing. It will deploy a preview with every PR commit and publish the entire site with every merge to the main branch. I had this set up in minutes. I lightly customized it to work for my usecase.

### Code Management: Monorepo, Conventional Commits, Changesets

This part is totally extra but I wanted to upgrade my blog repo to be a monorepo instead of a single-package repo. This is hardly useful for a typical blog site and I won't spend much time on this piece during this post. I've been wanting to play with Changesets and took the opportunity for this project.

See [creating a Yarn Monorepo in 2022](./2022-09-01-creating-a-yarn-monorepo-in-2022) for more details.

### Framework: Astro

This is the focus of this post. Astro is an exciting new framework that builds on the advances of the last several years (it uses Vite + ES Build under the hood). It provides out of the box integrations with the most popular UI frameworks today (React, Vue, SolidJS, Svelte). It also provides its own custom template language that is very easy to work with.

If you need to you can co-mingle Astro with your favorite framework, like React ([see integrations](https://docs.astro.build/en/guides/integrations-guide/#official-integrations)). Because the previous Gatsby blog was based on React it _might_ be possible to boot my old Gatsby blog _within_ Astro. Instead, I chose to port the theme to native `.astro` components.

I was able to use the existing markdown posts virtually unchanged. There were some minor differences in the frontmatter and how the codeblocks worked. Overall, porting over the content was very easy. The format of markdown pages in Gatsby is largely interchangeable with the markdown format that Astro supports.

This means that I can focus on porting over the theme.

# Installing Astro

### Strategy
1. Start with a fresh monorepo (delete everything; set up a Yarn Monorepo)
2. Bootstrap an Astro blog with the "Blog" starter
3. Copy the posts from Gatsby to Astro
4. Port the default theme from Gatsby to Astro

### Prerequisites

My local environment has yarn available thru Volta. If you work with Node you should strongly consider [intalling Volta](https://volta.sh/).

```sh
# make Node and Yarn available on your system
volta install node@lts yarn@latest npm@latest
```

### Start a branch

Let's pretend you like to check out Github repos into your `~/repos` folder.

From here onward we will use the term "repo root" to reference the `~/repos/blog` folder.

```sh
# clone the repo
cd ~/repos
git clone git@github.com:heygrady/blog.git

# start a branch
cd blog
git checkout -b astro
```

### Monorepo

It is an extra detail but I have re-configured my blog repo as a monorepo. I am going to keep my blog in the `apps/` folder and keep other packages (like an Eslint config) in the `packages/` folder. I will cover the details of bootstrapping a Yarn Monorepo in a future post. For this post it will look like I installed Astro in a weird place for no good reason.

We are ending with a directory structure like this:

```
repos/
  blog/ <-- Repo root
    apps/
      blog/ <-- Astro Blog
    packages/
      esling-config/ <-- support packages
```

### Initialize Astro Blog

Astro is very easy to [get started](https://docs.astro.build/en/install/auto/) with. 

```sh
# from repo root (i.e. ~/repos/blog)
cd apps
yarn create astro

# follow the prompts (see below)
```

### Answer Astro CLI Prompts

We want to use the recommended options except for choosing the "Blog" template instead of the recommended template.

```sh
? Where would you like to create your new project? › blog
? Which template would you like to use? Blog
? Would you like to install yarn dependencies? y
? Would you like to initialize a new git repository? n
? How would you like to setup TypeScript? Strict
```

Because we started Astro as a package within a monorepo we need to move some files to the repo root.

```sh
# from apps root (i.e. ~/repos/blog/apps)

# move .vscode folder to top level
mv blog/.vscode ../
```

# Porting the Theme

I don't mind the look of my blog. I purposely chose to make it as bland as possible. Previously, I went with the default Gatsby template. I would like to keep the theme unchanged, however I will need to translate all of the template files from Gatsby to Astro. The reason I chose to use the 
"Blog" starter from Astro was to get the basic structure roughed out. The default Astro blog template is nearly identical to the default Gatsby blog starter.

Because Gatsby was developed using a monorepo and package-driven developement... many of the small parts of Gatsby are super portable. To make things easy we're going to be keeping the `typography` library even though it is not often used outside of Gatsby.

### Add Gatsby Dependencies

Gatsby configures fonts and basic typographic styling using a tool called `typography`. Previously I did not need to know what this was or how it worked because I did not customize the theme. One delightful discovery was that the font provider had migrated from [typeface-montserrat](https://www.npmjs.com/package/typeface-montserrat) to [fontsource-montserrat](https://www.npmjs.com/package/fontsource-montserrat) to [@fontsource/montserrat](https://www.npmjs.com/package/@fontsource/montserrat) over the previous five years. Luckily the differences were minor. However, getting the fonts working in Astro took a several hours.

```sh
# from blog root (i.e. ~repos/blog/apps/blog)
yarn add @fontsource/inconsolata @fontsource/merriweather @fontsource/montserrat date-fns typography typography-theme-wordpress-2016
```

### Create the typography utils

This is a port of [the same file](https://github.com/heygrady/blog/blob/c5660d45c348d87967ce511dde22442743b87100/src/utils/typography.js) that exists in the Gatsby Blog template. Interestingly the wordpress theme package behaved stangely depending on the Astro build mode. I'm not sure I would recommend using `typography` but it's an interesting utility.

```ts
import Typography from 'typography'
// @ts-expect-error no types exported
import Wordpress2016 from 'typography-theme-wordpress-2016'

// FIXME: this is different in prod versus dev
export const typography = new Typography(Wordpress2016.default ?? Wordpress2016)
```

### Add Fonts to `BaseHead.astro`

We need to do two things to get typography working:
1. Import the fonts
2. Output the theme CSS

The typography package has a react-typography adapter for use with React but there is no Astro provider. Thankfully the typography object provides a `typography.toString()` method that exports the raw CSS. Then we can use a [standard Astro style tag for raw css](https://docs.astro.build/en/guides/styling/#raw-css-imports).

```astro
---
// Import the global.css file here so that it is included on
// all pages through the use of the <BaseHead /> component.
import '../styles/global.css'

// Import all of the font-weights individually
import '@fontsource/inconsolata/400.css'
import '@fontsource/inconsolata/700.css'
import '@fontsource/inconsolata/900.css'
import '@fontsource/montserrat/400.css'
import '@fontsource/montserrat/700.css'
import '@fontsource/montserrat/900.css'
import '@fontsource/merriweather/400.css'
import '@fontsource/merriweather/400-italic.css'
import '@fontsource/merriweather/700.css'
import '@fontsource/merriweather/700-italic.css'
import '@fontsource/merriweather/900.css'
import '@fontsource/merriweather/900-italic.css'

import { typography } from '../utils/typography'

// ...

---

<!-- ... -->

<!-- Typography -->
<style is:inline set:html={typography.toString()}></style>
```

## Port over components

Most of the styling in the Gatsby starter is done using inline `style` attributes. This is an effective an efficient strategy and it works fine with Astro.

Here's an example of porting the `<Bio />` component from Gatsby to Astro.

### Original `Bio.js`

See [`Bio.js` here](https://github.com/heygrady/blog/blob/c5660d45c348d87967ce511dde22442743b87100/src/components/Bio.js)

```jsx
import React, { Component } from 'react'

// Import typefaces
import 'typeface-montserrat'
import 'typeface-merriweather'

import config from '../config'
import { rhythm } from '../utils/typography'

import profilePic from './profile-pic.jpg'

class Bio extends Component {
  render () {
    return (
      <p
        style={{
          marginBottom: rhythm(2.5),
        }}
      >
        <img
          src={profilePic}
          alt={config.author}
          style={{
            float: 'left',
            marginRight: rhythm(1 / 4),
            marginBottom: 0,
            width: rhythm(2),
            height: rhythm(2),
            borderRadius: '50%'
          }}
        />
        Written by <strong>{config.author}</strong>.
        {' '}
        <a href={`https://twitter.com/${config.twitterHandle}`}>@{config.twitterHandle}</a>
        {' | '}
        <a href={`https://github.com/${config.twitterHandle}`}>Github</a>
      </p>
    )
  }
}

export default Bio
```

### Astro Version `Bio.astro`

Notice that we already moved the fonts to the `BaseHead.astro` above. Otherwise this file is virtually identical to the Gatsby version.

```astro
---
import { data } from '../config'
import profilePic from '../images/profile-pic.jpg'
import { typography } from '../utils/typography'
---

<p
  style={{
    marginBottom: typography.rhythm(2.5),
  }}>
  <img
    src={profilePic}
    alt={data.author}
    style={{
      float: 'left',
      marginRight: typography.rhythm(1 / 4),
      marginBottom: 0,
      width: typography.rhythm(2),
      height: typography.rhythm(2),
      borderRadius: '50%',
    }}
  />
  Written by <strong>{data.author}</strong>.
  {' '}
  <a href={`https://twitter.com/${data.twitterHandle}`}
    >@{data.twitterHandle}
  </a>
  {' | '}
  <a href={`https://www.linkedin.com/in/${data.twitterHandle}/`}>LinkedIn</a>
  {' | '}
  <a href={`https://github.com/${data.twitterHandle}`}>Github</a>
</p>

```

# Wrapping Up

After a few attempts I had a perfectly working Atom blog that looked virtually identical to my previous blog. The fonts were actually improved by all of the upgrading and this is one of the most noticeable differences.

It seems that the Gatsby theme inherits some default styling from the Gatsby core (somewhere) because it was not easy to identify where all of the styles were coming from.

I ended up renaming the default `src/pages/blog` folder to be named `posts` to avoid an issue caused by redirecting `blog` paths to the 2012 blog.

I was amazed by how easy it was to integrate Firebase with Github Actions.

I was equally amazed by how quickly I was able to adopt `.astro` syntax. It was very familiar to me coming from a strong React background.

The biggest struggle I had was with fonts. At one point the fonts were not showing up in the Firbease preview and I tracked it down to a base-url issues. I ended up disabling asset inlining in Vite to avoid the issue.

Disappointingly, I ended up dropping the line highlighting feature from the code blocks. This was a somewhat unique feature that Gatsby offers. The [Astro documentation provides a similar feature](https://github.com/withastro/docs/blob/67eab8e50e8138d6b80fe279a71b2105ab60e6a8/integrations/astro-code-snippets.ts) but it is not portable so I decided not to persue it further.

**Fun side-note:** I used Github Codespaces to develop the blog and it was super easy to work with.
