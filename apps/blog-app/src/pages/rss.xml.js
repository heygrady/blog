import rss from '@astrojs/rss'

import { SITE_TITLE, SITE_DESCRIPTION } from '../config.js'

export function GET(context) {
  const postModules = import.meta.glob('./posts/*.{md,mdx}', { eager: true })
  const posts = Object.values(postModules)

  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.frontmatter.title,
      pubDate: post.frontmatter.pubDate,
      description: post.frontmatter.description,
      link: post.url,
    })),
  })
}
