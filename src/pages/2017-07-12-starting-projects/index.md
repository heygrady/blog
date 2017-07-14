---
title: "Starting projects"
description: "I found myself needing to create lots of packages. I captured my notes for getting started on a new web package and getting it ready to publish to NPM."
date: "2017-07-12T18:18:31Z"
readNext: "/fix-me/"
path: "/starting-projects/"
---
Becoming a better developer means trying out new things, but starting new things is painful. There's a lot of boilerplate configuration to learn (and it always seems to change). I've been trying to lower my personal barriers to starting new projects by practicing *getting started*. A prolific developer has a mastered this important step.

I recently [started a new blog](/new-blog/) because I wanted be able to practice the art of publishing often. I've already configured my blog to [deploy every time I push to Github](/deploying-travis/). Now I can easily write something down and publish it!

This *always be publishing* mentality is vital for the node community, because node developers prefer [many small packages](https://www.wired.com/2015/04/npm-funding/). Although, sometimes this can [cause hassles](https://www.theregister.co.uk/2016/03/23/npm_left_pad_chaos/). In a very real sense, programming is the art of finding the best way to solve a problem and *writing it down*.

The hassle of setting up and maintaining boilerplate configuration code is why [many](https://github.com/facebookincubator/create-react-app/tree/master/packages) [maintainers](https://github.com/mozilla-neutrino/neutrino-dev/tree/master/packages) have decided to create [monorepos](https://staltz.com/setting-up-a-javascript-monorepo.html), where many packages live side-by-side and share boilerplate code for testing and building and documentation.

Here I'm going to outline getting started on a new web package.

## Thinking small

There is a reason that the Node community encourages creating *small, focused* packages. Choosing small projects that can be completed quickly is a great way to build a personal learning momentum. If you can get the code finished in a few days then you can afford lavish amenities like documentation and tests.

The downside of many small packages is that you have to start lots of projects. Node doesn't come with a standard CLI beyond npm / yarn ([why yarn?](https://circleci.com/blog/why-are-developers-moving-to-yarn/)), so it's hard to know exactly where to start. Even if you're just creating a simple Node package, the process of publishing a package requires boilerplate configuration. With the addition of Babel and Webpack it can feel like it's taking *too long* to get going.

As a JavaScript enthusiast, I'm almost always starting new Node-based projects. Node is a perfect environment for react-redux (web application) development. Because I primarily do frontend development, I'm typically starting projects with the [react-redux-starter-kit](https://github.com/davezuko/react-redux-starter-kit) ([create-react-app](https://github.com/facebookincubator/create-react-app) is also very popular). Using a starter kit allows you to quickly bootstrap a new app with sensible defaults -- I'll probably write about that in a future post.

I find myself needing to create packages to reuse code across react-redux projects. These packages aren't web *apps*... they're web *packages*. I'm defining *web package* as, "an npm package that's intended to be imported into a (webpack / babel) web application." Below are the steps I take to start a new web package from scratch.

Hopefully these notes will make it easier the next time I need to get started.

### A proper start
In this post I will be merging the configuration files from the [react-redux-starter-kit](https://github.com/davezuko/react-redux-sarter-kit) (a web application) and [redux](https://github.com/reactjs/redux) (a web package). I'm using files from the starter-kit because I like their use of [Standard JS](https://standardjs.com/). Plus, it's what I use to build my applications so I prefer a common "look and feel." I'm using files from redux because it is a really popular web package that has a broad audience -- so they likely have a solid setup.

**A boilerplate web package needs:**

- Source control -- github
- Lint -- eslint with standard
- Test -- jest
- Build -- babel, rollup
- Deploy -- npm, travis, github pages
- Docs -- gitbook
- Tooling -- npm / yarn scripts

## Starting from scratch

- **Create a new project folder and navigate to it.** I keep everything in a `Projects` folder. Be sure to change "new-project" to the package name you intend to use.

  ```bash
  cd ~/Projects/heygrady/
  mkdir new-project && \
  cd new-project
  ```

- **Initialize a Git repo and `package.json`.** Publishing to NPM is covered briefly near the end of this post. I'll probably cover publishing more in depth in a future post.

  **Note:** Github Desktop is an easy way to [publish new repositories](https://guides.github.com/introduction/getting-your-project-on-github/) to Github. You can open your project with `github .` and publish it easily. (Of course, you should [learn git](https://www.learnenough.com/git-tutorial))

  **Note:** [Hub](https://hub.github.com/) is a git extension created by Github that makes it easier to work with Github over the command-line. You can [create](https://hub.github.com/hub.1.html) new Github projects using `hub` if you please.

  **Note:** You might like to set up your [yarn config](https://yarnpkg.com/en/docs/cli/config) to provide your own [init defaults](https://yarnpkg.com/lang/en/docs/cli/init/#toc-setting-defaults-for-yarn-init).

  ```bash
  # yarn will ask you a few questions
  git init && \
  yarn init

  # or if you know you want the defaults
  yarn init --yes

  # optional if you want to create a new github repo quickly (and add it to the GUI)
  github .

  # optional if you want to create it without a GUI
  hub create new-project
  ```

- **Open the project in your editor.** I like to open the project in Atom because I use the [terminal plugin](https://atom.io/packages/termination) when I work on projects. It's good to keep your terminal as close to your code as possible. Atom is a great editor for JavaScript because of the excellent [linting](https://medium.freecodecamp.org/how-to-set-up-eslint-in-atom-to-contribute-to-freecodecamp-3467dee86e2c) integration. (I'm not hip enough to [vim](https://www.codementor.io/mattgoldspink/best-text-editor-atom-sublime-vim-visual-studio-code-du10872i7).)

  ```bash
  atom .
  ```

  **Note:** The best thing about using the terminal from within atom is that it automatically navigates you to your project directory. This makes it "free" (in an emotional sense) to open the terminal and run some commands for your project (i.e. you don't have to switch contexts and navigate to your project). And there's no pain in closing the terminal -- you never lose your place. When you're building apps it's easier to see errors as you make them. If you `babel --watch` your code in the atom terminal you can see if you're breaking the build in real time.

- **Use a standard directory structure.** Redux places build-related files in a `build` folder. Redux calls it's "test" folder `test` while the react-redux-starter-it calls it `tests` (use your favorite).

  ```bash
  mkdir build && \
  mkdir docs && \
  mkdir src && \
  mkdir test
  ```

- I usually create a `_fun` folder for keeping notes and stashing things I don't intend to commit.

  ```bash
  mkdir _fun
  ```

- **Ignore some standard files.** It's helpful to compare with examples from the starter-kit ([`.gitignore`](https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.gitignore)) and redux ([`.gitignore`](https://raw.githubusercontent.com/reactjs/redux/master/.gitignore)). Below is a merging of the two.

  If you want an idea of more things you could/should ignore, look at the default Github file for Node ([`.gitignore`](https://raw.githubusercontent.com/github/gitignore/master/Node.gitignore)) or compare to your favorite project's repo.

  ```bash
  echo '.DS_STORE
  *.log
  node_modules
  dist
  es
  lib
  coverage
  _book
  .yarn-cache
  _fun' >> .gitignore
  ```

- **Add some useful scripts to `package.json`.** [NPM is the perfect build tool](https://www.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/). Keeping commonly used scripts in the `package.json` provides some built-in documentation on how to work with your project. This is good for you because it means you can leave a project and come back to it later and not have to look up how to "boot it up."

It's nice to come into a project, type `yarn dev`, and have the dev environment stand itself up. It's useful to compare the scripts included with the starter-kit ([`package.json`](https://github.com/davezuko/react-redux-starter-kit/blob/master/package.json#L6)) and redux  ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L16)) or your favorite project.

  ```json
  {
    "scripts": {
      "clean": "rimraf lib dist es coverage",
      "dev": "cross-env NODE_ENV=development yarn start",
      "start": "echo 'Error: no start script' && exit 1",
      "start:prod": "cross-env NODE_ENV=production yarn start",
      "lint": "eslint src test build",
      "lint:fix": "yarn lint -- --fix",
      "test": "cross-env BABEL_ENV=commonjs jest",
      "test:watch": "npm test -- --watch",
      "test:cov": "npm test -- --coverage",
      "build": "echo 'Error: no build script' && exit 1",
      "deploy": "yarn lint && yarn test && yarn build:prod && echo 'Error: no deploy script' && exit 1"
    }
  }
  ```

  **Note:** We will update / replace some of these boilerplate scripts as we configure our project further down. The scripts above should be a good starting place for most JavaScript projects, even if you're not planning to use babel.

- **Add the relevant dev dependencies.** Pretty much every JavaScript project will need at least these dependencies.

  ```bash
  yarn add --dev \
  rimraf \
  cross-env \
  eslint \
  jest
  ```

  **Note:** We're using jest (like redux) in place of karma / mocha / chai (like the starter-kit) because jest is objectively simpler. If you want to, you can try to copy the testing setup from the starter-kit ([`package.json`](https://github.com/davezuko/react-redux-starter-kit/blob/master/package.json#L11)).

- **Add an [editor config](http://editorconfig.org/)** ([atom plugin](https://atom.io/packages/editorconfig)). I like to use the one that comes with react-redux-starter-kit ([`.editorconfig`](https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.editorconfig)), compare with redux ([`.editorconfig`](https://github.com/reactjs/redux/blob/master/.editorconfig)). This can help with some bikeshedding issues and works across most text editors.

  ```bash
  wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.editorconfig
  ```

  **Note:** You might need to [install `wget`](https://stackoverflow.com/questions/33886917/how-to-install-wget-in-macos-capitan-sierra/33902055) (or use [`curl`](https://daniel.haxx.se/docs/curl-vs-wget.html) [like this](http://www.thegeekstuff.com/2012/07/wget-curl)).

## Configure ES Lint

Every project needs to be linted. Using linters can smooth over bikeshedding issues -- there are *oh so many ways* to write JavaScript -- and prevent common errors and typos. Everyone [uses eslint now](https://www.smashingmagazine.com/2015/09/eslint-the-next-generation-javascript-linter/) but there are some basic boilerplate issues that come up. I like to follow the [standard](https://github.com/standard/eslint-config-standard) linting guidelines that come with the starter-kit.

### Create boilerplate eslint files
I typically borrow these files from the react-redux-starter-kit ([`.eslintignore`](https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintignore) and [`.eslintrc`](https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintrc)), compare with redux ([`.eslintignore`](https://github.com/reactjs/redux/blob/master/.eslintignore) and [`.eslintrc`](https://github.com/reactjs/redux/blob/master/.eslintrc)).

We can grab them with wget and customize to our needs:

```bash
# remember to merge the .eslintrc with redux
wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintignore && \
wget https://raw.githubusercontent.com/davezuko/react-redux-starter-kit/master/.eslintrc && \
echo '_fun/**' >> .eslintignore
```

Or we can create the files by echoing in the content we need. **Note:** I have merged the `.eslintignore` and `.eslintrc` below with redux already.

```bash
echo '
dist/**
node_modules/**
src/index.html
flow-typed/**
_fun/**' >> .eslintignore
```

```bash
echo '{
  "extends": [
    "react-app",
    "standard",
    "standard-react"
  ],
  "plugins": [],
  "globals": {
    "__DEV__"      : false,
    "__TEST__"     : false,
    "__PROD__"     : false,
    "__COVERAGE__" : false
  },
  "rules": {
    "key-spacing"          : "off",
    "jsx-quotes"           : [2, "prefer-single"],
    "max-len"              : [2, 120, 2],
    "object-curly-spacing" : [2, "always"],
    "comma-dangle"         : "off"
  }
}' >> .eslintrc
```

### Install eslint dev dependencies
The packages below are merged from the starter-kit and redux. Redux is using the [eslint-config-react-app](https://github.com/facebookincubator/create-react-app/tree/master/packages/eslint-config-react-app) package from [create-react-app](https://github.com/facebookincubator/create-react-app).

If you are having trouble, try copying the eslint packages with their versions from the starter-kit ([`package.json`](https://github.com/davezuko/react-redux-starter-kit/blob/master/package.json#L59-L67)) and redux ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L96-L101)).

```bash
yarn add --dev \
babel-eslint \
eslint \
eslint-config-react-app \
eslint-config-standard \
eslint-config-standard-react \
eslint-plugin-babel \
eslint-plugin-flowtype \
eslint-plugin-import \
eslint-plugin-node \
eslint-plugin-promise \
eslint-plugin-jsx-a11y \
eslint-plugin-react \
eslint-plugin-standard
```

**Note:** I had to downgrade `eslint-plugin-jsx-a11y` (`yarn upgrade eslint-plugin-jsx-a11y@^5.0.3`) because of [an issue](https://github.com/facebookincubator/create-react-app/pull/2690).

**Note:** I had to downgrade `eslint` (`yarn upgrade eslint@~4.1.1`) because of [a different issue](https://github.com/eslint/eslint/issues/8908)

## Configure babel
Above we're grabbing some configuration files from the react-redux-starter-kit, which is for building web applications. We want to build a web package (like redux). So we need to borrow our build environment from somewhere else, namely redux.

### Create babel boilerplate files
It easiest to just grab the [`.babelrc`](https://raw.githubusercontent.com/reactjs/redux/master/.babelrc) directly from redux.

```bash
wget https://raw.githubusercontent.com/reactjs/redux/master/.babelrc
```

Or you can output it manually. Below is a copy of the redux `.babelrc` at the time of this writing.

```bash
echo '{
  "plugins": [
    ["transform-es2015-template-literals", { "loose": true }],
    "transform-es2015-literals",
    "transform-es2015-function-name",
    "transform-es2015-arrow-functions",
    "transform-es2015-block-scoped-functions",
    ["transform-es2015-classes", { "loose": true }],
    "transform-es2015-object-super",
    "transform-es2015-shorthand-properties",
    ["transform-es2015-computed-properties", { "loose": true }],
    ["transform-es2015-for-of", { "loose": true }],
    "transform-es2015-sticky-regex",
    "transform-es2015-unicode-regex",
    "check-es2015-constants",
    ["transform-es2015-spread", { "loose": true }],
    "transform-es2015-parameters",
    ["transform-es2015-destructuring", { "loose": true }],
    "transform-es2015-block-scoping",
    "transform-object-rest-spread",
    "transform-es3-member-expression-literals",
    "transform-es3-property-literals"
  ],
  "env": {
    "commonjs": {
      "plugins": [
        ["transform-es2015-modules-commonjs", { "loose": true }]
      ]
    },
    "es": {
      "plugins": [
        "./build/use-lodash-es"
      ]
    }
  }
}' >> .babelrc
```

### Borrow custom lodash babel plugin
Redux uses a custom babel plugin for swapping references for lodash to lodash-es. This helps with tree shaking and can reduce the file-size penalty for relying on lodash in your project. We need to grab that custom plugin ([`use-lodash-es.js`](https://raw.githubusercontent.com/reactjs/redux/master/build/use-lodash-es.js)) manually, since it's not available as an NPM package.

**Note:** This could be seen as an implicit endorsement of [lodash](https://lodash.com/) by the maintainers of redux. If you don't intend to use lodash, you can skip this step and remove references to this plugin above.

```bash
wget -P build/ https://raw.githubusercontent.com/reactjs/redux/master/build/use-lodash-es.js
```

Or you can create the file manually. Below is a copy of the redux `use-lodash-es.js` plugin at the time of this writing.

```bash
echo "module.exports = function () {
  return {
    visitor: {
      ImportDeclaration (path) {
        const source = path.node.source
        source.value = source.value.replace(/^lodash($|\/)/, 'lodash-es$1')
      }
    }
  }
}" >> build/use-lodash-es.js
```

### Install babel dev dependencies
The packages below are from redux. **Note:** The babel dependencies that redux specifies are somewhat different from the starter-kit ([`package.json`](https://github.com/davezuko/react-redux-starter-kit/blob/master/package.json#L39-L48)).

If you are having trouble, try copying the babel packages with their versions from redux ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L69-L94)).

```bash
yarn add --dev \
babel-cli \
babel-core \
babel-eslint \
babel-jest \
babel-plugin-check-es2015-constants \
babel-plugin-transform-es2015-arrow-functions \
babel-plugin-transform-es2015-block-scoped-functions \
babel-plugin-transform-es2015-block-scoping \
babel-plugin-transform-es2015-classes \
babel-plugin-transform-es2015-computed-properties \
babel-plugin-transform-es2015-destructuring \
babel-plugin-transform-es2015-for-of \
babel-plugin-transform-es2015-function-name \
babel-plugin-transform-es2015-literals \
babel-plugin-transform-es2015-modules-commonjs \
babel-plugin-transform-es2015-object-super \
babel-plugin-transform-es2015-parameters \
babel-plugin-transform-es2015-shorthand-properties \
babel-plugin-transform-es2015-spread \
babel-plugin-transform-es2015-sticky-regex \
babel-plugin-transform-es2015-template-literals \
babel-plugin-transform-es2015-unicode-regex \
babel-plugin-transform-es3-member-expression-literals \
babel-plugin-transform-es3-property-literals \
babel-plugin-transform-object-rest-spread \
babel-register
```

### Add in some build scripts
Redux comes with a bunch of scripts ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L22-L26)) for building a project.

I like to add a `dev` script to projects so that I can easily build the project as I work. As you can see below, the `dev` script simply executes the `build:commonjs` script with the [`--watch`](https://babeljs.io/docs/usage/cli/#babel-compile-files) option. This creates a new build every time a `src` file is saved.

Building the commonjs version as you go is particularly useful if you are [linking your package locally](http://justjs.com/posts/npm-link-developing-your-own-npm-modules-without-tears). This allows you to test the unpublished package in another local project (like an example repo).

**Note:** If you are doing this, you need to import the `lib` folder in your other project like this:

```js
// ensure that you are importing the lib, not the dist
import Whatever from 'new-project/lib'
```

You can see below that `build:umd` and `build:umd:min` are using [rollup](https://github.com/rollup/rollup). Rollup ([explaination](https://medium.com/webpack/webpack-and-rollup-the-same-but-different-a41ad427058c)) has become the defacto build tool for creating Node packages based on Babel.

```json
{
  "config": {
    "name": "new-project"
  },
  "scripts": {
    "dev": "yarn build:commonjs -- --watch",
    "build:commonjs": "cross-env BABEL_ENV=commonjs babel src --out-dir lib",
    "build:es": "cross-env BABEL_ENV=es babel src --out-dir es",
    "build:umd": "cross-env BABEL_ENV=es NODE_ENV=development rollup -c -i src/index.js -o dist/$npm_package_config_name.js",
    "build:umd:min": "cross-env BABEL_ENV=es NODE_ENV=production rollup -c -i src/index.js -o dist/$npm_package_config_name.min.js",
    "build": "npm run build:commonjs && npm run build:es && npm run build:umd && npm run build:umd:min",
  }
}
```

**Note:** You need to change the `name` in the config to match your project name. This [config](https://docs.npmjs.com/files/package.json#config) variable ([example usage](https://frontend.irish/npm-config-variables)) is used in `build:umd` and `build:umd:min` to name the package that goes in the `dist` folder. If you copied your scripts directly from redux, those values are hard-coded to "redux" (which isn't a good name for *your* package).

### Install rollup dev dependencies
As you can see above, some of the build scripts involve rollup. The packages below are from redux ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L106-L110)).

```bash
yarn add --dev \
rollup \
rollup-plugin-babel \
rollup-plugin-node-resolve \
rollup-plugin-replace \
rollup-plugin-uglify
```

### Create rollup boilerplate files
It's easiest to just grab the [`rollup.config.js`](https://raw.githubusercontent.com/reactjs/redux/master/rollup.config.js) directly from redux.

```bash
# remember to edit the moduleName
wget https://raw.githubusercontent.com/reactjs/redux/master/rollup.config.js
```

Or you can create the file manually. Below is a copy of the redux `rollup.config.js` plugin at the time of this writing.

**Note:** Remember to edit the [`moduleName`](https://github.com/rollup/rollup/wiki/JavaScript-API#modulename) to match your project.

```bash
echo "import nodeResolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import replace from 'rollup-plugin-replace';
import uglify from 'rollup-plugin-uglify';

var env = process.env.NODE_ENV
var config = {
  format: 'umd',
  moduleName: 'NewProject',
  plugins: [
    nodeResolve({
      jsnext: true
    }),
    babel({
      exclude: 'node_modules/**'
    }),
    replace({
      'process.env.NODE_ENV': JSON.stringify(env)
    })
  ]
}

if (env === 'production') {
  config.plugins.push(
    uglify({
      compress: {
        pure_getters: true,
        unsafe: true,
        unsafe_comps: true,
        warnings: false
      }
    })
  )
}

export default config" >> rollup.config.js
```

## Add your index file
We need to add an `index.js` file to test that our build scripts work. We also need to configure our `package.json` to link to the correct index file depending on the environment.

### Create `src/index.js` and `src/example.js`
We need to create some example files so we can test out that our build is working. Below are some simple examples that showcase esnext-style imports and exports.

```bash
echo "import anything, { whatever as somethingElse } from './example';
export { anything, somethingElse }
export const helloWorld = () => 'Hello world'
export default helloWorld" >> src/index.js && \
echo "export const whatever = () => 'Hello whatevers'
export default () => 'Hello default'" >> src/example.js
```

**Note:** There is a linting error included on purpose.

## Lint your code
We should be able to lint our code using the `package.json` script from above.

### Using `yarn lint`

```bash
yarn lint
```

I got an output that looked something like this:

```
yarn lint v0.24.5
$ eslint src test build

new-project/src/index.js
  1:64  error  Extra semicolon  semi

✖ 1 problem (1 error, 0 warnings)
  1 error, 0 warnings potentially fixable with the `--fix` option.

error Command failed with exit code 1.
```

### Using `yarn lint:fix`
Eslint comes with the ability to automatically [fix](http://eslint.org/docs/user-guide/command-line-interface#--fix) most linting errors. I like to enable to [eslint fix on save](https://github.com/AtomLinter/linter-eslint/pull/508) option in Atom.

```bash
yarn lint:fix
```

I got an output that looked something like this (and my linting error was indeed fixed):

```
yarn lint:fix v0.24.5
$ yarn lint -- --fix
yarn lint v0.24.5
$ eslint src test build --fix
✨  Done in 1.23s.
✨  Done in 1.58s.
```
## Test
Now that our code is properly linted, we need to make sure we can test it.

### Create `test/index.spec.js` and `test/example.spec.js`
We need to have some test scripts. Jest allows you to name your test files `*.spec.js` or `*.test.js`. Redux uses "spec" and so does the starter-kit. Use your favorite.

We're going to test that each function works and that everything is being properly exported. Note that in `index.spec.js` we are testing that the exported functions from `example.js` *are defined* but we're not testing the functions themselves. You shouldn't test the same thing twice.

```bash
echo "import defaultExport, { whatever } from '../src/example'

describe('Example', () => {
  describe('defaultExport', () => {
    it('returns \"Hello default\"', () => {
      expect(defaultExport()).toBe('Hello default')
    })
  })

  describe('whatever', () => {
    it('returns \"Hello whatever\"', () => {
      expect(whatever()).toBe('Hello whatever')
    })
  })
})" >> test/example.spec.js && \
echo "import defaultHelloWorld, { anything, somethingElse, helloWorld } from '../src'

describe('NewProject', () => {
  describe('defaultHelloWorld', () => {
    it('returns \"hello world\"', () => {
      expect(defaultHelloWorld()).toBe('Hello world')
    })
  })

  describe('helloWorld', () => {
    it('returns \"hello world\"', () => {
      expect(helloWorld()).toBe('Hello world')
    })
  })

  describe('anything', () => {
    it('is defined', () => {
      expect(anything).toBeDefined()
    })
  })

  describe('somethingElse', () => {
    it('is defined', () => {
      expect(somethingElse).toBeDefined()
    })
  })
})" >> test/index.spec.js
```

### Using `yarn test`
I have intentionally left an error in `src/example.js`. With our test files in place it should be pretty easy to find.

```bash
yarn test
```

I got an output that looked something like this:

```
yarn test v0.24.5
$ cross-env BABEL_ENV=commonjs jest
 PASS  test/index.spec.js
 FAIL  test/example.spec.js
  ● Example › whatever › returns "Hello whatever"

    expect(received).toBe(expected)

    Expected value to be (using ===):
      "Hello whatever"
    Received:
      "Hello whatevers"

      at Object.<anonymous> (test/example.spec.js:12:40)
          at Promise (<anonymous>)
      at Promise.resolve.then.el (node_modules/p-map/index.js:42:16)
          at <anonymous>

Test Suites: 1 failed, 1 passed, 2 total
Tests:       1 failed, 5 passed, 6 total
Snapshots:   0 total
Time:        1.123s
Ran all test suites.
error Command failed with exit code 1.
```

### Using `yarn test:watch`
Before we fix the test error, it's useful to explore the `test:watch` command, which will re-run the tests every time you update your code.

```bash
yarn test:watch
```

This will watch for changes. Now, if you make the required change to `src/example.js` you should see all tests passing.

### Using `yarn test:cov`
We should have complete test coverage of our code. Here's how we can test that.

```bash
yarn test:cov
```

#### Viewing the report
Jest will generate a report that you can view in a browser. If you want to you can install [`http-server`](https://www.npmjs.com/package/http-server) to host the report on localhost. This is often easier than trying to locate the file and open it in your preferred browser.

```bash
yarn add --dev http-server
```

Here's a script you can add to your `package.json` to generate the coverage report and server it on `http://localhost:8080`. You can change the port with the `-p` option, like: `http-server -c-1 -p1337`.

```json
{
  "scripts": {
    "test:cov:report": "yarn test:cov && cd coverage/lcov-report && http-server -c-1"
  }
}
```

## Build
Now that our code is linted and tested, we should be able to build it. By default, it will build for every environment.

### Using `yarn build`

```bash
yarn build
```

After the build has finished, you should have some files in the `dist`, `es` and `lib` folders.

- `dist` -- The UMD build, for when you want to include the file directly in your browser (instead of using webpack)
- `es` -- The esnext build, using esnext-style importing and exporting
- `lib` -- The commonjs build, where the babel build is output.
- `src` -- The raw source code before an transpiling has been done. This is the only version you should check into your repo.

There are specific scripts for each buuld target.

- `yarn build:commonjs` -- outputs to `lib`
- `yarn build:es` -- outputs to `es`
- `yarn build:umd` -- outputs to `dist/project-name.js`
- `yarn build:umd:min` -- outputs to `dist/project-name.min.js`

### Add `main`, `module`, `jsnext:main` and `files` to `package.json`
There is a [new proposal](https://github.com/dherman/defense-of-dot-js/blob/master/proposal.md#typical-usage) for working with packages (like ours) that make multiple builds of the code available. There's an additional proposal for [`jsnext:main`](https://github.com/jsforum/jsforum/issues/5). There is some active discussion on [how these should be used](https://github.com/webpack/webpack/issues/1979).

Replace the existing `main` in your `package.json` with the following, like redux ([`package.json`](https://github.com/reactjs/redux/blob/master/package.json#L5-L15)):

```json
{
  "main": "lib/index.js",
  "module": "es/index.js",
  "jsnext:main": "es/index.js",
  "files": [ "dist", "lib", "es", "src" ]
}
```

**Note:** I intentionally left off the `typings` field because I'm not configuring TypeScript right now.

### Add publishing scripts
We're going to be publishing our project using NPM and using Github to publicly host our code.

There are a number of things built in to yarn and npm that aid in publishing packages. The `deploy:version` script will run [`yarn version`](https://yarnpkg.com/en/docs/cli/version) (you might prefer [`npm version`](https://docs.npmjs.com/cli/version)). The `deploy` script will try to publish the package to NPM using [`npm publish`](https://docs.npmjs.com/cli/publish) (you might prefer [`yarn publish`](https://yarnpkg.com/en/docs/cli/publish)). **Note:** The publish step will automatically call [`prepare`](https://docs.npmjs.com/misc/scripts#prepublish-and-prepare).

```json
{
  "scripts": {
    "deploy": "npm publish",
    "deploy:version":"yarn version && yarn deploy",
    "deploy:patch":"npm version patch && yarn deploy",
    "prepare": "yarn run clean && yarn lint && yarn test && yarn build"
  }
}
```

### Using `yarn deploy`
The `deploy` script will publish our package to NPM. It automatically calls `prepare`, which will lint, test and build your code before publishing. If your build fails, you will need to fix your errors and attempt to deploy again.

```bash
# you should tag the version before deploying it
yarn version && \
yarn deploy

# or if you want to specify the next version
yarn deploy:version

# or if you want to simply bump the version before deploying
yarn deploy:patch
```

## Other `package.json` entries
Redux has a number of entries in its `package.json` that are not covered above.

**You might want to add some of these settings:**

```json
{
  "description": "Short description of this project",
  "typings": "./index.d.ts",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/newproject.git"
  },
  "bugs": {
    "url": "https://github.com/your-username/newproject/issues"
  },
  "homepage": "https://github.com/your-username/newproject",
  "npmName": "new-project",
  "npmFileMap": [
    {
      "basePath": "/dist/",
      "files": [
        "*.js"
      ]
    }
  ],
  "browserify": {
    "transform": [
      "loose-envify"
    ]
  },
  "jest": {
    "testRegex": "(/test/.*\\.spec.js)$"
  }
}
```

### Gitbook
I intentionally left off the Gitbook integration that redux includes because it would make this post too long. Project documentation may be covered in a future most.

### Other missing features
I intentionally skipped the steps for `README.md`, `docs` and publishing docs with Gitbook, travis / continuous integration, creating examples, and configuring TypeScript.

## Conclusion
There are a lot of steps for setting up a new web package project. Hopefully this makes someone's life a little easier. It's worth keeping an eye on [Neutrino](https://neutrino.js.org/), as it tries to make this type of configuration much simpler. Currently Neutrino doesn't cover [use cases like redux](https://github.com/mozilla-neutrino/neutrino-dev/issues/84#issuecomment-283513669) very well. It's also worth watching [create-react-app](https://github.com/facebookincubator/create-react-app), which tries to make it dead-simple to get up and running with webpack (it's similar to the starter-kit). Also, keep an eye on [`yarn create`](https://yarnpkg.com/lang/en/docs/cli/create/) which promises to [make it easy to create](https://yarnpkg.com/blog/2017/05/12/introducing-yarn/) package bootstraps.
