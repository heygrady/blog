# ESLint Plugins and Configurations

This document provides an overview of the ESLint plugins and configurations used in `@heygrady/eslint-config`.

## Core

- **[@eslint/js](https://github.com/eslint/eslint)**: ESLint's built-in JavaScript rules.
- **[@eslint/markdown](https://github.com/eslint/markdown)**: Lints code blocks in Markdown files.

## Configurations

These are base configurations that provide a set of rules.

- **[eslint-config-prettier](https://github.com/prettier/eslint-config-prettier)**: Turns off all rules that are unnecessary or might conflict with Prettier.

## Plugins

These plugins provide custom rules for specific technologies or purposes.

### TypeScript

- **[@typescript-eslint/eslint-plugin](https://github.com/typescript-eslint/typescript-eslint)**: Lints TypeScript code.
- **[@typescript-eslint/parser](https://github.com/typescript-eslint/typescript-eslint)**: TypeScript parser for ESLint.

### Import/Module Resolution

- **[eslint-plugin-import](https://github.com/import-js/eslint-plugin-import)**: Lints ES2015+ import/export syntax, prevents misspelling of file paths and import names.
- **[eslint-import-resolver-typescript](https://github.com/import-js/eslint-import-resolver-typescript)**: TypeScript resolver for eslint-plugin-import.
- **[eslint-plugin-n](https://github.com/eslint-community/eslint-plugin-n)**: Additional ESLint rules for Node.js (formerly `eslint-plugin-node`).

### React & JSX

- **[eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)**: React specific linting rules.
- **[eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)**: Enforces the Rules of Hooks.
- **[eslint-plugin-jsx-a11y](https://github.com/jsx-eslint/eslint-plugin-jsx-a11y)**: Accessibility rules for JSX elements.

### Astro

- **[eslint-plugin-astro](https://github.com/ota-meshi/eslint-plugin-astro)**: ESLint rules for Astro components.

### Testing

- **[eslint-plugin-jest](https://github.com/jest-community/eslint-plugin-jest)**: ESLint rules for Jest.
- **[eslint-plugin-jest-dom](https://github.com/testing-library/eslint-plugin-jest-dom)**: Rules for `@testing-library/jest-dom`.
- **[eslint-plugin-testing-library](https://github.com/testing-library/eslint-plugin-testing-library)**: ESLint rules for Testing Library.
- **[eslint-plugin-vitest](https://github.com/veritem/eslint-plugin-vitest)**: ESLint rules for Vitest.
- **[eslint-plugin-storybook](https://github.com/storybookjs/eslint-plugin-storybook)**: Best practices for Storybook.

### Code Quality

- **[eslint-plugin-eslint-comments](https://github.com/mysticatea/eslint-plugin-eslint-comments)**: Best practices for ESLint directive comments.
- **[eslint-plugin-jsdoc](https://github.com/gajus/eslint-plugin-jsdoc)**: JSDoc specific linting rules.
- **[eslint-plugin-promise](https://github.com/eslint-community/eslint-plugin-promise)**: Enforce best practices for JavaScript promises.
- **[eslint-plugin-compat](https://github.com/amilajack/eslint-plugin-compat)**: Lints for browser compatibility.

### Formatting & File Types

- **[eslint-plugin-prettier](https://github.com/prettier/eslint-plugin-prettier)**: Runs Prettier as an ESLint rule.
- **[eslint-plugin-json](https://github.com/azeemba/eslint-plugin-json)**: Lints JSON files.
