const path = require('path')

const { defaults } = require('jest-config')

const packageRoot = path.resolve(__dirname)

const jsExtensions = ['cjs', 'mjs', 'js', 'jsx']
const tsExtensions = ['cts', 'mts', 'ts', 'tsx']
const commonExtensions = [...jsExtensions, ...tsExtensions]

module.exports = {
  preset: 'ts-jest/presets/js-with-ts-esm',
  testEnvironment: 'node',
  resolver: 'ts-jest-resolver',
  extensionsToTreatAsEsm: commonExtensions
    .filter(
      (ext) => !ext.startsWith('c') && !ext.startsWith('m') && ext !== 'js'
    )
    .map((ext) => `.${ext}`),
  collectCoverageFrom: [
    `src/**/*.{${commonExtensions.join(',')}}`,
    '!**/*.d.{cts,mts,ts}',
  ],
  coverageDirectory: '<rootDir>/coverage/',
  coveragePathIgnorePatterns: [
    '<rootDir>/.turbo',
    '<rootDir>/coverage',
    '<rootDir>/dist',
    '<rootDir>/node_modules',
    '<rootDir>/.*?/__tests__/.*',
  ],
  coverageThreshold: {
    global: {
      branches: 75,
      functions: 75,
      lines: 75,
      statements: 75,
    },
  },
  moduleFileExtensions: [
    ...new Set([...defaults.moduleFileExtensions, ...commonExtensions]),
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': `${packageRoot}/__mocks__/fileMock.js`,
    '\\.module\\.(css|styl|less|sass|scss)$': 'identity-obj-proxy',
    '\\.(css|styl|less|sass|scss)$': `${packageRoot}/__mocks__/styleMock.js`,
  },
  testMatch: commonExtensions.map((ext) => `<rootDir>/test/**/*.spec.${ext}`),
  testPathIgnorePatterns: [
    '<rootDir>/.turbo',
    '<rootDir>/coverage',
    '<rootDir>/dist',
    // We don't want to ignore the node_modules folder
    // https://stackoverflow.com/a/70416132/11506025
    // '<rootDir>/node_modules',
  ],
  testEnvironmentOptions: {
    url: 'https://localhost',
  },
  transform: {
    '^.+\\.(c|m)?(t|j)sx?$': ['ts-jest', { useESM: true }],
  },
}
