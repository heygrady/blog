---
title: "Migrating the old site"
description: "I needed to move my old site to a new domain and replace it with my new blog."
date: "2017-06-30T12:42:35Z"
readNext: "/fix-me/"
path: "/migrating-old-site/"
---

At this point I have [created a new blog](/new-blog) and configured it to [deploy to Firebase](/first-launch) at a temporary URL. Now I need to configure the new site to properly redirect to the old site so that I can cleanly retire the old Octopress blog without killing old links.

Thankfully, Firebase has some easy tools for [configuring redirects](https://firebase.google.com/docs/hosting/url-redirects-rewrites). These will all get baked into my `firebase.json` file.

## Configure Redirects
A basic redirect looks like this (this would go in your `firebase.json`):

```json
{
  "source" : "/firebase/*",
  "destination" : "https://firebase.google.com",
  "type" : 302
}
```

We need to create a redirect entry to cover for all of the pages of the old site. Some of the articles from the old blog were mildly popular and have many inbound links to them. The first step is to gather that list of pages.

Thankfully, the old site published all of the posts to the `blog/` folder. This means we can use a wildcard redirect to the old site for anything under "blog". This should redirect all of the links we care about. If people were deep linking to things besides my blog posts they will have to update their links manually.

Eventually this may prove to be a short-sighted approach (what if I need the "blog" folder back?). I could just as easily generate specific redirects for every page in the old sitemap but that isn't necessary at this point. I will update this post when that day comes.

After reviewing the old Octopress site, I came up with the following "good enough" redirects to cover `blog`, `archives`, and `categories`. I followed [these instructions](https://firebase.google.com/docs/hosting/full-config#redirects) for "capture" redirects.

```json
{
  "hosting": {
    "public": "public",
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "redirects": [
      {
        "source" : "/blog/:post*",
        "destination" : "https://2012.heygrady.com/blog/:post*",
        "type" : 302
      },
      {
        "source" : "/archives/:post*",
        "destination" : "https://2012.heygrady.com/archives/:post*",
        "type" : 302
      },
      {
        "source" : "/categories/:post*",
        "destination" : "https://2012.heygrady.com/categories/:post*",
        "type" : 302
      }
    ]
  }
}
```

### Deploy the updated `firebase.json`
Now that we've updated our configuration it can be safely deployed.

```bash
yarn deploy
```

## Migrating the old site
I decided to move the old site to Firebase hosting as well. I had been hosting it on an old server I configured more than a decade ago. I don't want to rely on that old server anymore.

- Create a new project called "2012-blog" (referring to the last time these files were updated)
- Create a new local folder and initialize Firebase within it
- Copy the old files from the live site into the `public/` folder
- Deploy the 2012 site
- Configure Firebase and Google Domains to point https://2012.heygrady.com to the new project.

### Small tweaks
- Update the header to refer to the new site
- Update some places where http is used instead of https
- Update references to internally refer to the 2012 version of the site

## Migrating the new site
At this point, visiting the `blog/` folder ([like this](https://new.heygrady.com/blog/2012/07/03/state-of-browsers-july-2012/)) will redirect to the old 2012 site. Hooray!

When everything appears to be working, update the new blog project in Firebase to connect "heygrady.com" and "www.heygrady.com", and update Google Domains as instructed.

Once the DNS propagates and the certificates are issued, the site should *just work*.

- In Firebase, connect `heygrady.com` and `www.heygrady.com` to the new site (`www` should redirect to `heygrady.com`)
- Update Google Domains to point `@` and `www` A records to the Firebase IP addresses
- Wait for everything to propagate
- When everything is working, edit `new` to redirect to `heygrady.com` in Firebase console.

## What's next?
- [Automatically deploy when changes are pushed to master](/deploying-travis/)
