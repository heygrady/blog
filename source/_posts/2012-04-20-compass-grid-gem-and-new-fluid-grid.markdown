---
layout: post
title: "Compass Grid Plugin and A New Fluid Grid Option"
date: 2012-04-20 23:17
comments: true
categories: sass compass grid css
---
In a previous post on [using Sass with the 1KB CSS Grid]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}), I reviewed in depth the concept of using Sass and Compass to remove unnecessary classes from your HTML markup, and recommended usimg mixins instead. After using this grid on my own projects for the past year I've finally created a Ruby Gem called [compass-grid-plugin](http://rubygems.org/gems/compass-grid-plugin) and I've updated the [GitHub repository](https://github.com/heygrady/compass-grid-plugin) to include a fluid grid option as well. For now I'm calling it "Grid" because that's what I've been calling it. The fluid grid will be documented below.

- [Grid on Github](https://github.com/heygrady/compass-grid-plugin)
- [Grid on Ruby Gems](http://rubygems.org/gems/compass-grid-plugin)

<!--more-->

{% h2 Introducing Grid %}

Although this grid plugin is inspired by the 1KB CSS Grid, it's not simply the Sass version of that grid. So I've opted to rename the grid to simply "Grid" and gobbled up the "compass-grid-plugin" gem name because some [Austrian guy](http://wizzart.at/about.html) already has "[compass-grid](http://rubygems.org/gems/compass-grid)" (it's helpful that all of the other Compass grids use "-plugin" in the gem name also). That's the unimaginative name I'm going with until someone asks me to use a name less confusingly generic. I could maybe be convinced to call it "Pancakes" or "Simple."

{% h3 What does Grid do? %}

The point of Grid is to make grid math easier and make working with grids much more flexible. Old-school CSS-only grids require classes to be added to the markup and do not make working with the grid very easy. What happens when you need padding or a border on your column? What happens when the designer needs to cheat the grid in a few places? Compass Grid makes all of these situations much easier to handle because the measurements are not baked into the CSS and don't require hard-coded classes in the markup.

{% h3 How is Grid different than other Compass grids? %}

There's a few other notable Compass grids. Of course Compass has always shipped with [Blueprint](http://compass-style.org/reference/blueprint/grid/) pre-installed. There's also a port of [960.gs](https://github.com/nextmat/compass-960-plugin) as well as a relatively new entrant, [Susy](https://github.com/ericam/compass-susy-plugin). Someone has also ported [Columnal](https://github.com/diogob/compass-columnal-plugin) to Compass. The original author of the 1KB CSS Grid has created [The Semantic Grid System](http://semantic.gs/) to take advantage of Sass/Less and remove the need for classes in the markup. All of these Compass-powered grids are great and you should use them! But they all are a little more complicated than "just a grid" (with the exception of The Semantic Grid System). At a glance, I think the main differences between most other grids and Grid are as follows:

- Grid does not require Alpha and Omega. This is actually a big win for simplicity. Grid uses negative margins on the rows to accomplish the same thing.
- Grid is designed specifically for cheating the grid using the `$plus` argument.
- Grid is designed specifically to support row nesting.
- Grid only does grid measurements and has no other capabilities.

{% h2 Installing Grid %}

####Install the Ruby Gem.

```
$ gem install compass-grid-plugin
```

####Existing Compass Projects

You can include it in any existing Compass project by adding it to your config.rb file.

```
# Require any additional compass plugins here.
require 'compass-grid'
```

####New Compass Projects

```
$ compass create my_project -r compass-grid -u compass-grid
```

You can install the grid plugin as part of a new Compass project.

{% h2 Introducing Fluid Grid %}

- Documentation is available in the [readme on Github](https://github.com/heygrady/compass-grid-plugin/blob/master/README.md)

While the original grid was pointedly **not** fluid, this new version does support fluid percentage-based grids. The original 1KB CSS Grid series by [Tyler Tate](http://tylertate.com/) pointed out that [nesting fluid grids can be difficult](http://www.usabilitypost.com/2009/06/19/the-1kb-css-grid-part-3/). Very similar to [Susy](http://susy.oddbird.net/) and [Columnal](http://www.columnal.com/), the fluid grid requires context in order to nest columns. This is because of the relative nature of percentages: 25% is a totally meaningless number by itself.

{% h3 Basic HTML %}

Just like the [previous article]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}), we'll use a relatively simple 3-column layout for our page. The HTML below is a basic web page with a `header`, `footer`, and main area. For this example only the main area will contain columns. The `.main-column` will have two columns nested inside of it.

{% gist 2460901 layout.html %}

{% h3 Using a Fixed Grid %}

- [Fixed grid example](/assets/compass-grid-example/fixed.html)

Before diving into the fluid grid, it's important to see how it works with the static grid because the two are highly related. Below is the SCSS for a normal fixed grid similar to the example from the [previous post]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}). Borders have been added to some of the elements to demonstrate how to use the grid correction features using the `$plus` argument available in all of the functions. 

{% gist 2460901 fixed.scss %}

####Notes:

- As you can see, `@include grid-column(6, -2px);` subtracts 2px from the calculated column width to account for the borders on the column. A six-columns-wide column is normally 460px but using the `$plus` argument of -2px, it becomes 458px.
- Although all `section` elements in the `.main-column` are set to be rows, the `section.hero` doesn't have any sub-columns in this example so the normal negative margins are removed.

{% h3 Using a Fluid Grid %}

- [Fluid grid example](/assets/compass-grid-example/fluid.html)

The fluid grid is set up similarly to the fixed grid, except the word "grid" is replaced by the word "fluid" in all of the mixins and functions. The fluid grid relies on the fixed grid for most of the width calculations and it also uses the same configuration options. The nested columns, `#right-column` and `#content`, require additional parameters to provide context because they are nested in the `#main-column`.

{% gist 2460901 fluid.scss %}

####Notes:

- Measurements that affect horizontal spacing, like `width`, `margin-left/right` and `padding-left/right`, should be provided in percentages as well to make sure everything scales well with the browser.
- The `fluid-gutters` mixin returns left and right margins for a column.
	- The `fluid-width` function, combined with the `grid-column-width` function can be used to calculate margins as well.
	- Example: `margin: 0 fluid-width($grid-gutter-width/2, grid-column-width(9, $grid-gutter-width));`
	- Fluid gutters are different for rows and columns. Columns are relative to the parent row (a row is wider by the width of the gutter). Rows are relative to the parent column which is narrower than a row by the width of the gutter.
- When calculating percentages on a child of a row, like `.row > *`, it's important to remember that a row's width is the width of its containing column *plus* the `$grid-gutter-width`.
	- A nine-columns-wide column: `grid-column-width(9)`
	- A nine-columns-wide row: `grid-column-width(9, $grid-gutter-width)`
- There's no need to account for border or padding because all rows and columns have `box-sizing: border-box` applied. You can read more about [box-sizing on MDN](https://developer.mozilla.org/En/CSS/Box-sizing).
	- [Box-sizing requires a prefix on Mozilla](https://bugzilla.mozilla.org/show_bug.cgi?id=243412) which is being handled by the [Compass Box Sizing mixin](http://compass-style.org/reference/compass/css3/box_sizing/)
	- [Box-sizing isn't supported in IE7 or below](http://caniuse.com/#feat=css3-boxsizing)
- Chrome/Safari/Opera, Firefox/IE8/IE9 and IE6/IE7 all disagree on how to handle fractional pixels.
	- Firefox and IE8/9 re-balance the columns so that some columns may be 1px too wide but the total of the columns is exact.
	- Chrome/Safari/Opera simply round down, resulting in all columns being 1px too narrow. This gets really messy when working with deeply nested columns.
	- IE6/7 rounds *up*, making all of the columns too wide and causing one to wrap.
- For now the fluid grid is designed for IE8 and above. Adding fixes for IE6 and IE7 may come later although there'll never be a way to bring in box-sizing support.

{% h3 Generated CSS %}

For those that are curious, the CSS from the examples above looks like this.

{% h4 Fixed Grid Generated CSS %}

{% gist 2460901 fixed.css %}

{% h4 Fluid Grid Generated CSS %}

{% gist 2460901 fluid.css %}