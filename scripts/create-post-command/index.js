#!/usr/bin/env node

import { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

import { findRoot } from '@manypkg/find-root'
import { getPackages } from '@manypkg/get-packages'
import { cosmiconfig } from 'cosmiconfig'
import Handlebars from 'handlebars'
import { paramCase } from 'param-case'
import supportsColor from 'supports-color'
import yargs from 'yargs/yargs'
import 'zx/globals'

process.env.FORCE_COLOR = supportsColor.stdout.level

const __dirname = dirname(fileURLToPath(import.meta.url))

const createPostCommand = async () => {
  const root = await findRoot()
  const packages = await getPackages(root)
  const { config } = (await cosmiconfig('heygrady').search(root)) ?? {}
  if (!config) {
    throw new Error(
      'Please create a `heygrady.config.js` file in your repo root'
    )
  }

  const title = await question(
    'What is the title of your post? (use Title Case): '
  )
  const description = await question(
    'What is the description of your post? (use Sentence case.): '
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

export const argv = yargs(process.argv.slice(2)).command(
  '$0',
  'Create a new blog post',
  () => {},
  createPostCommand
).argv
