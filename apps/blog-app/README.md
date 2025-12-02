# @heygrady/blog-app

The main Astro blog application for [heygrady.com](https://heygrady.com/).

## Features

- Built with [Astro](https://astro.build/) 5
- Markdown & MDX support for blog posts
- SEO-friendly with canonical URLs and OpenGraph data
- Sitemap and RSS feed support
- Image optimization with Sharp
- Deployed to Firebase Hosting

## Development

This package is part of a Yarn monorepo. Run commands from the monorepo root:

```bash
# Start the dev server (localhost:4321)
yarn start

# Build for production
yarn build

# Preview the production build
yarn workspace @heygrady/blog-app preview
```

## Project Structure

```
src/
├── components/     # Astro/React components
├── layouts/        # Page layouts
├── pages/
│   └── posts/      # Blog posts as Markdown files
└── styles/         # Global styles
public/             # Static assets
```

## Creating Posts

Blog posts are Markdown files in `src/pages/posts/` with date-prefixed filenames:

```
2023-07-28-my-post-title.md
```

Use the monorepo's create-post command to scaffold new posts:

```bash
yarn create-post
```

## Deployment

The blog is deployed to Firebase Hosting. Production deploys happen automatically when the "Version Packages" PR is merged to main.
