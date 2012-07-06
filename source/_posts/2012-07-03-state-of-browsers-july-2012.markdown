---
layout: post
title: "State of Browsers, July 2012"
date: 2012-07-03 11:51
comments: true
categories: browsers
---
There's been some big changes in the browser world in the last year. Google's Chrome has continued to gain tremendously in popularity, and Internet Explorer 9 has started to supplant the older versions of Microsoft's much-maligned brower. Mobile browsers have also started to take a big bite of the overall browser market.

Web developers need to know about browser usage in order to make rational choices for browser testing and for choosing which features they can rely on it browsers. With [jQuery's recent choice to phase out legacy IE support](http://blog.jquery.com/2012/07/01/jquery-1-9-and-2-0-tldr-edition/), there's a renewed focus on what browsers make sense to support.

<!--more-->
{% h2 Market Share for Past 12 Months; As of July 2012 %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=1&headers=1&range=A1%3AN12&gid=0&pub=1","options":{"vAxes":[{"useFormatFromData":false,"formatOptions":{"source":"inline","suffix":"%"},"viewWindowMode":"pretty","format":"0.##'%'","viewWindow":{}},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"series":{"1":{"color":"#3c78d8"},"2":{"color":"#6d9eeb"},"3":{"color":"#a4c2f4"},"4":{"color":"#ff9900"},"5":{"color":"#f6b26b"},"6":{"color":"#109618"},"7":{"color":"#990099"},"8":{"color":"#b82e2e"},"9":{"color":"#0099c6"},"10":{"color":"#b7b7b7"}},"title":"Browser Market Share, July 2011 - June 2012","curveType":"","booleanRole":"certainty","height":389,"animation":{"duration":0},"width":618,"lineWidth":2,"hAxis":{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}},"state":{},"chartType":"LineChart","chartName":"Browse Market Share, July 2012"} </script>
</figure>

Since the beginning of the year, IE9 has been making up a lot of ground while IE8 has been plummeting. This is probably due to a combination of [Microsoft's much touted update policy](http://paulirish.com/2012/the-skinny-on-ies-update-policy/) and the [continued success of Windows 7](http://gs.statcounter.com/#os-US-monthly-201106-201206). Meanwhile, Chrome has continued to see tremendous growth, growing by nearly 7% in only a year. 

Mobile is the other major success story of the last year. Adding iPad to the mobile statistics, mobile has grown more than 3% in the last year and continues to grow.

Read [about the data](#about-the-data) below.

{% h3 Comparing June 2011 vs. June 2012 %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=0&headers=1&range=A1%3AC8&gid=20&pub=1","options":{"vAxes":[{"useFormatFromData":false,"formatOptions":{"source":"inline","suffix":"%"},"viewWindowMode":"pretty","format":"0.##'%'","viewWindow":{}},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"title":"Browser Market Share, June 2011 vs. June 2012","booleanRole":"certainty","animation":{"duration":0},"hAxis":{"useFormatFromData":true,"title":"","slantedTextAngle":30,"slantedText":true,"viewWindowMode":"pretty","viewWindow":{}},"isStacked":false,"width":600,"height":371},"state":{},"chartType":"ColumnChart","chartName":"Chart 6"} </script>
</figure>
As usual, [Firefox, Safari and Opera have remained fairly static](http://gs.statcounter.com/#browser-US-monthly-201106-201206). Overall, Firefox has dropped a few percentage points, likely due to users switching to Chrome. Firefox has been hovering around 20% for several years and has bounced back from slumps before. Safari's market  share seems to be linked to the [market share of OSX](http://gs.statcounter.com/#os-US-monthly-201106-201206), which also tends not to fluctuate much.

The only two browser segments that are seeing positive trending are Chrome and Mobile. While Chrome continues to steal from Firefox, the bigger victim appears to be IE. It's reasonable to assume that mobile is stealing market share equally from all browsers.

{% h3 Individual Versions; June 2011 vs. June 2012 %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=0&headers=1&range=A11%3AC22&gid=20&pub=1","options":{"vAxes":[{"useFormatFromData":false,"title":null,"formatOptions":{"source":"inline","suffix":"%"},"minValue":null,"viewWindowMode":"pretty","format":"0.##'%'","viewWindow":{"min":null,"max":null},"maxValue":null},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"booleanRole":"certainty","title":"Browser Market Share, June 2011 vs. June 2012","animation":{"duration":0},"hAxis":{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}},"isStacked":false,"width":600,"height":371},"state":{},"chartType":"ColumnChart","chartName":"Chart 6"} </script>
</figure>
While IE overall has seen a large decline, IE9 has seen huge gains. In fact, all of the "modern" browsers have seen dramatic increases, while all of the "legacy" browsers have started to decline. IE6, IE7 and IE8 have all seen their market share drop by half in the last year.

Legacy Firefox has plummeted nearly 7%. The modern versions of Firefox have made modest gains, although not enough to offset the decline of the legacy versions, causing an overall decline (as shown above).

This is all great news for web developers. Not only are modern browsers releasing great new technologies, users are actually adopting these browsers en masse.

{% h3 Market Share in June 2012 %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=0&headers=1&merge=COLS&range=A1%3AA12%2CN1%3AN12&gid=0&pub=1","options":{"vAxes":[{"title":null,"useFormatFromData":true,"minValue":null,"viewWindowMode":"pretty","viewWindow":{"min":null,"max":null},"maxValue":null},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"pieHole":0,"booleanRole":"certainty","title":" Browser Market Share, June 2012","animation":{"duration":0},"colors":["#3366CC","#3c78d8","#6d9eeb","#6d9eeb","#ff9900","#f6b26b","#109618","#990099","#B82E2E","#0099c6","#b7b7b7","#22AA99","#AAAA11","#6633CC","#E67300","#8B0707","#651067","#329262","#5574A6","#3B3EAC","#B77322","#16D620","#B91383","#F4359E","#9C5935","#A9C413","#2A778D","#668D1C","#BEA413","#0C5922","#743411"],"is3D":false,"annotations":{"domain":{}},"hAxis":{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}},"width":618,"height":389},"state":{},"chartType":"PieChart","chartName":"Chart 3"} </script>
</figure>

The pie-chart above shows the combined mobile and desktop browser market share for June 2012. The top browsers in the US are Chrome, IE9, Firefox, and IE8. When combined together, mobile has a greater market share than Safari, Opera, legacy Firefox and IE6/7 combined. We're now in an interesting period where it makes more sense to focus developer resources on mobile platforms rather than legacy versions of IE.

{% h4 IE6 Is Gone Forever; IE7 Is Hot On Its Heels %}
The good news is that IE6 is nearly invisible in the United States now. Above you can see it has around 0.3% market share. Even the [NetMarketshare](http://www.netmarketshare.com/browser-market-share.aspx?qprid=2&qpcustomd=0&qptimeframe=M&qpsp=161) data that's used on [IE6 Countdown](http://www.ie6countdown.com/) shows IE6 at 0.6% in the US. By this time next year IE will likely be an afterthought in every market except China. Even in [China](http://gs.statcounter.com/#browser_version_partially_combined-CN-monthly-201106-201206), IE6 has been taking a severe nosedive in the past 12 months.

In the past 12 months IE7 has lost more than half of it's market share. IE7's downward trend has been fairly constant and predictable. IE7 lost an average of 0.33% market share in the previous twelve months. By this time next year IE7 will undoubtedly be well below the 1% mark.

{% h4 Mobile Is Here to Stay %}
Mobile devices have made great strides in the past few years. The mobile browsers are just as capable as any of the other modern browsers. And the devices feel just as snappy a regular (budget) computer. The days of crappy, Java-based browsers and cumbersome experiences are long gone and users have taken notice. It's fast becoming a requirement to consider mobile devices as first-class citizens. In the [debate over responsive design](http://www.webdesignerdepot.com/2012/07/insider-views-on-responsive-design-the-debate-continues/) vs. m-dot websites, usage trends are pointing towards responsive design.

{% h2 Choosing A-Grade Browsers %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=1&headers=1&range=A1%3AB15&gid=19&pub=1","options":{"vAxes":[{"useFormatFromData":false,"minorGridlines":{"count":"2"},"formatOptions":{"source":"inline","suffix":"%"},"viewWindowMode":"pretty","format":"0.##'%'","viewWindow":{}},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"series":{"0":{"color":"#109618"},"1":{"color":"#3366cc"},"3":{"color":"#3c78d8"},"5":{"color":"#0099c6"},"7":{"color":"#8e7cc3"},"8":{"color":"#6d9eeb"},"9":{"color":"#b7b7b7"}},"booleanRole":"certainty","title":"Browser Market Share, July 2012","animation":{"duration":0},"hAxis":{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}},"isStacked":false,"width":618,"height":389},"state":{},"view":{"columns":[{"calc":"stringify","type":"string","sourceColumn":0},1,2,3,4,5,6,7,8,9,10]},"chartType":"ColumnChart","chartName":"Chart 4"} </script>
</figure>

The chart above shows how all of the A-grade browsers measure up. With the inclusion of IE7, the A-grade browsers above cover nearly 95% of browsers. I consider an A-grade browser to be the browsers that you'll promise a client that you'll test against. For my money, the most obvious choices are browsers that real people are using. It's sensible to ignore browsers with a negligible market share (less than 1%) and once a browser drops below 5%, it should be marked for removal. It's usually really obvious where to draw the line.

Here's what i've been giving my clients:

- IE9, IE8, IE7
  - consider dropping IE7
- Chrome Latest
- Firefox Latest
- Safari Latest
- Mobile
  - iPad (latest iOS)
  - iPhone (latest iOS)
  - Android (latest OS, 2.3)

With the exception of IE7/8 (and Safari), every other browser in the list is trending upwards. While Safari is staying relatively stagnant, IE8 has been declining rapidly. Since December, it has lost an average of 2% market share every month. It seems to have leveled off temporarily but it would be reasonable to expect IE8 to drop to around 5% in the next 12 months.

Yahoo! keeps an updated [Graded Browser Support](http://yuilibrary.com/yui/docs/tutorials/gbs/) document that lists the browsers that YUI supports. It's a good starting point for any solid testing strategy. [jQuery Mobile also keeps a <abbr title="Graded Browser Support">GBS</abbr>](http://jquerymobile.com/gbs/), but I would advise against relying on this mobile-oriented GBS unless you're on a mobile-only project.

{% h3 Consider Dropping IE7; Picking Up iOS, Android %}
Now is the time to start dropping IE7. It's below 2% nationally and it's continuing to fall. Meanwhile, iPhone, iPad and Android have gained enough market share to start trending as top-shelf browsers. 

Already, these mobile browsers are outperforming desktop browsers like Opera, and IE6/7. This is significant because the other mobile browsers, like Blackberry at 0.33%, have abysmal market share in the US. Even Opera Mobile, which has a [good worldwide market share](http://gs.statcounter.com/#mobile_browser-ww-monthly-201106-201206), has only a 0.16% market share in the US when compared against all browsers.

A safe rule is that any browser under 2% is on its way out, and any browser under 1% is too small to focus on. The amount of developer effort doesn't match the size of the audience. And usually the less popular browsers have enough in common with the A-grade browsers that users will still be able to use the site (although that's not the case for IE6). In essence, these platforms can be safely ignored.

However, iPad, iPhone and Android are fully capable browsers on fully capable devices. Now is the time to start testing each of these platforms as A-Grade browsers.

{% h3 Dropping Legacy IE Altogether %}
As I mentioned in the intro, [jQuery has announced](http://blog.jquery.com/2012/07/01/jquery-1-9-and-2-0-tldr-edition/) that the next major release of jQuery will come in two flavors &mdash; one flavor will drop legacy IE altogether. For most people this is a non-starter, and jQuery knows better than to leave regular folks out in the cold &mdash; the other flavor supports IE6/7/8. However, the jQuery is likely reading the same tea-leaves that I am and can see that by the time they release their next major versions (early 2013), IE7 will like be approaching the 1% threshold.

Between now and 2013 there's some major things happening. First, there'll be a <a href="http://www.electoral-vote.com/">presidential election</a>. Second, [Windows 8 will be shipping](http://windowsteamblog.com/windows/b/bloggingwindows/archive/2012/07/02/upgrade-to-windows-8-pro-for-39-99.aspx). And Windows 8 will ship with IE 10 pre-installed. Windows 7 users are also likely to get IE 10 as an automatic update. This will make 2013 another exciting transition year for IE, where users of legacy XP and Vista computers upgrade to the new OS, and IE10.

The jQuery team is claiming that the first pure "legacy free" version of jQuery won't really arrive until 2014. By that time, assuming Microsoft's marketing team can sell enough $40 copies of Windows 8, IE8 should be approaching the magic 1% threshold, and sailing out of our collective memories forever.

{% h2 Conclusion; Predictions %}
<figure>
<script type="text/javascript" src="//ajax.googleapis.com/ajax/static/modules/gviz/1.0/chart.js"> {"dataSourceUrl":"//docs.google.com/spreadsheet/tq?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&transpose=1&headers=1&merge=ROWS&range=A1%3AN4%2CA6%3AN6%2CA8%3AN9%2CA23%3AN24%2CA20%3AN20&gid=0&pub=1","options":{"vAxes":[{"useFormatFromData":false,"minorGridlines":{"count":"0"},"formatOptions":{"source":"inline","prefix":"","suffix":"%"},"viewWindowMode":"pretty","format":"0.##'%'","viewWindow":{}},{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}],"series":{"1":{"color":"#3c78d8"},"2":{"color":"#6fa8dc"},"3":{"color":"#ff9900"},"4":{"color":"#109618"},"5":{"color":"#990099"},"6":{"color":"#8e7cc3"},"7":{"color":"#0099c6"},"8":{"color":"#dd4477"}},"curveType":"","booleanRole":"certainty","title":"A-Grade Browser's Market Share, July 2011 - June 2012","height":389,"animation":{"duration":0},"width":618,"lineWidth":2,"hAxis":{"useFormatFromData":true,"viewWindowMode":"pretty","viewWindow":{}}},"state":{},"chartType":"LineChart","chartName":"Chart 2"} </script>
</figure>
The above data shows a few exciting things. First, the majority of the A-grade browsers are modern browsers with good HTML5/CSS3 support. Second, the only browsers showing an overall decline are the legacy browsers. The only legacy browsers on the list are IE8, which is in rapid decline, and IE7, which is nearly dead.

Second, Mobile browsers have arrived and are no longer easy to ignore. While the national data shows mobile at nearly 13%, I've seen Google Analytics for clients with mobile usage approaching 30%!

{% h3 Predictions %}
- IE7 will drop well below 1% in the next 12 months
- IE8 will drop well below 10% in the next 12 months
- IE9 will start beating Chrome relatively soon (next 3 months); Although IE10 will decimate IE9 once it comes out.
- Legacy Firefox will be well below 1% in the next 12 months
- Combined, mobile will cross 15% really soon

{% h2 About the Data %}
The above stats are culled from the [StatCounter Global Stats](http://gs.statcounter.com/#browser_version_partially_combined-US-monthly-201106-201206). Their data isn't perfect ([read the FAQ](http://gs.statcounter.com/faq)), but it's a good starting point for understanding the current browser landscape. Ultimately, your own Google Analytics data should be used for analyzing the right browsers to test for your site.

{% h3 Choosing a Region %}
All of the stats above are for the United States region. Many [articles using StatCounter stats](http://www.sitepoint.com/browser-trends-july-2012/) use the worldwide stats but those can be very misleading. For instance, [Europe](http://gs.statcounter.com/#browser_version_partially_combined-eu-monthly-201206-201206-bar) is very different from [Africa](http://gs.statcounter.com/#browser_version_partially_combined-af-monthly-201206-201206-bar), which is very different from [Asia](http://gs.statcounter.com/#browser_version_partially_combined-as-monthly-201206-201206-bar), and so on.

The whole point of browser stats is to gain insight into what browsers your site's visitors are using. To that end, most site's visitors overwhelming coming from a specific region. Mixing all of them together as "worldwide" isn't actually useful for any specific project. Even if you have a global site, you usually have a dedicated team for each region.

I live in the US and the majority of the sites I work on are for a US audience. If you live somewhere else, you can easily pull the data from StatCounter for your country.

{% h3 Combining Desktop and Mobile %}
I've combined the desktop and the mobile data into one chart. The resulting [spreadsheet has been published](https://docs.google.com/spreadsheet/pub?key=0Ajlnzthl1cAzdDdYM3VQUG5CTjVqdy1OVEkxLU4tZWc&output=html) so that you can see the raw data. StatCounter keeps mobile and desktop browsers separate, so combining them means multiplying the percentages by the [Mobile vs. Desktop](http://gs.statcounter.com/#mobile_vs_desktop-US-monthly-201106-201206) ratios. Because of this, the values shown above will differ slightly from the [Partially Combined Browser Versions](http://gs.statcounter.com/#browser_version_partially_combined-US-monthly-201106-201206) on the StatCounter site.

{% h3 Combining Browser Versions %}
All versions of Chrome are combined into a single stat because that browser auto-updates, and the differences between versions are negligible. The same is true of Firefox 4+, Safari and Opera. All of these browsers have aggressive updating policies and the differences between the versions is largely irrelevant because the majority of users upgrade their browsers quickly.

The different versions of IE are called out separately because of the significant differences between each release. IE also lacks a comprehensive updating policy, which means older browsers keep their market share for much longer.

Older versions of Firefox (below version 4) are also lumped together. Although those versions lacked an aggressive auto update feature, legacy Firefox are too noisy to call out separately. It's more interesting to track Firefox as before and after Firefox 4, because that's when Firefox started releasing new versions similarly to Chrome.

{% h3 Combining iPhone and iPod Touch %}
To the best of my knowledge these devices are extremely similar and, as far as the browser is concerned, they are identical devices. For the purposes of browser market share, these two devices should be combined.