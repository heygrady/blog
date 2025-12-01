import { readFile } from 'fs/promises'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

import { Linter, ESLint } from 'eslint'

import type { FlatConfig } from './config-helpers.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const fixturesDir = resolve(__dirname, '../fixtures')

/**
 * Result from linting code
 */
export interface LintResult {
  messages: Linter.LintMessage[]
  errorCount: number
  warningCount: number
  fixableErrorCount: number
  fixableWarningCount: number
}

/**
 * Lint code string using ESLint's Linter class (fast, no I/O)
 * Note: This doesn't support plugins that require file system access
 * @param config
 * @param code
 * @param filename
 */
export function lintCodeWithLinter(
  config: FlatConfig,
  code: string,
  filename: string
): LintResult {
  const linter = new Linter({ configType: 'flat' })
  const messages = linter.verify(code, config, { filename })

  return {
    messages,
    errorCount: messages.filter((m) => m.severity === 2).length,
    warningCount: messages.filter((m) => m.severity === 1).length,
    fixableErrorCount: messages.filter((m) => m.severity === 2 && m.fix).length,
    fixableWarningCount: messages.filter((m) => m.severity === 1 && m.fix)
      .length,
  }
}

/**
 * Lint code string using ESLint class (full support for plugins)
 * @param config
 * @param code
 * @param filename
 */
export async function lintCode(
  config: FlatConfig,
  code: string,
  filename: string
): Promise<ESLint.LintResult[]> {
  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
    // Don't use the project's actual config
    ignore: false,
  })

  return eslint.lintText(code, { filePath: filename })
}

/**
 * Lint a fixture file using ESLint class
 * @param config
 * @param fixturePath
 */
export async function lintFixture(
  config: FlatConfig,
  fixturePath: string
): Promise<ESLint.LintResult[]> {
  const fullPath = resolve(fixturesDir, fixturePath)
  const code = await readFile(fullPath, 'utf-8')

  const eslint = new ESLint({
    overrideConfigFile: true,
    overrideConfig: config,
    ignore: false,
    cwd: dirname(fullPath),
  })

  return eslint.lintText(code, { filePath: fullPath })
}

/**
 * Lint multiple fixture files
 * @param config
 * @param fixturePaths
 */
export async function lintFixtures(
  config: FlatConfig,
  fixturePaths: string[]
): Promise<ESLint.LintResult[]> {
  const results: ESLint.LintResult[] = []

  for (const fixturePath of fixturePaths) {
    const result = await lintFixture(config, fixturePath)
    results.push(...result)
  }

  return results
}

/**
 * Assert that lint results have no errors
 * @param results
 */
export function expectNoErrors(results: ESLint.LintResult[]): void {
  const errors = results.flatMap((r) =>
    r.messages.filter((m) => m.severity === 2)
  )

  if (errors.length > 0) {
    const errorMessages = errors
      .map((e) => `  ${e.ruleId}: ${e.message} (line ${e.line})`)
      .join('\n')
    throw new Error(
      `Expected no errors but found ${errors.length}:\n${errorMessages}`
    )
  }
}

/**
 * Assert that lint results have no errors or warnings
 * @param results
 */
export function expectClean(results: ESLint.LintResult[]): void {
  const messages = results.flatMap((r) => r.messages)

  if (messages.length > 0) {
    const messageStrings = messages
      .map(
        (m) =>
          `  [${m.severity === 2 ? 'error' : 'warn'}] ${m.ruleId}: ${m.message} (line ${m.line})`
      )
      .join('\n')
    throw new Error(
      `Expected no messages but found ${messages.length}:\n${messageStrings}`
    )
  }
}

/**
 * Assert that a specific rule triggered an error
 * @param results
 * @param ruleName
 */
export function expectError(
  results: ESLint.LintResult[],
  ruleName: string
): void {
  const errors = results.flatMap((r) =>
    r.messages.filter((m) => m.severity === 2 && m.ruleId === ruleName)
  )

  if (errors.length === 0) {
    const allRules = results
      .flatMap((r) => r.messages.map((m) => m.ruleId))
      .filter(Boolean)
    throw new Error(
      `Expected error from rule "${ruleName}" but got none. Rules that triggered: ${[...new Set(allRules)].join(', ') || 'none'}`
    )
  }
}

/**
 * Assert that a specific rule triggered a warning
 * @param results
 * @param ruleName
 */
export function expectWarning(
  results: ESLint.LintResult[],
  ruleName: string
): void {
  const warnings = results.flatMap((r) =>
    r.messages.filter((m) => m.severity === 1 && m.ruleId === ruleName)
  )

  if (warnings.length === 0) {
    const allRules = results
      .flatMap((r) => r.messages.map((m) => m.ruleId))
      .filter(Boolean)
    throw new Error(
      `Expected warning from rule "${ruleName}" but got none. Rules that triggered: ${[...new Set(allRules)].join(', ') || 'none'}`
    )
  }
}

/**
 * Assert that a specific rule did NOT trigger
 * @param results
 * @param ruleName
 */
export function expectNoRuleError(
  results: ESLint.LintResult[],
  ruleName: string
): void {
  const messages = results.flatMap((r) =>
    r.messages.filter((m) => m.ruleId === ruleName)
  )

  if (messages.length > 0) {
    throw new Error(
      `Expected no messages from rule "${ruleName}" but found ${messages.length}`
    )
  }
}

/**
 * Get all rule IDs that triggered in the results
 * @param results
 */
export function getTriggeredRules(results: ESLint.LintResult[]): string[] {
  const rules = new Set<string>()
  for (const result of results) {
    for (const message of result.messages) {
      if (message.ruleId) {
        rules.add(message.ruleId)
      }
    }
  }
  return [...rules].sort()
}

/**
 * Get total error and warning counts
 * @param results
 */
export function getCounts(results: ESLint.LintResult[]): {
  errorCount: number
  warningCount: number
} {
  return {
    errorCount: results.reduce((sum, r) => sum + r.errorCount, 0),
    warningCount: results.reduce((sum, r) => sum + r.warningCount, 0),
  }
}
