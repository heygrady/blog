---
layout: "../../layouts/BlogPost.astro"
title: "Automatically deploying my blog with Travis"
description: "I configured Travis to test and deploy my blog every time I push new code to my master branch on Github."
pubDate: "2017-07-02T20:48:32Z"
readNext: "/posts/2017-07-03-enable-linting/"
path: "/posts/2017-07-02-deploying-travis/"
---

I've gotten my blog [deployed on Firebase](/posts/2017-06-30-first-launch/). Now I can deploy changes as easily as running `firebase deploy` from the terminal. But I would prefer to publish changes *when I push to GitHub*. Or, rather, I want to consider `master` on GitHub as the latest stable version -- this is the code that needs to be live on Firebase.

I need automated deployments. This is something that [Travis](https://travis-ci.org/) does very well.

Travis is a continuous integration tool. It watches your GitHub repository and tries to build and test your code every time you commit a change. It works well for public and private repositories. It's free for public repositories.

They aren't alone in this space. Many companies use [Jenkins](https://jenkins.io/) internally. Other notable competitors are [Codeship](https://codeship.com/) and [Circle CI](https://circleci.com/). There are likely dozens more. You could probably build your own service on your development laptop using Docker in about day (if you had a tutorial to follow).

We're using Travis for this project because it is the most obvious choice. Many popular open source projects use Travis, likely because their free tier is open source friendly. They support GitHub public repos for free specifically to support open source software developers. In a future project I intend to try out a competitor. For now, we're going with Travis.

## Let's go with Travis
You need an account. I already had one. You have to give them permission to see your GitHub account -- this gives them broad access. Travis allows you to choose the repositories you want watched.

The default settings on Travis are just fine. There are very few settings -- mostly for experimental features -- so it's not really necessary at all. We *will* be adding an environment variable a little later.

One of the annoying things about Travis is that there isn't a "go" button. It will *only* start when a new commit is made to your `master` branch on GitHub. This can make it difficult to get started and test your initial configuration.

- Sign up for Travis ([getting started](https://docs.travis-ci.com/user/getting-started/))
- Give Travis access to your GitHub
- Activate Travis for your repo
- Make a test commit to kick off the build and deploy

## Configure Travis
In order to make a deployment, we need to make a commit. We're going to commit a Travis config file to kick off our first automated build.

Travis offers almost no configuration online because you are supposed to add a [`.travis.yml`](https://docs.travis-ci.com/user/customizing-the-build) file to your project. This file is pretty easy to make but it can get quite complicated. Under the hood, Travis is standing up a brand new virtual machine for your project, running a fresh build from the latest code on GitHub, and running tests.

By default, Travis is designed to *test* your code, not deploy it. Thankfully for us, you can also configure a deploy step that runs *after* the tests.

Travis is designed for pretty serious teams that need strict and predictable build environments. Projects with a large audience need to ensure that the code on their website is *the right code*, and that it passes at least some kind of *test*.

In some ways, Travis and its competitors are overkill for a little blog like mine. But, it's free and offers a feature we're after -- automatic deployments of `master` on GitHub to Firebase.

### Fix our tests
For now, we won't need to run any tests. This is a boilerplate Gatsby blog and most of the testable features live within Gatsby somewhere. We're assuming that Gatsby is testing itself well enough that we don't have to.

There are probably some rudimentary tests that we should run to ensure that our latest code isn't totally broken. However, that is outside the scope of what we're trying to accomplish right now. Without tests, we are making the bold assumption that the code we commit to `master` will build correctly. For the case of a personal Gatsby blog, the tests can wait for another day.

Gatsby ships with a [test script](https://github.com/gatsbyjs/gatsby-starter-blog/blob/ea66dae113dfef5c5ee85c0adecd72d70cc385c8/package.json#L38) that essentially throws an error stating we should add some tests. Failing tests will prevent Travis from deploying our project. So we're going to have to soften that restriction. We'll change the message from "Error" to "Warning" and change the exit code from "1" to "0".

Edit the "test" script in your `package.json`:

```json
{
  "scripts": {
    "test": "echo \"Warning: no test specified\" && exit 0"
  }
}
```

Of course, this isn't a permanent solution. At the very least we should run the `lint` command that's included with Gatsby. But that can wait (we'll [enable linting](/posts/2017-07-03-enable-linting/) next). Right now we need to get Travis to deploy our blog. We've set our tests to emit a warning about "no tests" and exit with a success code so that Travis will continue.

**NOTE:** I broke my build while working on this post because my YAML frontmatter had a syntax error -- frontmatter errors make Gatsby unhappy. For me the problem was that I wasn't wrapping a string in quotes. In Travis, this showed up as a "failed" build. This kept the project from deploying because the build step was failing. In that way, building the project is a good minimal test.

### Add a prod build script
Gatsby comes with a [build script](https://github.com/gatsbyjs/gatsby-starter-blog/blob/ea66dae113dfef5c5ee85c0adecd72d70cc385c8/package.json#L40) and a [deploy script](https://github.com/gatsbyjs/gatsby-starter-blog/blob/ea66dae113dfef5c5ee85c0adecd72d70cc385c8/package.json#L41). We're going to be manually deploying with a `firebase deploy` command in our `.travis.yml`. But before we can deploy, we need to build. So we'll copy the build step from the existing deploy script and call it `deploy:prod`.

Add these relevant build and deploy scripts to your `package.json`:
```json
{
  "scripts": {
    "test": "echo \"Warn: no test specified\" && exit 0",
    "build": "gatsby build",
    "build:prod": "yarn build -- --prefix-links",
    "deploy": "yarn build:prod && firebase deploy"
  }
}
```

### Adding a `.travis.yml`
We need to add a `.travis.yml` file for building and deploying our project.

My Gatsby project was generated with a [Travis file](https://github.com/gatsbyjs/gatsby-starter-blog/blob/ea66dae113dfef5c5ee85c0adecd72d70cc385c8/.travis.yml) but it is for building Gatsby itself, not our project. We can get by with a much simpler configuration. I ended up having to follow [these instructions](https://marlosoft.net/posts/automatic-deploy-firebase-github-travis.html) because the [Firebase deployment documentation](https://docs.travis-ci.com/user/deployment/firebase/) provided by Travis didn't seem to work (at the time this was written).

**NOTE:** I kept getting an error during the deploy phase when following [the official docs](https://docs.travis-ci.com/user/deployment/firebase/). The error, `Error: Specified public directory does not exist, can't deploy hosting`, was cryptic enough that I decided to write my deployment manually.

**NOTE:** I was getting a *different* error with the [manual deploy](https://marlosoft.net/posts/automatic-deploy-firebase-github-travis.html) below because of an [issue with firebase-tools on Travis](https://github.com/firebase/firebase-tools/issues/382). I fixed it by installing firebase-tools directly from `master`. You might not need to do that if you're living in the future.

**NOTE:** I had to follow [these instructions](https://docs.travis-ci.com/user/languages/javascript-with-nodejs#Node.js-v4-%28or-io.js-v3%29-compiler-requirements) because I'm using Node 8 and it requires a more recent compiler to install native extensions like node-sass.

Here's the `.travis.yml` file I ended up with:
```yaml
language: node_js
node_js:
  - "8"
cache: yarn
addons:
  apt:
    packages:
      - g++-4.8
    sources:
      - ubuntu-toolchain-r-test
env:
  CXX=g++-4.8
branches:
  only:
    - master
before_script:
  # If you're having troubles with firebase/firebase-tools#382
  # - "yarn global add https://github.com/firebase/firebase-tools"
  - "yarn global add firebase-tools"
  - "yarn global add gatsby"
script:
  - "yarn test"
  - "yarn build:prod"
after_success:
  - "firebase deploy --token=${FIREBASE_API_TOKEN}"
```

### Add firebase deploy token for Travis
In order for Travis to deploy on your behalf you need to generate a [Firebase CI token](https://github.com/firebase/firebase-tools#using-with-ci-systems) for [use with Travis](https://docs.travis-ci.com/user/deployment/firebase/#Generating-your-Firebase-token).

Running the following script will generate a token for you. First it forces you to log in, then it will output a token in the terminal. **This should be a secret token -- anyone who knows your token can deploy as you.**

```bash
firebase login:ci

# if you accidentally share your token with someone you don't trust, destroy it
firebase logout --token="my untrusted token"
```

For now, go to your project in Travis and add the token as an environment variable named `FIREBASE_API_TOKEN`. This is outlined in more detail in [these instructions](https://marlosoft.net/posts/automatic-deploy-firebase-github-travis.html#getting-started) or in the [Travis environment variable docs](https://docs.travis-ci.com/user/environment-variables/#Defining-Variables-in-Repository-Settings). Make sure you leave "display value in build log" off.

If you're feeling adventurous, you can put this deploy token in your `.travis.yml` file as an encrypted secret. This would not give your secret away but it would allow anyone with access to your GitHub to view the encrypted version of your secret. Given that this is a public repository, I'm choosing to store it in my online Travis settings for now.

```bash
# only if you're adventurous... everyone will be able to see your encrypted token
# probably better to just add the token to your Travis environment variable settings online
travis encrypt FIREBASE_API_TOKEN="the generated token" --add env
```

## Making a test commit
With all of this in place, we're finally ready to push a change to our GitHub `master`.

```bash
git add .
git commit -m "Adding travis config"
git push origin master
```

At this point, Travis should pick up your changes, test, build and deploy your project. If you have any troubles, you will need to push changes to your `master` branch to trigger a new Travis build.

## What's next?
- [Enabling and requiring proper linting](/posts/2017-07-03-enable-linting/)
