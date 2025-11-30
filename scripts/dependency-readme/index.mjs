#!/usr/bin/env node

import { exec } from 'child_process'
import { readFile, mkdir, writeFile } from 'fs/promises'
import path from 'path'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function fetchAndSaveReadme(depName, version) {
  const versionString = version || 'latest'
  console.log(`Fetching README for ${depName}@${versionString}...`)
  try {
    let { stdout: readme } = await execAsync(`npm view ${depName}@${versionString} readme`)

    if (!readme || readme.trim().length < 10) {
      console.log(`  🤔 README for ${depName}@${versionString} is blank. Trying GitHub...`)
      try {
        const { stdout: rawRepoUrl } = await execAsync(`npm view ${depName}@${versionString} repository.url`)
        const repoUrl = rawRepoUrl.trim() // Trim the repoUrl here
        const match = repoUrl.match(/github\.com[/:]([^/]+\/[^/]+?)(?:\.git|$)/)
        if (match) {
          const repo = match[1]
          try {
            const { stdout: githubReadme } = await execAsync(`curl -sL https://raw.githubusercontent.com/${repo}/main/README.md`)
            if (githubReadme && githubReadme.trim().length > 10) {
              readme = githubReadme
              console.log(`  ✅ Found README on GitHub (main branch)`)
            } else {
              throw new Error('README on main branch is blank or not found')
            }
          } catch (error) {
            const { stdout: githubReadme } = await execAsync(`curl -sL https://raw.githubusercontent.com/${repo}/master/README.md`)
            readme = githubReadme
            console.log(`  ✅ Found README on GitHub (master branch)`)
          }
        }
      } catch (error) {
        console.error(`  ❌ Failed to fetch README from GitHub for ${depName}@${versionString}: ${error.message}`)
      }
    }

    const outputDir = path.join('devlogs/dependencies', depName, versionString)
    await mkdir(outputDir, { recursive: true })
    await writeFile(path.join(outputDir, 'README.md'), readme)
    console.log(`  ✅ Saved README for ${depName}@${versionString}`)
  } catch (error) {
    console.error(`  ❌ Failed to fetch README for ${depName}@${versionString}: ${error.message}`)
  }
}

async function main() {
  const arg = process.argv[2]
  if (!arg) {
    console.error('Usage: node scripts/dependency-readme/index.mjs <workspace-package-name | package-name | package-name@version>')
    process.exit(1)
  }

  try {
    // Check if it's a workspace package
    const { stdout } = await execAsync(`yarn workspaces list --json`)
    const lines = stdout.trim().split('\n')
    const workspaceInfo = lines.map(line => JSON.parse(line))
    const workspace = workspaceInfo.find(ws => ws.name === arg)

    const promises = []

    if (workspace) {
      // It's a workspace package, process its dependencies
      const packagePath = workspace.location
      const pkg = JSON.parse(await readFile(path.join(packagePath, 'package.json'), 'utf-8'))
      const dependencies = {
        ...(pkg.dependencies || {}),
        ...(pkg.devDependencies || {}),
      }

      console.log(`Found ${Object.keys(dependencies).length} dependencies for ${arg}`)

      for (const [depName, depVersion] of Object.entries(dependencies)) {
        promises.push(fetchAndSaveReadme(depName, 'latest'))

        if (depVersion.startsWith('workspace:')) {
          console.log(`  ⏩ Skipping versioned README for workspace dependency ${depName}`)
          continue
        }
        const version = depVersion.replace(/[~^]/, '')
        promises.push(fetchAndSaveReadme(depName, version))
      }
    } else {
      // It's a direct package name
      let depName, depVersion
      const lastAt = arg.lastIndexOf('@')
      if (lastAt > 0) {
        depName = arg.substring(0, lastAt)
        depVersion = arg.substring(lastAt + 1)
      } else {
        depName = arg
        depVersion = null
      }

      promises.push(fetchAndSaveReadme(depName, 'latest'))
      if (depVersion) {
        promises.push(fetchAndSaveReadme(depName, depVersion))
      }
    }
    await Promise.all(promises)
  } catch (error) {
    console.error('An error occurred:', error)
    process.exit(1)
  }
}

main()
