import { resolve } from 'node:path'

import { ESLint, type Linter } from 'eslint'

/**
 * ESLint flat config type (array of config objects)
 * Using a looser type to allow for plugin type variations
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FlatConfig = Linter.Config[] | any[]

/**
 * Normalized rule severity
 */
export type RuleSeverity = 'off' | 'warn' | 'error'

/**
 * Parser options with TypeScript-specific properties
 */
export interface TypeScriptParserOptions {
  project?: string | string[] | boolean | null
  projectService?: boolean | object
  tsconfigRootDir?: string
  ecmaVersion?: number | 'latest'
  sourceType?: 'module' | 'script' | 'commonjs'
  ecmaFeatures?: {
    jsx?: boolean
    globalReturn?: boolean
    impliedStrict?: boolean
  }
}

/**
 * Get the computed config for a file using ESLint's calculateConfigForFile
 * This is the official way to compute the effective config for a file.
 * @param config
 * @param filename
 */
export async function getConfigForFile(
  config: FlatConfig,
  filename: string
): Promise<Linter.Config> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
    ignore: false,
  })

  // Use absolute path for proper matching
  const absolutePath = filename.startsWith('/')
    ? filename
    : resolve(process.cwd(), filename)

  return eslint.calculateConfigForFile(absolutePath)
}

/**
 * Get rules from computed config for a file
 * @param config
 * @param filename
 */
export async function getRulesForFile(
  config: FlatConfig,
  filename: string
): Promise<Linter.RulesRecord> {
  const computedConfig = await getConfigForFile(config, filename)
  return (computedConfig.rules ?? {}) as Linter.RulesRecord
}

/**
 * Get plugins from computed config for a file
 * @param config
 * @param filename
 */
export async function getPluginsForFile(
  config: FlatConfig,
  filename: string
): Promise<Record<string, unknown>> {
  const computedConfig = await getConfigForFile(config, filename)
  return (computedConfig.plugins as Record<string, unknown>) ?? {}
}

/**
 * Get language options from computed config for a file
 * @param config
 * @param filename
 */
export async function getLanguageOptionsForFile(
  config: FlatConfig,
  filename: string
): Promise<Linter.LanguageOptions> {
  const computedConfig = await getConfigForFile(config, filename)
  return computedConfig.languageOptions ?? {}
}

/**
 * Get parser options from computed config for a file with TypeScript-specific types
 * @param config
 * @param filename
 */
export async function getParserOptionsForFile(
  config: FlatConfig,
  filename: string
): Promise<TypeScriptParserOptions> {
  const computedConfig = await getConfigForFile(config, filename)
  const langOptions = computedConfig.languageOptions as
    | Record<string, unknown>
    | undefined
  return (langOptions?.['parserOptions'] ?? {}) as TypeScriptParserOptions
}

/**
 * Get settings from computed config for a file
 * @param config
 * @param filename
 */
export async function getSettingsForFile(
  config: FlatConfig,
  filename: string
): Promise<Linter.Config['settings']> {
  const computedConfig = await getConfigForFile(config, filename)
  return computedConfig.settings ?? {}
}

/**
 * Check if a specific rule is defined for a file
 * @param config
 * @param filename
 * @param ruleName
 */
export async function hasRule(
  config: FlatConfig,
  filename: string,
  ruleName: string
): Promise<boolean> {
  const rules = await getRulesForFile(config, filename)
  return ruleName in rules
}

/**
 * Normalize rule severity to string form
 * @param value
 */
export function normalizeSeverity(
  value: Linter.RuleEntry | undefined
): RuleSeverity | undefined {
  if (value === undefined) return undefined

  const severity = Array.isArray(value) ? value[0] : value

  if (severity === 0 || severity === 'off') return 'off'
  if (severity === 1 || severity === 'warn') return 'warn'
  if (severity === 2 || severity === 'error') return 'error'

  return undefined
}

/**
 * Get the severity of a specific rule for a file
 * @param config
 * @param filename
 * @param ruleName
 */
export async function getRuleSeverity(
  config: FlatConfig,
  filename: string,
  ruleName: string
): Promise<RuleSeverity | undefined> {
  const rules = await getRulesForFile(config, filename)
  return normalizeSeverity(rules[ruleName])
}

