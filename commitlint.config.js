module.exports = {
  extends: ['@commitlint/config-conventional', '@commitlint/config-lerna-scopes'],
  ignores: [(commit) => commit.includes('Version Packages')],
  defaultIgnores: true,
}
