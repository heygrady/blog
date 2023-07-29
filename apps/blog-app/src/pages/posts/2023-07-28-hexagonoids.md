---
layout: "../../layouts/BlogPost.astro"
title: "Hexagonoids: Asteroids on a Sphere."
description: "Creating a game using BabylonJS and H3 and publishing it on Vercel."
pubDate: "2023-07-28T21:29:45.882Z"
heroImage: "hero-hexagonoids.png"
---

I've been wanting to play around with BabylonJS for quite a while and I finally made a game. Check out [hexagonoids.heygrady.com](https://hexagonoids.heygrady.com/) to play it right now. It's an Asteroids clone that takes place on the surface of a sphere. I've made the code open source and posted it to [heygrady/hexagonoids](https://github.com/heygrady/hexagonoids).

This was a fun project that also allowed me to play around with Vercel.

## Goals

1. Create a globe out of H3 hexagons using [h3-js](https://www.npmjs.com/package/h3-js) and [BabylonJS](https://www.npmjs.com/package/@babylonjs/core)
2. Build an asteroids game on top of it
3. Publish it using Vercel


# Project structure

I decided to build this app using [Astro](https://astro.build/), which I recently used to upgrade this blog. I've come to love Astro because it is built on top of tooling (like [Vite](https://vitejs.dev/)) that I really enjoy.

- Astro
- Tailwind
- SolidJS
- [Nano Stores](https://docs.astro.build/en/core-concepts/sharing-state/#why-nano-stores)
- BabylonJS

### Tailwind
I decided to use [Tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/) because it is well integrated with Astro and is an industry best practice. I'd never worked with Tailwind very much previously. For the small amount of CSS I needed to do for this project it was just as well to hunt and peck in the Tailwind docs as it would be to try and comb the internet for how to make CSS work in 2023. I plan to continue using Tailwind on future projects.

### SolidJS
I decided to use [SolidJS](https://www.solidjs.com/) as a wrapper for my BabylonJS app. This was [not strictly necessary](https://forum.babylonjs.com/t/getting-started-with-solid-js/36954/3) but it helped me get comfortable with the workflow, as Babylon is pretty different from a typical frontend project. It ended up being really nice to use SolidJS for organizing how the app initializes itself and how to manage context.

### Nano Stores
After having spent several years wrestling with React-Redux, it was really nice to use Nano Stores. I landed on this because it was recommended by Astro and it really suited my use case. I ended up created all of the core game concepts (`$ship`, `$rock`, etc.) as nanostores and bundling them with the Babylon Nodes that were created to render them. This made it really easy to manage state and also the lifecycle of meshes and materials.

### BabylonJS
BabylonJS is really powerful and has loads of documentation but I'm very new to 3D game development and many of the concepts escape me. I initially was trying to use SolidJS to manage the lifecycles of the Babylon nodes but that was a bad idea for things that change frequently, like rocks and bullets. I ended up creating custom object pools and using nano store actions to manage the way nodes and materials are reused and disposed.

# Using ChatGPT

I relied heavily on [ChatGPT](https://chat.openai.com/) and [Github Copilot](https://github.com/features/copilot). It would've been impossible to complete this project without ChatGPT. There is a fair amount of code in the project that is directly pasted from the chat window. Once ChatGPT got me going I then had keywords that I could search for in the Babylon documentation and on Google.

Often the code that ChatGPT generated was filled with small errors (or huge errors). Rarely could I just cut and paste the code without editing it. There were long stretches of time where ChatGPT was happily telling me how to accomplish something the wrong way. But then, after quizzing ChatGPT about why my code still wasn't working it would point out that there are standard best practices to solving these problems.

The collision system was one of those adventures. I had started out trying to mock something up based on how I thought collisions should work. I also wanted to test out some theories I had about utilizing h3-js for collisions. I ended up with something that worked well but had major performance issues. Because I'd talked it over so thoroughly with ChatGPT I was becoming more aware of how efficient collision systems work. And then, out of nowhere, I realized that BabylonJS had all of that built in and all I had to do was use it.

Overall, this was a great way to get into a library like BabylonJS with an expansive, densely documented API when I knew very little of the jargon before diving in. Usually ChatGPT was more helpful than forum posts or stack overflow. More than once I found a good solution written in Unity and then I had ChatGPT rewrite it for BabylonJS. That would then tell me the classes to search for in the docs so that I could double check that ChatGPT was using things correctly.

# Using Github Copilot

Because I was having such success with ChatGPT, I decided to try out Github Copilot for the first time. Github Copilot is amazing. I've been using VS Code for a few years and I have a pretty [complex Eslint rig](https://github.com/heygrady/blog/tree/main/packages/eslint-config), so I'm very used to my tooling fixing things like formatting and missing imports. However, Github Copilot blew me away.

Github Copilot uses patterns from your code to autocomplete huge blocks of boilerplate. Unlike ChatGPT, this code was exactly what I wanted and worked the first time. It has completely changed my workflow and I can't imagine working without it.

It was eery and exhilarating to type out the beginning of a line and have Copilot autocomplete 10 or more lines of the exact code you were going to write. Once I got my linting configured properly Copilot started generating code that would pass the linter.

Seriously, start using Copilot.

# Integrating SolidJS and Babylon

I ended up creating [a thin wrapper](https://github.com/heygrady/hexagonoids/tree/main/apps/hexagonoids/src/components/solid-babylon) around the Babylon Scene and using SolidJS context and Nano Stores to make that scene available to the component tree. I grew to love the system. In particular, it became much easier to reason about my app as I was able to look at the component tree to figure out how all of the major building blocks fit together.

A typical Solid-Babylon component ended up looking like this:

```tsx
import { TransformNode } from '@babylon/core'
import type { Component, JSX } from 'solid-js'
import { onCleanup } from 'solid-js'

import { onBeforeRender } from '../solid-babylon/hooks/onBeforeRender'
import { useScene } from '../solid-babylon/hooks/useScene'

import { useGame } from './hooks/useGame'

export interface ExampleProps {
  children?: JSX.Element
}

export const Example: Component<ExampleProps> = (props) => {
  // Get the babylon scene instance from solid-js context
  const scene = useScene()

  // Get other important nano stores from solid-js context
  const [$game, gameActions] = useGame()
  
  // Create nodes on render
  const exampleNode = new TransformNode('example', scene)

  onBeforeRender(() => {
    // Execute game logic in the babylon render loop
    const gameState = $game.get()
    if (gameState.foo === true) {
      gameActions.explode(exampleNode)
    }
  })

  onCleanup(() => {
    // Dispose of nodes on unmount
    exampleNode.dispose()
  })

  // Allow for logical nesting of components
  return <>{props.children}</>
}
```

### Solid-Babylon Troubles

I had some issues where SolidJS wanted to aggressively re-render some components when their props changed. This was all proper but ended up being a performance issue, as Babylon meshes and materials are expensive to create and dispose of.

For components without props it's not a big deal to manage everything in Solid. In practice, I ended up managing the Babylon node instances with Solid when they were simple and low-impact, like the camera. And then for complex things, like the h3 cells, rocks and bullets, I lifted the management of those nodes to nano store actions.

# Using H3

My initial inspiration for working on this project was to get more familiar with the H3 geospatial indexing system. I had encountered it while hanging out with some data science folks a few years back it it captured my imagination. [Hexagons are really cool](https://nautil.us/why-nature-prefers-hexagons-235863/).

I was successfully able to use [quickhull3d](https://www.npmjs.com/package/quickhull3d) to create polyhedra from the vertexes of [individual cells](https://github.com/heygrady/hexagonoids/blob/main/apps/hexagonoids/src/components/hexagonoids/cell/createCellPolygon.ts) and for the [entire globe](https://github.com/heygrady/hexagonoids/blob/main/apps/hexagonoids/src/components/hexagonoids/cell/createRes0Polyhedron.ts). I hope to work on those pieces further and to separate them out of the game logic and into a standalone packages. I would love to create a globe mesh that automatically increased the resolution of the cells as you zoomed in.

# Learning about Asteroids

I had some fun digging into how Asteroids was made and formalizing my understanding of how the game worked. There's a rich community of people who love Asteroids. Now my Google News feed is showing me articles about classic arcade games. Here's some links that were super helpful:

- [Original hand-drawn vectors](https://arcadeblogger.com/2018/10/24/atari-asteroids-creating-a-vector-arcade-classic/)
- [Measurements of relative sizes and speeds](https://www.retrogamedeconstructionzone.com/2019/10/asteroids-by-numbers.html)
- [Detailed vectors from the original source code](https://ronjeffries.com/articles/020-asteroids/asteroids-10/)

# Publishing to Vercel

I've been publishing my projects to Firebase because it's free and easy. I decided to try out Vercel because it is well supported by Astro and... wow. Vercel is amazing.

Vercel was very easy to get set up. I ran into a few hiccups because I like to use Yarn and I use packages that are published to Github Packages. I was able to find a workaround ([see here](https://github.com/vercel/vercel/discussions/5418#discussioncomment-1453970)) and then it was smooth sailing. I will definitely be using Vercel on future projects.

I'm sure it would get expensive to run a huge company on Vercel but for small to medium sized teams this workflow is a game changer.

Cool things:
- Everything works
- Most things are automatic
- Every branch is published, always!

I was fiddling with the settings and reading the docs when I suddenly realized that my site had been live on the internet for a few hours already.

# Takeaways

I really loved every part of this project. I would definitely use everything again. Five stars.

### Some things missing

- I didn't make the game controls work on mobile phones but I did notice that the game actually works.
- I didn't add any sounds or music. I have a note to look into the [Retrowave Generator](https://github.com/apvilkko/retrowave-generator/tree/master).
- I found out about [instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances) in Babylon pretty late in the project, which would dramatically improve performance for bullets, rocks and cells.