/**
 * Get the full rule config (severity + options) for a specific rule
 * @param config
 * @param filename
 * @param ruleName
 */
export async function getRuleConfig(
  config: FlatConfig,
  filename: string,
  ruleName: string
): Promise<Linter.RuleEntry | undefined> {
  const rules = await getRulesForFile(config, filename)
  return rules[ruleName]
}

/**
 * Find all file patterns in the config (synchronous, for config inspection)
 * @param config
 */
export function getAllFilePatterns(config: FlatConfig): string[] {
  const patterns = new Set<string>()

  for (const cfg of config) {
    if (cfg.files) {
      for (const pattern of cfg.files) {
        if (Array.isArray(pattern)) {
          pattern.forEach((p) => patterns.add(p))
        } else {
          patterns.add(pattern)
        }
      }
    }
  }

  return [...patterns]
}

/**
 * Find all ignore patterns in the config (synchronous, for config inspection)
 * @param config
 */
export function getAllIgnorePatterns(config: FlatConfig): string[] {
  const patterns = new Set<string>()

  for (const cfg of config) {
    if (cfg.ignores) {
      cfg.ignores.forEach((p: string) => patterns.add(p))
    }
  }

  return [...patterns]
}

/**
 * Create a serializable version of an object (remove functions, etc.)
 * @param obj
 */
function serializableObject(obj: unknown): Record<string, unknown> {
  if (typeof obj !== 'object' || obj === null) return {}

  const result: Record<string, unknown> = {}
  for (const [key, value] of Object.entries(obj)) {
    if (typeof value === 'function') {
      result[key] = '[Function]'
    } else if (typeof value === 'object' && value !== null) {
      if (Array.isArray(value)) {
        result[key] = value.map((v) =>
          typeof v === 'function'
            ? '[Function]'
            : typeof v === 'object' && v !== null
              ? serializableObject(v)
              : v
        )
      } else {
        result[key] = serializableObject(value)
      }
    } else {
      result[key] = value
    }
  }
  return result
}

/**
 * Get a summary of the computed config for snapshot testing
 * Uses ESLint's calculateConfigForFile for accurate results
 * @param config
 * @param filename
 */
export async function getConfigSummary(
  config: FlatConfig,
  filename: string
): Promise<{
  plugins: string[]
  parser: string | undefined
  parserOptions: Record<string, unknown>
  globals: string[]
  settings: Record<string, unknown>
  rules: Record<string, RuleSeverity | [RuleSeverity, ...unknown[]]>
}> {
  const computedConfig = await getConfigForFile(config, filename)

  // Extract plugin names
  const plugins = computedConfig.plugins
    ? Object.keys(computedConfig.plugins as Record<string, unknown>).sort()
    : []

  // Extract parser name
  let parser: string | undefined
  const langOptions = computedConfig.languageOptions as
    | Record<string, unknown>
    | undefined
  if (langOptions?.['parser']) {
    const p = langOptions['parser']
    parser =
      typeof p === 'object' && p !== null && 'meta' in p
        ? (p as { meta?: { name?: string } }).meta?.name
        : 'unknown'
  }

  // Extract parser options
  const parserOptions = langOptions?.['parserOptions']
    ? serializableObject(langOptions['parserOptions'])
    : {}

  // Extract globals
  const globals = langOptions?.['globals']
    ? Object.keys(langOptions['globals'] as Record<string, unknown>).sort()
    : []

  // Extract settings
  const settings = computedConfig.settings
    ? serializableObject(computedConfig.settings)
    : {}

  // Extract rules with normalized severity
  const rules: Record<string, RuleSeverity | [RuleSeverity, ...unknown[]]> = {}
  if (computedConfig.rules) {
    for (const [ruleName, ruleValue] of Object.entries(computedConfig.rules)) {
      if (ruleValue === undefined) continue
      const severity = normalizeSeverity(ruleValue)
      if (severity === undefined) continue

      if (Array.isArray(ruleValue) && ruleValue.length > 1) {
        rules[ruleName] = [severity, ...ruleValue.slice(1)]
      } else {
        rules[ruleName] = severity
      }
    }
  }

  return {
    plugins,
    parser,
    parserOptions,
    globals,
    settings,
    rules,
  }
}
