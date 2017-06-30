---
title: Migrating the old site
date: "2017-06-30T12:42:35"
readNext: "/fix-me/"
path: "/migrating-old-site/"
---

At this point I have created a new blog and configured it to deploy to firebase at a temporary URL. Now I need to configure the new site to properly redirect to the old site so that I can cleanly retire the old Octopress blog without killing old links.

Thankfully, Firebase has some easy tools for [configuring redirects](https://firebase.google.com/docs/hosting/url-redirects-rewrites). These will all get baked into my `firebase.json` file.

## Configure Redirects
A basic redirect looks like this:

```json
{
  "source" : "/firebase/*",
  "destination" : "https://firebase.google.com",
  "type" : 302
}
```

We need to create a redirect entry to cover for all of the pages of the old site. Some of the articles from the old blog were mildly popular and have many inbound links to them. The first step is to gather that list of pages.

Thankfully, the old site published all of the posts to the `blog/` folder. This means we can use a wildcard redirect to the old site for anything under blog. This will capture a wide variety of links.

Eventually this may prove to be a short-sighted approach. I will update this post when that day comes.

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
        "destination" : "http://2012.heygrady.com/blog/:post*",
        "type" : 302
      }
    ]
  }
}
```
