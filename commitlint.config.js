module.exports = {
  extends: [
    '@commitlint/config-conventional',
    '@commitlint/config-workspace-scopes',
  ],
  ignores: [(commit) => commit.includes('Version Packages')],
  defaultIgnores: true,
}
