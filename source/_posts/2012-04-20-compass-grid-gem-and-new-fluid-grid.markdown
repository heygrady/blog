---
layout: post
title: "Compass Grid Gem and New Fluid Grid"
date: 2012-04-20 23:17
comments: true
categories: sass compass grid css
---
In a previous post on [using Sass with the 1KB CSS Grid]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}) I reviewed in depth the concept of using Sass and Compass to remove unnecessary classes from your HTML markup and use mixins instead. After using this grid on my own projects for the past year I've finally created a Ruby Gem for called [compass-grid-plugin](http://rubygems.org/gems/compass-grid-plugin) and I've updated the [GitHub repository](https://github.com/heygrady/1KB-SCSS-Grid) to include a fluid grid option as well. The fluid grid will be documented her in depth.

- [Grid on Github](https://github.com/heygrady/1KB-SCSS-Grid)
- [Grid on Ruby Gems](http://rubygems.org/gems/compass-grid-plugin)

<!--more-->

{% h2 Introducing Grid %}

Although this grid plugin is inspired by the 1KB CSS Grid, it's not simply the Sass version of that grid. So I've opted to rename the grid to simply "Grid" and gobbled up the "compass-grid-plugin" gem name because some [Austrian guy](http://wizzart.at/about.html) already has "[compass-grid](http://rubygems.org/gems/compass-grid)". That's the nondescript name I'm working with until someone asks me to rename it something less confusingly generic. I could maybe be convinced to call it "Pancakes."

{% h3 What does Grid do? %}

The point of Compass Grid is to make grid math easier and make working with grids much more flexible. Old-school CSS-only grids require classes to be added to the markup and do not make working with the grid very easy. What happens when you need padding or a border on your column? What happens when the designer needs to cheat the grid in a few places? Compass Grid makes all of these situations much easier to handle because the measurements are not baked into the CSS and don't require hard-coded classes in the markup.

{% h3 How is Grid different than other Compass grids? %}

There's a few other notable Compass grids. Of course Compass has always shipped with [Blueprint](http://compass-style.org/reference/blueprint/grid/) pre-installed. There's also a port of [960.gs](https://github.com/nextmat/compass-960-plugin) as well as a relatively new entrant, [Susy](https://github.com/ericam/compass-susy-plugin). Someone has also ported [Columnal](https://github.com/diogob/compass-columnal-plugin) to Compass. The original author of the 1KB CSS Grid has created [The Semantic Grid System](http://semantic.gs/) to take advantage of Sass/Less and remove the need for classes in the markup. All of these Compass-powered grids are great and you should use them! But they all are a little more complicated than "just a grid" (with the exception of The Semantic Grid System). At a glance, I think the main differences between most other grids and Grid are as follows:

- Grid does not require Alpha and Omega.
- Grid is designed specifically for cheating the grid using the `$plus` argument.
- Grid is designed specifically to support row nesting.
- Grid is designed to be as simple and flexible as possible.

{% h2 Installing Grid %}

####Install the Ruby Gem.
```
$ gem install compass-grid-plugin
```

####Existing Compass Projects
You can include it in any existing Compass project by including the grid in your config.rb file.

``` ruby config.rb
# Require any additional compass plugins here.
require 'compass-grid'

```

####New Compass Projects
You can install the grid plugin as part of a new Compass project.

{% codeblock %}
$ compass create my_project -r compass-grid -u compass-grid
{% endcodeblock %}

{% h2 Introducing Fluid Grid %}

While the original grid was pointedly **not** fluid, this new version does support fluid, percentage-based grids. The original 1KB CSS Grid series by [Tyler Tate](http://tylertate.com/) pointed out that [nesting fluid grids can be difficult](http://www.usabilitypost.com/2009/06/19/the-1kb-css-grid-part-3/). Very similar to [Susy](http://susy.oddbird.net/) and [Columnal](http://www.columnal.com/), the fluid grid requires context in order to nest columns. This is because of the relative nature of percentages: 25% is a totally meaningless number by itself.

{% h3 Basic HTML %}

Just like the [previous article]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}), we'll use a relatively simple 3-column layout for our page. The HTML below is a basic web page with a `header`, `footer`, and main area. For this example only the main area will contain columns. The `.main-column` will have two columns nested inside of it.

{% gist 2460901 layout.html %}

{% h3 Using a Fixed Grid %}

- [Fixed grid example](/assets/compass-grid-example/fixed.html)

Below is the SCSS for a normal fixed grid similar to the example from the [previous post]({% post_url 2011-02-17-using-sass-with-the-1kb-grid-system %}). Borders have been added to some of the elements to demonstrate how to use the grid correction features using the `$plus` argument available in all of the functions. 

{% gist 2460901 fixed.scss %}

####Notes:

- As you can see, `@include grid-column(6, -2px);` subtracts 2px from the calculated column width to account for the borders on the column. A six-columns-wide column is normally 460px but using the `$plus` argument of -2px it becomes 458px.
- Although all `section` elements in the `.main-column` are set to be rows, the `section.hero` doesn't have any sub-columns in this example so the normal negative margins are removed.

{% h3 Using a Fluid Grid %}

- [Fluid grid example](/assets/compass-grid-example/fluid.html)

The fluid grid is set up virtually the exact same as the fixed grid. 

{% gist 2460901 fluid.scss %}