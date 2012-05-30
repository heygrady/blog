---
layout: post
title: "Responsive Images without JavaScript"
date: 2012-05-25 15:44
comments: true
categories: css adaptive images responsive design
---
The hot topic in web development right now is how to gracefully handle images when building a responsive website. Images that change based on media queries are known as responsive or [adaptive images](http://html5doctor.com/html5-adaptive-images-end-of-round-one/). The W3C is currently trying to sort out competing [specifications](http://www.whatwg.org/specs/web-apps/current-work/multipage/embedded-content-1.html#attr-img-srcset) and [ideas from the community](http://www.w3.org/community/respimg/). While the debate continues, many clever developers are coming up with [JavaScript-based solutions](https://github.com/scottjehl/picturefill). But there's a way to provide responsive images without using any JavaScript at all.

If you [don't like the `srcset`](http://timkadlec.com/2012/05/wtfwg/) solution being proposed, or you simply need something that works in today's browsers and doesn't use JavaScript, read below for a potential solution to the responsive image problem.

<!--more-->

{% h2 TL;DR %}

This article covers a method for using CSS to handle responsive images instead of using JavaScript. There are two use-cases discussed in-depth below. [Part 1](#part-1-responsive-images-using-css) covers how to create an responsive image using only CSS. [Part 2](#part-2-proportionally-scaling-responsive-images) covers how to create a proportionally scaled responsive images using only CSS.

**Example:** *See a live example of a [CSS-only responsive image](/assets/adaptive-image-example/step-5.html).*

**Example:** *See a live example of a [CSS-only responsive image that scales proportionally](/assets/adaptive-image-example/proportional-step-3.html).*

{% h3 CSS-Only Responsive Images %}

Here's a quick preview of the technique. This method for responsive images uses CSS in a `<style>` tag to make a `<span>` behave like an image. This method has broad browser support, is accessible and does not require JavaScript.

First is some generic CSS that belongs in a global stylesheet and can be used for all responsive images. The CSS is for making the `<span>` behave more like a native `<img>`. The key to this is `display: inline-block` and `background-size: 100%`.

{% gist 2815664 final.css %}

**NOTE:** please [see below for an explanation of this CSS](#step-3-generic-styles-for-all-images).

Second is the base HTML for all responsive images. Essentially the HTML below will replace each `<img>` tag that needs to respond to media queries. Of course the media queries themselves should be placed inside the `<style>` tag.

{% gist 2815664 final.html %}

**NOTE:** The media queries are explained in [step 4](#step-4-specific-styles-for-the-individual-image) below.

{% h2 Part 1: Responsive Images Using CSS %}

There are many [good articles about handling responsive images](http://css-tricks.com/on-responsive-images/) and they all have the same goal of supporting the types of media query wizardry that can be accomplished in CSS for swapping out images. While most of those solutions utilize JavaScript to swap the `src` of an `<img>`, I'm proposing that using CSS background images is probably good enough and avoids most of the pitfalls of the other techniques. It's fairly easy to make a `<span>` with a background image behave exactly like a real `<img>` with some basic CSS, primarily relying on [`display: inline-block`](https://developer.mozilla.org/en/CSS/display) and [`background-size: 100%`](https://developer.mozilla.org/en/CSS/background-size).

Of course, moving every in-page image on your site to your global stylesheets is impractical and ill-advised. The images we're talking about are part of the content and have no place in your site's global styles; they're very likely to be managed by a CMS. The solution is to embed the styles in the HTML by placing a `<style>` tag in the `<body>` instead of in the global stylesheet.

A recent draft of HTML5 spec would allow for `<style>` tags in the `<body>` as long as they carry a `scoped` attribute ([although this currently won't validate](http://stackoverflow.com/questions/6751922/what-practice-to-use-for-html5-scoped-attribute)). Using a `<style>` tag this way is only marginally different than the usage of `<source>` as proposed in [the picturefill method](http://www.w3.org/community/respimg/2012/03/07/14/) and it's certainly less confusing than the [srcset proposal](http://lists.w3.org/Archives/Public/public-whatwg-archive/2012May/0247.html). Using CSS carries with it the benefit of a familiar, flexible syntax and broad browser support. This also avoids relying on an [emerging and contentious standard](http://blog.cloudfour.com/the-real-conflict-behind-picture-and-srcset/).

{% h3 Start with a Regular Image %}

To start, we need a regular `<img>` that we wish was responsive. The example below is just that: a boring old image that doesn't do anything special.

{% gist 2815664 step-0.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-0.html) even though this isn't responsive and is just a regular image.*

{% h3 Step 1: Use a SPAN %}

In order to fake an image using CSS, we need to start with a `<span>`. Because a `<span>` is inline by default, [`display: inline-block` is supported on that element in IE6 and IE7](http://www.quirksmode.org/css/display.html). There's long been a usable [hasLayout hack that makes IE6 and IE7 apply inline-block to any element](http://blog.mozilla.org/webdev/2009/02/20/cross-browser-inline-block/) but &mdash; to me at least &mdash; a `<span>` is already closer to the image layout we want before any styles have been applied. For now we'll place the alt text inside the `<span>` but we'll fix that in the next step.

Below you can see a simple `<span>` with an `.image` class ready to be styled.

{% gist 2815664 step-1.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-1.html) although there's not much to see yet.*

**NOTE:** You could use a fictional tag like `<picture>` instead of `<span>` but that would require a [shim for IE6, IE7 and IE8](http://ejohn.org/blog/html5-shiv/). You could also use `<div>` instead of `<span>` without any adverse effects.

{% h3 Step 2: Add an ARIA Role %}

[ARIA](http://www.w3.org/WAI/intro/aria.php) supplies [a `role="img"` for a container that visually represents an image](http://www.w3.org/TR/wai-aria/roles#img). Applying this will help ARIA-enabled browsers understand what this `<span>` is used for. ARIA also specifies that the `role="img"` is not labeled by its contents so we need to move the alt text to the `aria-label` attribute.

Below you can see the `<span>` with an ARIA `role` applied and the alt text moved to an ARIA label.

{% gist 2815664 step-2.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-2.html) although there's still not much to see.*

{% h3 Step 3: Generic Styles for All Images %}

Now that we've got the mark-up for an accessible image, we need to make it behave like an image using some CSS. This CSS is generic to all `.image` elements and can be placed in your global stylesheets.

First we'll use [Compass](http://compass-style.org/) to generate our generic styles. Although Compass isn't available in a browser, it's a good start for generating the default styles needed for our new `.image` elements. Compass already has some mixins for [cross-browser inline-block](http://compass-style.org/reference/compass/css3/inline_block/), [squishing text](http://compass-style.org/reference/compass/typography/text/replacement/#mixin-squish-text) and [vendor-prefixed background-size](http://compass-style.org/reference/compass/css3/background_size/). This helps immensely because they've already done the research for us to make this work seamlessly across all browsers. (If you're unfamiliar, learn how to [get started with Sass and Compass](http://thesassway.com/beginner/getting-started-with-sass-and-compass).)

- `display: inline-block` makes the `<span>` behave like an `<img>`. Inline-block allows the element to follow the document flow like an inline element but it can also have dimension (height and width) like a block element. Here's [an article about inline-block](http://designshack.net/articles/css/whats-the-deal-with-display-inline-block/).
- Squishing text is preferred to hiding text in this case because of [some issues with text-indent in mobile WebKit](http://www.zeldman.com/2012/03/01/replacing-the-9999px-hack-new-image-replacement/).
- `background-size: 100%` forces the background image to stretch to the full size of the element so that it behaves like a real image. Read about [`background-size` on MDN](https://developer.mozilla.org/en/CSS/background-size).
- `background-position: 50% 50%` helps out browsers that don't support `background-size` by keeping the image centered in the `.image`.
- `background-repeat: no-repeat` keeps the background from repeating.

Below is the example SCSS code that was used to generate the generic CSS needed for this technique. Again, generating styles with Compass is an unnecessary step in this case but it was included as a shortcut explanation for all of the crazy styles required for cross-browser support.

{% gist 2815664 generic.scss %}

Once compiled, the SCSS code above looks like the following CSS. The generic styles for `.image` can be shared for all responsive images on the page. That helps make the specific styles for the individual responsive images more compact and readable. The code below is ready to use and should be placed in your site's global stylesheets.

{% gist 2815664 generic.css %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-3.html) although there's yet again not much to see.*

**NOTE:** IE6, IE7 and IE8 (and some other legacy browsers) don't support `background-size`. This only affects those browser's ability to scale the image. It will work just fine for a fixed-dimension image that is shown at its default size. See [background-size support on When Can I Use](http://caniuse.com/background-img-opts). It's important to note that [support for media queries](http://caniuse.com/css-mediaqueries) closely matches support for `background-size`. Basically it's safe to assume that a browser that doesn't support media queries also doesn't support background-size and vice versa. So your fall-back styles in the next step should take that limitation into account.

{% h3 Step 4: Specific Styles for the Individual Image %}

Now it's time to apply the background image to our `<span>`. We don't want to place these styles in the global stylesheet because our image is specific to the content of our page. The rule of thumb is that if you'd normally use an `<img>` you probably want it to be in-page using this technique. For each image we'll be placing a `<style>` element just above it. Each image also needs a unique ID to make sure our styles are applied to the correct image. Although placing a `<style>` element in the body is not technically allowed in HTML, it actually works just fine in all browsers.

For each media query we need to provide a background image and a height and width. The result is very similar to the mark-up for [the Picturefill solution proposed for the `<picture>` tag](https://github.com/scottjehl/picturefill#markup-pattern-and-explanation). Although using a `<style>` tag is decidedly more verbose &mdash; CSS is not known for brevity &mdash; it doesn't require the weird duplicative HTML comments `<picture>` requires for full browser support. Plus, a pure CSS method doesn't require any JavaScript whatsoever.

The example below shows the `<style>` element just above our `<span>` with all of the styles for our responsive image. In this example the fall-back is the desktop version but otherwise a [mobile first approach](http://www.stuffandnonsense.co.uk/blog/about/this_is_the_new_320_and_up) is used in the media queries. The media queries below are simple examples and your project will undoubtedly require [different break points](http://www.palantir.net/re-thinking-breakpoints).

- The fall-back should probably be the default desktop image.
- Each media query should supply a `background-image` as well as the `height` and `width` because the browser can't guess the size of a background image the way it can with regular `<img>` elements.
- Other necessary styles like `display: inline-block` and `background-size: 100%` are handled by the global CSS styles described in [step 3 above](#step-3-generic-styles-for-all-images).
- The `<span>` must be given a unique ID to ensure that styles are applied correctly.

{% gist 2815664 step-4.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-4.html); now we're in business.*

**NOTE:** Although the vast majority of examples on the web recommend adding the smallest, mobile optimized image as the fall-back, I prefer to supply the default desktop image to the browsers that don't support media queries. The only browsers that get the fall-back image are browsers that don't support media queries, and those browsers are almost exclusively IE6, IE7 and IE8. Supplying the mobile image as the fall-back is silly considering that there aren't any mobile browsers with any noticeable marketshare that require the fall-back. The mobile browsers we're targeting all support media queries.

In general, I'm of the opinion that browsers that don't natively support responsive design should simply be served the vanilla desktop experience, since that's almost certainly what those users were expecting anyway.

{% h3 Step 5: Add in Scoped %}

To make ourselves feel better about using invalid markup, let's add `scoped` to our style tag to at least [conform to the new HTML5 standard](http://html5doctor.com/the-scoped-attribute/). This won't make our code validate any better than it would have otherwise and support for the `scoped` attribute is currently non-existent.

The lack of support for `scoped` means that we'll have to keep using the `id` in our styles instead of being able to use more generic `.image` to add the background image and dimensions. That's ok though; we're only adding in the scoped attribute to appear to be writing valid markup and to hopefully prepare for future compatibility and validity. WebKit already has experimental support and other browsers are sure to follow.

Scoped `<style>` elements need a wrapper element to define, well&hellip;the scope. If we use an inline element like a `<span>` as the wrapper it will automatically shrink-wrap our responsive image and not have any negative effect on our layout. (**UPDATE:** It appears that [inline elements are not valid style scopes](http://validator.w3.org/check?uri=http%3A%2F%2Fheygrady.com%2Fassets%2Fadaptive-image-example%2Fproportional-step-3.html&charset=%28detect+automatically%29&doctype=HTML5&group=0))

Below you can see the identical markup from [step 4](#step-4-specific-styles-for-the-individual-image) with the addition of the `scoped` attribute and a new `.image-scope` element. The `.image-scope` element doesn't require any additional styles because it is a `<span>` and is `display: inline` already.

{% gist 2815664 step-5.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/step-5.html) that looks exactly the same as [step 4](#step-4-specific-styles-for-the-individual-image).*

**NOTE:** Because of the lack of browser support for `scoped`, this step is completely optional and only serves to make the mark-up slightly more compliant. Even then, using `scoped` is pretty controversial &mdash; there's severe backwards compatibility issues &mdash; and you may wish to skip it altogether.

{% h2 Part 2: Proportionally Scaling Responsive Images %}

When working with responsive design, it's becoming increasingly popular to use fluid layouts to ensure that the content is fitting the screen properly. When using a normal `<img>` it's easy to support scalable dimensions by defining only the width of the image with a percentage and letting the browser proportionally scale the image height. Although it requires some ingenuity, the responsive image techniques described above can also be combined with [proportional scaling](http://haslayout.net/css-tuts/CSS-Proportional-Image-Scale).

{% h3 Normal Example %}

Below is an example of how this is handled with a normal image. The `<img>` will scale proportionally, meaning the width will always match the width of its container. The height will always be the appropriate height. This way the image will never appear stretched or distorted. This trick is useful for fluid layouts where you don't know the exact width of the column.

{% gist 2815664 proportional-step-0.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/proportional-step-0.html) even though this isn't responsive and is just a regular image. It does scale proportionally though.*

{% h3 Step 1: Adding an Inner Element %}

Background images can't affect layout, which forces us to define a fixed height and width to use the responsive techniques outlined above. So it's not immediately obvious how to proportionally scale the height of the `<span>`. The solution is to use a percentage `padding-top` on an inner element to provide the proportionate height (see [padding on MDN](https://developer.mozilla.org/en/CSS/padding)).

For `padding`, percentages are defined relative to the parent element's width. Somewhat counter-intuitively, `padding-top` is *also* defined as a percentage of the parent element's width &mdash; not the height as you might expect. Using `padding-top` on an inner element allows the height to be proportionally scaled.

Below is the `.image` as described above with an additional `.inner` element.

{% gist 2815664 proportional-step-1.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/proportional-step-1.html) although it doesn't scale yet.*

{% h3 Step 2: Adding More Generic Styles %}

The `.inner` element needs to be set to `display: block` so that it can have dimensions applied. The `height: 0` is required because it gets its height from padding that is applied in the `<style>` element. The CSS below should be added to the generic CSS created in [step 3 above](#step-3-generic-styles-for-all-images).

{% gist 2815664 proportional.css %}

**Example:** *[See a live example](/assets/adaptive-image-example/proportional-step-2.html) although it still doesn't scale.*

{% h3 Step 3: Responsive, Proportionally-Scaled Images %}

As mentioned above, the height of the `.inner` element comes from a percentage applied to `padding-top`. The percentage is calculated by dividing the height of the source image by the width. For instance, if an image is 200 pixels wide and 100 pixels tall, the `padding-top` would be 50% (100px / 200px * 100% = 50%).

The example below allows the responsive image to scale proportionally.

{% gist 2815664 proportional-step-3.html %}

**Example:** *[See a live example](/assets/adaptive-image-example/proportional-step-3.html) that should scale proportionally as expected in browsers that support `background-size`.*

**NOTE:** As mentioned above, proportional scaling will only work in browsers that support `background-size`. Unsupported browsers will simply show the background at full-size, centered inside the `<span>`. If the `<span>` is smaller than the image in IE8 and below, the image will appear clipped.

{% h2 Conclusion %}

This idea is in its infancy right now but I think it may be a good alternative to the many JavaScript-based solutions out there. The positive side is that it makes it simple to supply media queries for creating responsive/responsive images and it doesn't use any JavaScript at all. The negative side is that the markup isn't 100% valid and the CSS can get a little verbose. At the same time, none of the other proposed solutions have a particularly clean syntax either. The `<picture>` tag requires multiple `<source>` tags, each with their own media query and relies on JavaScript. The `srcset` proposal uses an alternate syntax to media queries, is not easy to understand and also will require JavaScript to function cross-browser.

The biggest concern is how to roll out responsive images over a large organization. What happens if a large corporation upgrades their website with a new responsive design to take full advantage of the rapidly growing mobile market? Should they roll out the `<picture>` tag or the `srcset` solutions? Should they roll out a complicated `<style scoped>` solution like what's proposed above? No matter what path is chosen, the result is going to be slightly messy because there are no CMS that currently provide a nice solution for managing responsive images across a large organization.

Although most people are probably not going to be comfortable faking images using a `<span>` and an embedded `<style>` tag, I believe the immediate browser support and predictable behavior of this solution make it a compelling addition to the responsive image conversation.