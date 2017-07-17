---
title: "Announcing fetch-actions"
description: "I am proud to announce the initial release of fetch-actions, a functional wrapper for fetch designed for integrating a remote API with a redux application."
date: "2017-07-17T11:12:18Z"
readNext: "/fix-me/"
path: "/announcing-fetch-actions/"
---

When I first started working with redux I was pretty confused about how to get data from the server. All over the redux literature they make a big deal about how [everything is *synchronous*](http://redux.js.org/docs/basics/DataFlow.html). Of course, you can't get data from the server without making *asyncronous* calls. Out of the box, redux leaves it up to the implementor to bridge the gap between your app and the server with [middleware](http://redux.js.org/docs/advanced/AsyncFlow.html).

Working with a server means working with an API and every API is a *little bit different*. It's no wonder that redux decided to steer clear of that mine field. In the past I've worked with kitchen sink frameworks like Angular and Ember that provide a full story about how to manage your API. [Ember Data](https://github.com/emberjs/data) provides the most complete API interface layer but it heavily favors the [JSONAPI specification](http://jsonapi.org/format/), which is [widely adopted](https://blog.codeship.com/building-a-json-api-with-rails-5/) in the Rails community but few [other places](http://jsonapi.org/implementations/#server-libraries). The react community has been toying with [relay and graphql](https://dev-blog.apollodata.com/exploring-relay-modern-276f5965f827), but there isn't yet a cohesive story for how a react-redux project should interface with an API.

If you're serving a graphql or a REST API, your redux application will need to communicate with the it using something like fetch. [Fetch-actions](https://github.com/heygrady/fetch-actions) hopes to provide a smooth interface between your redux application and fetch.

## Where does fetch-actions fit in?

Fetch-actions is designed to ease the integration of an API into your redux application. Specifically, fetch-actions provides a clean interface for your *middleware* to make fetch calls. Fetch-actions is called from within your middleware (**steps 4 thru 6 below**) to handle actions, make a fetch call (or *mock* a fetch call) and return transformed data.

If you are already working on a [react-redux](http://redux.js.org/docs/basics/UsageWithReact.html) app you are very familiar with the following pattern:

1. A user clicks a button in a `component`
2. This calls a function in a `container`, which will `dispatch` an `action`
3. At this point, a middleware function (perhaps a `saga`) is called
4. Within the middlware function, an asynchronous `fetch` call is made
5. The action needs to be turned into a [request](https://developer.mozilla.org/en-US/docs/Web/API/Request/Request)
6. The resulting JSON is transformed into the data your application expects
7. The middleware will `dispatch` the data, embedded in another `action`
8. This calls a `reducer`, which will update the application `state` with the data payload
9. Finally, the `component` updates with the new data

*Simple enough :)*

## How does fetch-actions work?
In the same way that redux is concerned with managing the application state (with actions and reducers), fetch-actions is concerned with managing the fetch *request lifecycle*. In the sequence above, the `fetch` call is far more complex than it seems. *One does not simply call fetch.*

Without fetch-actions, you will need to find a way to generate API queries from actions, transform the results, and dispatch the data into your app's reducers. This lifecycle can be cleanly separated into it's functional parts instead of embedding it within your middleware.

Let's dig into the process a little bit further to see how fetch-actions helps you manage your API calls.

1. Your `fecthAction` function (we'll create that below) receives an `action`, *probably from your middleware*
2. The action is used to create a [`request`](https://developer.mozilla.org/en-US/docs/Web/API/Request), using a `requestCreator` function
3. This request is passed into [`fetch`](https://developer.mozilla.org/en-US/docs/Web/API/WindowOrWorkerGlobalScope/fetch). **Note:** Optionally, you can intercept requests with a mock `responder` function
4. Fetch returns a promise which resolves to a [`response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)
4. Optionally, the `response` can be inspected (or altered / replaced) using a `responseHandler`
5. The [`response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json) method is called automatically for you
6. The `json` is fed into a `transformer` to normalize your data
7. Finally, the data is returned to your middleware

### The problem fetch-actions solves
In the same way that react-redux encourages you to move *state* out of your components, fetch-actions encourages you to remove *requests* and *transforms* from your middleware. By moving the request building and data normalization to fetch-actions, your middleware can be greatly simplified.

Consider this saga (presume it is called by a [`takeEvery`](https://redux-saga.js.org/docs/api/#takeeverypattern-saga-args) saga):

```js{8}
import { put, call } from 'redux-saga/effects'
import { requestPosts, receivePosts } from '../modules/posts/actions'
import { fetchAction } from '../utils/api'

export const fetchPostsSaga = function * (action) {
  const { payload } = action
  yield put(requestPosts(payload))
  const { data, errors } = yield call(fetchAction, action)
  yield put(receivePosts({ ...payload, data, errors }))
}
```

Even if you're not terribly familiar with [redux-saga](https://redux-saga.js.org/), you can see the above code is fairly straight-forward. Somewhere in the app, a `fetchPosts` action is dispatched. In the middleware above we dispatch an action to indicate that a request has been initiated, call `fetchAction` to make our API request, and dispatch an action with the resulting data and / or errors. This is very similar to the [thunk example](http://redux.js.org/docs/advanced/AsyncActions.html#async-action-creators) in the redux manual.

Middleware is responsible for managing the asynchronous flow with regards to your application. Fetch-actions is responsible for managing your middleware's relationship with your API. If you were implementing fetch directly within your middleware, the saga above would include at least 7 additional steps. Embedding API logic into your middleware can get messy in cases where creating the request or transforming the response is complicated.

**Note:** A full tutorial is outside the scope of this document. You can see more detail in the [fetch-actions docs](https://heygrady.github.io/fetch-actions/). You may like learn more about [redux-saga](https://redux-saga.js.org/) or [asynchronous middleware](http://redux.js.org/docs/advanced/ExampleRedditAPI.html).

## What does a `fetchAction` function look like?
Every application will have unique API requirements, so you'll need to create your own function for use in your app's middleware. The simplest `fetchAction` requires you to specify `fetch` and a `requestCreator`; you don't have to provide any other handlers if you don't want to. Because most apps will need data normalization, the example below shows a `transformer` as well.

```js{16-20}
import { createFetchAction, handleRequestCreatorActions, handleTransformerActions } from 'fetch-actions'
import { FETCH_POSTS } from '../modules/posts/constants'
import 'fetch-everywhere'

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
})

const transformer = handleTransformerActions({
  [FETCH_POSTS]: (json, action) => ({
    data: json.data.children.map(child => child.data),
    errors: undefined
  })
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})
```

## Bring your own `fetch`
Fetch isn't available in every environment ([browser support](http://caniuse.com/fetch)). It's very common for web applications to use the [`whatwg-fetch` polyfill](https://github.com/github/fetch). If your app runs in node or react-native, you might enjoy a platform agnostic polyfill, like [`fetch-everywhere`](https://github.com/lucasfeliciano/fetch-everywhere). If you wanted to use a library like [axios](https://github.com/mzabriskie/axios) or [superagent](https://github.com/visionmedia/superagent), you could supply `fetchAction` with a completely fake `fetch` function.

**Note:** This initial version of fetch-actions is designed with fetch in mind. In specific, it expects [Requests](https://developer.mozilla.org/en-US/docs/Web/API/Request) and [Responses](https://developer.mozilla.org/en-US/docs/Web/API/Response) to match the fetch API.

Below is a contrived example where you can supply whatever you want for fetch. You'll have the best results if you conform to the fetch standard. Fetch-actions supplies fetch with a Request object and expects to receive a promise that resolves to a Response.

```js{5-8,11}
import { createFetchAction } from 'fetch-actions'
import requestCreator from './requestCreators'
import transformer from './transformers'

const fetch = (input, init) => {
  const data = { whatever: 'could come from anywhere you please' }
  return Promise.resolve(new Response(JSON.stringify(data))) // <-- return a promise that resolves to a response
}

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})
```

### Mocking data with a `responder`
If you are implementing a new API you may need to generate fake responses using mock fetch calls. Rather that replacing fetch itself, fetch-actions allows you to specify a `responder`, which should return valid responses. A responder function is called *instead of* fetch, which makes it easy to build your app against an API, even before it exists. If your responder function returns anything other than `undefined`, it will be used instead of fetch.

**Note:** In this initial version, the response that your responder returns should be a valid fetch [response](https://developer.mozilla.org/en-US/docs/Web/API/Response).

Here's a responder that will return mock data while you are in [development](https://babeljs.io/docs/plugins/transform-inline-environment-variables/):

```js{5,7-11,16}
import { createFetchAction } from 'fetch-actions'
import requestCreator from './requestCreators'
import transformer from './transformers'
import 'fetch-everywhere'
import data from './mock/posts.js'

const responder = (request, action) => {
  if (process.env.NODE_ENV === 'development') {
    return new Response(JSON.stringify(data)) // <-- return a JSON response
  }
}

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  responder,
  transformer
})
```

### Using `handleResponderActions`
As your application grows you may want to return different mock data depending on the action. Fetch-actions provides a handler for mapping actions to responder functions. The `handleResponderActions` function expects a map object as its only argument and returns a function. The returned function is identical to a `responder` (it accepts a request and an action and returns a response).

The big difference is that `handleResponderActions` will call a specific responder function depending on the action type. If no matching action is found, undefined is returned, which will instruct fetch-actions to pass the request to fetch instead.

Below you can see a responder that is only called for the `FETCH_POSTS` action.

```js{12-14}
import { createFetchAction, handleResponderActions } from 'fetch-actions'
import requestCreator from './requestCreators'
import transformer from './transformers'
import { FETCH_POSTS } from '../modules/posts/constants'
import 'fetch-everywhere'
import data from './mock/posts.js'

const fetchPostsResponder = (input, init) => {
  return Promise.resolve(new Response(JSON.stringify(data)))
}

const responder = handleResponderActions({
  [FETCH_POSTS]: fetchPostsResponder
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  responder,
  transformer
})
```

## Required: `requestCreator`
At the very least, you need to provide a function for translating an action into a valid fetch request. Because every API is different, fetch-actions has no opinion about *how* you create those requests, but there's an requirement that a valid fetch request is returned.

A `requestCreator` is a function that receives an action as its only argument and returns a valid fetch request.

```js{4,8}
import { createFetchAction } from 'fetch-actions'
import 'fetch-everywhere'

const requestCreator = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)

export const fetchAction = createFetchAction({
  fetch,
  requestCreator
})
```

### Using `handleRequestCreatorActions(map)`
A your app grows, you will want to generate requests based on the action. For convenience, fetch-actions provides a handler that can map actions to requestCreator functions. It works similarly to [`handleActions`](https://redux-actions.js.org/docs/api/handleAction.html#handleactions) from [redux-actions](https://github.com/acdlite/redux-actions).

The `handleRequestCreatorActions` function expects a map object as its only argument and returns a function. The returned function is identical to a `requestCreator` (it accepts an action and returns a request). The big difference is that `handleRequestCreatorActions` will call a specific requestCreator function depending on the action type.

Below you can see a `requestCreator` that calls different creators for the `FETCH_POSTS` and `FETCH_EXAMPLES` actions.


```js{9-12}
import { createFetchAction, handleRequestCreatorActions } from 'fetch-actions'
import { FETCH_POSTS } from '../modules/posts/constants'
import { FETCH_EXAMPLES } from '../modules/examples/constants'
import 'fetch-everywhere'

const fetchPostsRequestCreator = action => new Request(`https://www.reddit.com/r/${action.payload}.json`)
const fetchExamplesRequestCreator = action => new Request(`https://example.com/${action.payload}`)

const requestCreator = handleRequestCreatorActions({
  [FETCH_POSTS]: fetchPostsRequestCreator,
  [FETCH_EXAMPLES]: fetchExamplesRequestCreator
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator
})
```

## Optional: `transformer`
Because every API is different, integrating your app with an external API can be challenging. Unless you were the one who designed the API, it likely doesn't return the exact data that your application is expecting. [Data normalization](http://redux.js.org/docs/recipes/reducers/NormalizingStateShape.html) (perhaps using something like [normalizr](https://github.com/paularmstrong/normalizr)) is a key step in your API integration. Fetch-actions manages this using `transformer` functions.

A `transformer` function receives a JSON object and an action as its two arguments and returns a data object in whatever format your application is expecting. The `json` comes from the [`response.json()`](https://developer.mozilla.org/en-US/docs/Web/API/Body/json) method on a fetch response. The `action` is the original action that was passed to `fetchAction`.

**Note:** This initial version of fetch-actions expects a json response. If you have an XML-only API (or some other weird response), you will want to implement a [`responseHandler`](https://heygrady.github.io/fetch-actions/docs/api/handleResponseActions.html).

**Note:** The example below is suggesting that your transformed data look like `{ data, errors }` but that isn't a hard requirement. Your data can look however you'd like. You might enjoy handling all of your errors in fetch-actions and returning well-formatted error objects to your middleware as shown below.

```js{5-8,13}
import { createFetchAction } from 'fetch-actions'
import requestCreator from './requestCreators'
import 'fetch-everywhere'

const transformer = (json, action) => ({
  data: json.data.children.map(child => child.data),
  errors: undefined // <-- you could pass back errors if you like
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})
```

### Using `handleTransformerActions`
Fetch-actions also provides a handler that can map actions to transformers. The `handleTransformerActions` function expects a map object as its only argument and returns a function. The returned function is identical to a `transformer` (it accepts a json object and an action and returns data). The big difference is that `handleTransformerActions` will call a specific `transformer` function depending on the action type.

```js{11-13}
import { createFetchAction, handleRequestCreatorActions, handleTransformerActions } from 'fetch-actions'
import requestCreator from './requestCreators'
import { FETCH_POSTS } from '../modules/posts/constants'
import 'fetch-everywhere'

const fetchPostsTransformer = (json, action) => ({
  data: json.data.children.map(child => child.data),
  errors: undefined
})

const transformer = handleTransformerActions({
  [FETCH_POSTS]: fetchPostsTransformer
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})
```

### Deeply nesting `transformer` functions
Transformer functions are modeled after reducers. The `handleTransformerActions` is functionally similar to [`handleActions`](https://redux-actions.js.org/docs/api/handleAction.html#handleactions) (which is designed for reducers). You may find yourself in a scenario where similar objects need to be transformed in similar ways. It's a good practice to have your transformer deal with one small part of the object tree and leave deeper parts of the tree to other transformers.

Here's an example of passing part of the tree to a child transformer:

```js{6-8,12}
import { createFetchAction, handleRequestCreatorActions, handleTransformerActions } from 'fetch-actions'
import requestCreator from './requestCreators'
import { FETCH_POSTS } from '../modules/posts/constants'
import 'fetch-everywhere'

const childTransformer = handleTransformerActions(
  [FETCH_POSTS]: (json, action) => json.data
)

const transformer = handleTransformerActions({
  [FETCH_POSTS]: (json, action) => ({
    data: json.data.children.map(child => childTransformer(child, action)),
    errors: undefined
  })
})

export const fetchAction = createFetchAction({
  fetch,
  requestCreator,
  transformer
})
```

## More details in the docs
The full [fetch-actions API](https://heygrady.github.io/fetch-actions/docs/api/ provides a number of handlers for managing the fetch lifecycle. You can read about these in the documentation.

- [`createFetchAction`](https://heygrady.github.io/fetch-actions/docs/api/createFetchAction.html)
- [`handleRequestCreatorActions`](https://heygrady.github.io/fetch-actions/docs/api/handleRequestCreatorActions.html) —- creates a [Request](https://developer.mozilla.org/en-US/docs/Web/API/Request)
- [`handleResponderActions`](https://heygrady.github.io/fetch-actions/docs/api/handleResponderActions.html) -- creates a [Response](https://developer.mozilla.org/en-US/docs/Web/API/Response)
- [`handleResponseActions`](https://heygrady.github.io/fetch-actions/docs/api/handleResponseActions.html) -- receives a Response; must return a Response
- [`handleTransformerActions`](https://heygrady.github.io/fetch-actions/docs/api/handleTransformerActions.html) -- receives [Response.json()](https://developer.mozilla.org/en-US/docs/Web/API/Body/json); should return data
- [`handleFatalActions`](https://heygrady.github.io/fetch-actions/docs/api/handleFatalActions.html) -- catches thrown errors

## Conclusion

If you like what you see above, you should be able to start using fetch-actions in your app right away. It is published as an [NPM package](https://www.npmjs.com/package/fetch-actions).

```bash
yarn add fetch-actions
```

Fetch-actions makes it easy to manage actions that create and transform fetch requests. You can read more about fetch-actions in the [docs](https://heygrady.github.io/fetch-actions/) or contribute to the Github [repository](https://github.com/heygrady/fetch-actions/). Feel free to open any [issues](https://github.com/heygrady/fetch-actions/issues) you run into. Currently, fetch-actions has 100% code coverage. You might like to review the [tests](https://github.com/heygrady/fetch-actions/tree/master/test) to learn more about the internal structure.

As noted above, I was heavily inspired to create fetch-actions after using [redux-actions](https://github.com/acdlite/redux-actions) on a few projects. Hopefully fetch-actions can make your next API integration a little more fun.
