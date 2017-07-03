---
title: "Enable linting: eslint"
date: "2017-07-03T11:59:28"
readNext: "/fix-me/"
path: "/enable-linting/"
---

```bash
yarn add --dev babel-eslint \
  eslint \
  eslint-config-standard \
  eslint-config-standard-react \
  eslint-plugin-babel \
  eslint-plugin-import \
  eslint-plugin-node \
  eslint-plugin-promise \
  eslint-plugin-react \
  eslint-plugin-standard

yarn remove gh-pages
```

```json
{
  "scripts": {
    "test": "yarn lint && echo \"Warn: no test specified\" && exit 0"
  }
}
```
