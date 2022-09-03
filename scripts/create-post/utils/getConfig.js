import { cosmiconfig } from 'cosmiconfig'
import { assert, object, string } from 'superstruct'

export const Config = object({
  // which package contains our app
  packageName: string(),

  // where do we store posts (relative to app package root)
  postsDir: string(),
})

export const getConfig = async (root) => {
  const { config } = (await cosmiconfig('heygrady').search(root)) ?? {}
  assert(config, Config)
  return config ?? null
}
