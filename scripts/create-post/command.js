import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { findRoot } from '@manypkg/find-root'
import { getPackages } from '@manypkg/get-packages'
import Handlebars from 'handlebars'
import { paramCase } from 'param-case'
import supportsColor from 'supports-color'
import 'zx/globals'

import { getConfig } from './utils/getConfig.js'

process.env.FORCE_COLOR = supportsColor.stdout.level

const __dirname = dirname(fileURLToPath(import.meta.url))

export const command = 'post'

export const desc = 'Create a new blog post'

export const builder = {}

export const handler = async () => {
  const root = await findRoot()
  const packages = await getPackages(root)
  const config = await getConfig(root)

  if (!config) {
    throw new Error(
      'Please create a `heygrady.config.js` file in your repo root'
    )
  }

  const title = await question('What is the title of your post? (Title Case): ')
  const description = await question(
    'What is the description of your post? (Sentence case.): '
  )

  const blogRoot = packages.packages
    .filter(({ packageJson }) => packageJson.name === config.packageName)
    .reduce((_, { dir }) => dir, '')

  const pubDate = new Date().toISOString()

  const postPath = path.join(
    blogRoot,
    config.postsDir,
    `${pubDate.split('T')[0]}-${paramCase(title)}.md`
  )

  const template = Handlebars.compile(
    (
      await fs.readFile(path.join(__dirname, 'templates', 'post.hbs'))
    ).toString()
  )

  const content = template({ title, description, pubDate })
  fs.writeFile(postPath, content)
}
