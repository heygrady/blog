---
title: Automatically deploying my blog with Travis
date: "2017-07-02T20:48:32"
readNext: "/fix-me/"
path: "/deploying-travis/"
---

I've gotten my blog deployed on Firebase. Now I can deploy changes as easily as running `firebase deploy` from the terminal in the root folder of my blog. But I would prefer to only publish changes to my blog when I push to Github. Or, rather, I want to consider that a commit to `master` on Github should be considered the latest stable version -- this is the code that needs to be live on Firebase. I need automated deployments. This is something that Travis does very well.

Travis is a continuous integration tool. It watches your Github repository and tries to build and test your code every time you commit a change. It works well for public and private repositories. It's free for public repositories. They aren't alone in this space. Many companies use Jenkins internally. Other notable competitors are Codeship and Circle CI. There are likely dozens more. You could probably build your own service on your development laptop using Docker in about day (if you had a tutorial to follow).

We're using Travis for this project because it is the most obvious choice. Many popular open source projects use Travis, likely because their free tier is brazenly open source friendly. They support Github public repos for free specifically to support open source software developers. Codeship also has a generous free tier and in a future project I intend to try out a competitor.

## Let's go with Travis
You need an account. I already had one. You have to give them permission to see your Github account -- this gives them broad access to your account. They list your Github repositories on Travis and allow you to switch on the repositories you want watched.

The default settings are just fine. There are very few settings, mostly for experimental features, so it's not really necessary at all. One of the annoying things about Travis is that there isn't a "go" button. It will *only* start when a new commit is made to your master branch on Gitub. This can make it difficult to get started and test your initial configuration.

- Sign up for Travis
- Give them access to your Github
- Activate travis for your blog
- Make a test commit to kick off the project.

## Making a test commit
Travis offers almost no configuration online because you are supposed to add a `.travis.yml` file to your project. This file is pretty easy to make but it can get quite complicated. Under the hood, Travis is is standing up a brand new virtual machine for your project, running a fresh build from the latest code master on Github, and running tests. Thankfully for us, you can also configure a deploy step that runs after tests have been completed.

Travis is designed for pretty serious teams that need strict and predictable build environments. Projects with a large audience need to ensure that the code that is live on their website is the right code, and that it passes at least some kind of smell test.

In some ways Travis and it's competitors are overkill for a little blog like mine. But it's free and offers a feature we're after -- automomatic deployments of Github master to Firebase. For now, we won't need to run any tests.

### Fix our tests
There are probably some rudimentary tests that we should run to ensure that our latest code isn't totally borked. However, that is outside the scope of what we're trying to accomplish. Without tests, we are making the bold assumption that the code we commit to master will build correctly. For the case of a personal Gatsby blog, the tests can wait for another day.

Gatsby ships with a test script that essentially throws an error stating we should add some tests. This will prevent Travis from deploying our project. So we're going to have to soften that restriction.

```json
{
  "scripts": {
    "test": "echo \"Warn: no test specified\" && exit 0",
  }
}
```

Of course, this isn't a permanent solution. At the very least we should run the linting command that's included with Gatsby. Of course, that can wait. Right now we need to get Travis to deploy our blog. Right now we've set our tests to emit a warning about "no tests" and exiting with a success code so that Travis will continue.

### Adding a `.travis.yml`
We need to add a `.travis.yml` file for building our project. This Gatsby project was generated with a Travis file but it is for building Gatsby itself, not our project. We can get by with a much simpler configuration.

```yaml
language: node_js
node_js:
  - "8"
cache: yarn
before_deploy:
- "npm install -g gatsby"
- "yarn build:prod"
deploy:
  provider: firebase
  project: blog-7e7a6
  token:
    secure:

```

### Secure firebase deploy token for Travis

```bash
firebase login:ci
```
