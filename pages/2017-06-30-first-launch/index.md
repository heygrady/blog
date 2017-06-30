---
title: "First launch: Firebase"
date: "2017-06-30T11:15:30"
readNext: "/fix-me/"
path: "/first-launch/"
---

I'm going to be using [Firebase](https://firebase.google.com/) to host my blog initially. The free tier on Firebase is perfect for a project like this -- I'm using Gatsby, which generates a single page React app. [Firebase Hosting](https://firebase.google.com/docs/hosting/) is tailor made for single page web apps.

## Create an account, get started
I already had an account. You can create one for yourself: https://firebase.google.com/

- Create an account
- Start a new project (I named mine "blog")
- Make sure you have firebase tools installed
- Initialize your project

```bash
# from an empty folder
npm install -g firebase-tools
firebase login
firebase init
```

If you already have a project, firebase will cause you some troubles. I created an empty test folder, initialized my project, and then copied the `firebase.json` and `.firebaserc` files into my gatsby root (where your `package.json` lives).

## firebase.json

The ultimate goal is to create a firebase.json file. I got stuck on `firebase init` (it just froze without any errors). Turned out that I needed to [update my Node](https://github.com/firebase/firebase-tools/issues/370) because of a regression.

I ended up with this `firebase.json` file:

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

## First deploy
Without configuring Firebase at all you can deploy it to the generic URL very easily. Presuming you have firebase and Gatsby configured correctly, this should work.

```bash
# build gatsby and deploy it
yarn build && firebase deploy
```

#### Better deploys
Gatsby initializes projects with a few scripts in the `package.json` file. This makes it easy to collect scripts that are important to your project. For instance, you can see that `yarn dev` will execute the `dev` script, which is just an alias for `gatsby dev`. It's pretty handy.

We need to update the `deploy` script to use firebase instead of gh-pages.

```json
{
  "scripts": {
    "deploy": "gatsby build --prefix-links && firebase deploy"
  }
}
```

#### Where does it deploy
Because I haven't changed any firebase settings from the default, it publishes the `public/` folder to a funky URL. My site currently goes to `https://blog-8a5b7.firebaseapp.com/`

## Fixing the URL
I need to get my new blog hosted on my website. Because I'm migrating my blog, I will set up a temporary subdomain. Later I will replace the current [heygrady.com](http://heygrady.com) with the new site. If you are viewing this blog post on heygrady.com you are living in the future -- hello from the past!

For now I need to create `new.heygrady.com` and point it to my firebase hosting. I recently switched my domains from Godaddy to Google Domains to make with process much simpler.

- In Firebase, choose to "[connect domain](https://firebase.google.com/docs/hosting/custom-domain)"
- In Google Domains, configure DNS, add an A record for `new` with the two addresses specified by Firebase
- At first your site will throw a security error
- In an hour or so it will be "all good"

Now my blog is live! But not on the final domain. I need to set up some redirects for the old site.
