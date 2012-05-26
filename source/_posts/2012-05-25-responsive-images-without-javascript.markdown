---
layout: post
title: "Responsive Images without JavaScript"
date: 2012-05-25 15:44
comments: true
categories: 
---
The current hot topic for web development right now is how to gracefully handle images when building a responsive website. The W3C is currently trying to sort out competing specifications from Apple and from the community and many developers are coming up with some clever JavaScript-based solutions. But there's a way to handle this using technology already built into today's browsers. I haven't seen discussed anywhere &mdash; possibly because it's pretty hacky and isn't much prettier than any of the other solutions. The good news is you don't need a `<noscript>` tag. The bad news is you need a `<style scoped>` in the `<body>`. The best news is any browser that supports media queries can support responsive images without any need for JavaScript.

<!--more-->

{% h2 Basic Markup %}

The basic markup below relies on some shared styles that will be shown further down. The idea is that, since CSS has such excellent support for media queries, it's probably best to use CSS for swapping out the image source. This is the method used for background images in CSS stylesheets and it works fine inline as well. First there's an optional `.image-scope` that can supply the bounding scope to the inline `<style>`. Since `scoped` isn't supported in any browser, it's not strictly necessary and is rendered even more useless by prefixing the styles with an `id`.

Next is the `<style>` tag that contains our styles. The image itself is loaded as a background image on a `<span>` that's been set to `display: inline-block`. The height and width need to be set as well. If the image needs alt text, it can be added as text inside the `<span>`.

```html
<span class="image-scope">
  <style scoped>
  /* Fall-back for non-media-query browsers */
  #image-1 {
    background-image: url('image-1.jpg');
    height: 100px;
    width: 200px;
  }

  /* Double-sized image for retina displays */
  @media
  only screen and (-webkit-min-device-pixel-ratio: 1.5),
  only screen and (-o-min-device-pixel-ratio: 3/2),
  only screen and (min--moz-device-pixel-ratio: 1.5),
  only screen and (min-device-pixel-ratio: 1.5) {
    #image-1 { background-image: url('image-1-retina.jpg'); }
  }
  </style>
  <span id="image-1" class="image">Alt text goes here.</span>
</span>
```

{% h2 Basic Styles %}

In order to properly emulate a real image using a background image, some basic styles need to be set for each `.image`.

```css
.image {
  /* inline block */
  display: -moz-inline-box;
  -moz-box-orient: vertical;
  display: inline-block;
  vertical-align: middle;
  *vertical-align: auto;

  /* squish text */
  font: 0/0 serif;
  text-shadow: none;
  color: transparent;

  /* background-size */
  -webkit-background-size: 100%;
  -moz-background-size: 100%;
  -o-background-size: 100%;
  background-size: 100%;

  overflow: hidden;
  background-repeat: no-repeat;
}
.image { *display: inline; } /* inline block for IE6/7 */
.image .inner { display: block; height: 100%; }
```