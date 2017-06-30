---
title: Migrating the old site
date: "2017-06-30T12:42:35"
readNext: "/fix-me/"
path: "/migrating-old-site/"
---

At this point I have created a new blog and configured it to deploy to Firebase at a temporary URL. Now I need to configure the new site to properly redirect to the old site so that I can cleanly retire the old Octopress blog without killing old links.

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

After reviewing the old Octopress site, I came up with the following "good enough" redirects to cover `blog`, `archives`, and `categories`.

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

#### Deploy the updated firebase.json
This can be safely deployed for testing purposes.

```
yarn deploy
```

## Migrating the old site
I decided to move the old site to Firebase hosting as well.

- Create a new project called "2012-blog" (referring to the last time these files were updated)
- Created a new local folder and initialize Firebase within it
- Copy the old files from the live site into the `public/` folder
- Deploy the site
- Configure Firebase and Google Domains to point https://2012.heygrady.com to the new project.
- Never touch these files again :)

## Migrating the new site
At this point, visiting the `blog/` folder (like https://new.heygrady.com/blog/2012/07/03/state-of-browsers-july-2012/) will redirect to the old 2012 site. Hooray!

When everything appears to be working, update the new blog project in Firebase to connect "heygrady.com" and "www.heygrady.com", and update Google Domains as instructed.

Once the DNS propagates and the certificates are issued, the site should work just fine.

- Connect heygrady.com and www.heygrady.com to the new site (www should forward to heygrady.com)
- Update Google Domains to point `@` and `www` A records to the Firebase IP addresses
- Wait for everything to propagate
- When everything is working, configure "new" to forward to heygrady.com in Firebase console.

## What's next?
- Automatically deploy when changes are pushed to master
