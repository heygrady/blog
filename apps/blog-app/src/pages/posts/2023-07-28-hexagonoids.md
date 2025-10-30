---
layout: "../../layouts/BlogPost.astro"
title: "Hexagonoids: Asteroids on a Sphere"
description: "Creating a game using BabylonJS and H3 and publishing it on Vercel."
pubDate: "2023-07-28T21:29:45.882Z"
heroImage: "hero-hexagonoids.png"
---

I've been wanting to play around with BabylonJS for quite a while and I finally made a game. It's an Asteroids clone that takes place on the surface of a sphere.

Check out [hexagonoids.heygrady.com](https://hexagonoids.heygrady.com/) to play it right now. The code is available at [heygrady/hexagonoids](https://github.com/heygrady/hexagonoids).

## Goals

1. Create a globe out of H3 hexagons using [h3-js](https://www.npmjs.com/package/h3-js) and [BabylonJS](https://www.npmjs.com/package/@babylonjs/core)
2. Build an asteroids game on top of it
3. Publish it using Vercel

# Project structure

I decided to build this app using [Astro](https://astro.build/), which I recently used to [upgrade this blog](https://heygrady.com/posts/2022-08-29-relaunching-on-astro/). I've come to love Astro because it is built on top of tooling (like [Vite](https://vitejs.dev/)) that I really enjoy.

- Astro
- Tailwind
- SolidJS
- [Nano Stores](https://docs.astro.build/en/core-concepts/sharing-state/#why-nano-stores)
- BabylonJS

### Tailwind
I decided to use [Tailwind](https://docs.astro.build/en/guides/integrations-guide/tailwind/) because it is well integrated with Astro and is an industry best practice. I hadn't previously worked with Tailwind. For the small amount of CSS I needed to do for this project it was just as well to hunt and peck in the Tailwind docs as it would be to try to comb the internet for how to make CSS work in 2023. I plan to continue using Tailwind on future projects.

### SolidJS
I decided to use [SolidJS](https://www.solidjs.com/) as a wrapper for my BabylonJS app. This was [not strictly necessary](https://forum.babylonjs.com/t/getting-started-with-solid-js/36954/3) but it helped me get comfortable with the workflow, as Babylon is pretty different from a typical frontend project. It ended up being really nice to use SolidJS for organizing how the app initializes itself and how to manage context.

### Nano Stores
After having spent several years wrestling with React-Redux, it was really nice to use Nano Stores. I landed on this because it was recommended by Astro and it really suited my use case. I ended up creating all of the core game concepts (`$ship`, `$rock`, etc.) as nano stores and bundling them with the Babylon Nodes that were created to render them. This made it really easy to manage state and also the lifecycle of meshes and materials.

### BabylonJS
BabylonJS is a really powerful 3D game engine for browsers. While there is extensive documentation and examples, I'm very new to 3D game development and many of the concepts escape me. I've played with ThreeJS previously and found Babylon to be mostly similar.

# Using ChatGPT

It would've been impossible to complete this project without [ChatGPT](https://chat.openai.com/). There is a fair amount of code in the project that is directly pasted from the chat window. Once ChatGPT got me going I then had keywords that I could search for in the Babylon documentation and on Google.

Often the code that ChatGPT generated was filled with small errors. Rarely could I just cut and paste the code without editing it. However, the boilerplate code that it generated gave me things to research further. This felt similar to how I first learned web development by looking up how generated code actually worked.

There were long stretches of time where ChatGPT was happily telling me how to accomplish something the wrong way. But then, after additional searching to figure out why my code still wasn't working, I would uncover the standard approach.

The collision system was one of those adventures. I had started out trying to mock something up based on how I thought collisions should work. I also wanted to test out some theories about utilizing h3-js for collisions. I ended up with something that worked well but had major performance issues. Because I'd talked it over so thoroughly with ChatGPT I was becoming more aware of how efficient collision systems work. And then, out of nowhere, I realized that BabylonJS had all of that built-in and all I had to do was use it.

Overall, this was a great way to get into a library like BabylonJS with an expansive, tersely documented API. I knew very little of the jargon before diving in but now I know about [Quaternions](https://doc.babylonjs.com/typedoc/classes/BABYLON.Quaternion). Usually ChatGPT was more helpful than forum posts or Stack Overflow. Occasionally I found a good solution written in Unity and then I had ChatGPT rewrite it for BabylonJS. That would then tell me the classes to search for in the docs so that I could figure out how it all worked.

# Using Github Copilot

Because I was having such success with ChatGPT, I decided to try out GitHub Copilot for the first time. GitHub Copilot is amazing. I've been using VS Code for a few years and I have a pretty [complex ESLint rig](https://github.com/heygrady/blog/tree/main/packages/eslint-config), so I'm very used to my tooling fixing things like formatting and missing imports. However, GitHub Copilot blew me away.

GitHub Copilot uses patterns from your code to autocomplete huge blocks of boilerplate. Unlike ChatGPT, this code was exactly what I wanted and worked the first time. It has completely changed my workflow and I can't imagine working without it.

It was eerie and exhilarating to type out the beginning of a line and have Copilot autocomplete 10 or more lines of the exact code you were going to write. Once I got my linting configured properly Copilot started generating code that would pass the linter.

Seriously, start using Copilot.

# Integrating SolidJS and Babylon

I ended up creating [a thin wrapper](https://github.com/heygrady/hexagonoids/tree/aafc10b5367879b5b0fcd08fd5883d74539214c2/apps/hexagonoids/src/components/solid-babylon) around the Babylon Scene and using SolidJS context and Nano Stores to make that scene available to the component tree. I grew to love the system. In particular, it became much easier to reason about my app as I was able to look at the component tree to figure out how all of the major building blocks fit together.

### Getting it working
I initially was trying to use SolidJS to manage the lifecycles of the Babylon nodes but that was a bad idea for things that change frequently, like rocks and bullets. I ended up creating custom object pools and using nano store actions to manage the way nodes and materials are reused and disposed of.

After I had gone through a few rounds of polish I noticed that I was employing a familiar React-Redux style workflow. Moving vital functionality out of components and into actions helped everything make a lot more sense.

- **Component Tree** -- SolidJS for composing components and context
- **State Manager** -- Nano Stores for portable state and actions

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
  // Get the babylon scene instance from SolidJS context
  const scene = useScene()

  // Get other important nano stores from SolidJS context
  const [$game, gameActions] = useGame()
  
  // Create nodes on component render
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

In the code above we're able to seamlessly blend the Babylon render loop with the SolidJS component lifecycle. I found it to be quite intuitive.

### Composability

My `<Game />` component ended up looking something like this:

```tsx
import type { Component, JSX } from 'solid-js'
import { Show, createSignal } from 'solid-js'

import { SceneCanvas } from '../solid-babylon/SceneCanvas'

import { Bullets } from './Bullets'
import { CameraLighting } from './CameraLighting'
import { Cells } from './Cells'
import { Collisions } from './Collisions'
import { Culling } from './Culling'
import { EndScreen } from './EndScreen'
import { GameContext, type GameContextValue } from './GameContext'
import { Globe } from './Globe'
import { KeyboardPlayer } from './KeyboardPlayer'
import { Lights } from './Lights'
import { Rocks } from './Rocks'
import { Score } from './Score'
import { ShipCamera } from './ShipCamera'
import { Ships } from './Ships'
import { StartScreen } from './StartScreen'
import { bindGameActions } from './store/game/GameActions'
import { createGameStore } from './store/game/GameStore'
import { UI } from './UI'

export const Game: Component<
  JSX.CanvasHTMLAttributes<HTMLCanvasElement>
> = (props) => {
  const $game = createGameStore()
  const gameActions = bindGameActions($game)
  const gameContext: GameContextValue = [
    $game,
    gameActions,
  ]

  // Wait for scene to be ready
  const [ready, setReady] = createSignal<boolean>(false)
  const onReady = () => {
    setReady(true)
  }

  return (
    <SceneCanvas
      onReady={onReady}
      {...props}>
      <GameContext.Provider value={gameContext}>
        <Show when={ready()}>
          <Globe>
            <Ships />
            <Bullets />
            <Rocks />
            <Cells />
            <Lights />
            <KeyboardPlayer>
              <ShipCamera>
                <CameraLighting />
                <Culling />
                <Collisions />
                <UI>
                  <Score />
                  <StartScreen />
                  <EndScreen />
                </UI>
              </ShipCamera>
            </KeyboardPlayer>
          </Globe>
        </Show>
      </GameContext.Provider>
    </SceneCanvas>
  )
}

```

The code above shows how I composed my scene and separated the concerns into different components. The nesting of components also helps string together dependency chains. Notice how the `<ShipCamera />` is nested inside the `<KeyboardPlayer />`. This is because the camera needs the player to exist so that it can function properly. Similarly, the `<CameraLighting />` is inside the `<ShipCamera />` for similar reasons.

This composability made it really easy to keep things organized. 

### Solid-Babylon Troubles

I had some issues where SolidJS wanted to aggressively re-render components when their props changed. This was all proper but ended up being a performance issue, as Babylon meshes and materials are expensive to create and dispose of.

For components without props it's not a big deal to manage everything in Solid. In practice, I ended up managing the Babylon node instances with Solid when they were simple and low-impact, like the camera. And then for complex things, like rocks and bullets, I lifted the management of those nodes to store actions.

I generally avoided SolidJS concepts like `createEffect` because I rarely wanted to trigger components to re-render that way.

# Using H3

My initial inspiration for working on this project was to get more familiar with the H3 geospatial indexing system. I had encountered it while hanging out with some data science folks a few years back and it captured my imagination. [Hexagons are really cool](https://nautil.us/why-nature-prefers-hexagons-235863/).

Creating a hexagon-tiled globe is something of [a honey pot](https://stackoverflow.com/a/12847711) for people that wish they knew how 3D games worked. I was successfully able to use [quickhull3d](https://www.npmjs.com/package/quickhull3d) to create polyhedra from the vertices of [individual cells](https://github.com/heygrady/hexagonoids/blob/aafc10b5367879b5b0fcd08fd5883d74539214c2/apps/hexagonoids/src/components/hexagonoids/cell/createCellPolygon.ts) and for the [entire globe](apps/hexagonoids/src/components/hexagonoids/cell/createRes0Polyhedron.ts). 

I have some more dreams for what I can do with this spherical game world and I'm excited for the possibilities. I hope to work on those pieces further and to separate them out of the game logic and into a standalone package. I would love to create a globe mesh that automatically increased the resolution of the cells as you zoomed in.

# Learning about Asteroids

I had some fun digging into how Asteroids was made and formalizing my understanding of how the game worked. There's a rich community of people who love Asteroids. As a bonus, my Google News feed has started showing me articles about classic arcade games. Here's some links that were super helpful:

- [Original hand-drawn vectors](https://arcadeblogger.com/2018/10/24/atari-asteroids-creating-a-vector-arcade-classic/)
- [Measurements of relative sizes and speeds](https://www.retrogamedeconstructionzone.com/2019/10/asteroids-by-numbers.html)
- [Detailed vectors from the original source code](https://ronjeffries.com/articles/020-asteroids/asteroids-10/)
- [Play Asteroids on the AARP website](https://games.aarp.org/games/atari-asteroids)

# Publishing to Vercel

I've been publishing my projects to Firebase because it's free and easy. I decided to try out Vercel because it is well-supported by Astro and... wow. Vercel is amazing.

Vercel was very easy to get set up. I ran into a few hiccups because I like to use Yarn and I use packages that are published to GitHub Packages. I was able to find a workaround ([see here](https://github.com/vercel/vercel/discussions/5418#discussioncomment-1453970)) and then it was smooth sailing. I will definitely be using Vercel on future projects.

I'm sure it would get expensive to run a huge company on Vercel but for small to medium sized teams this workflow is a game changer. I was fiddling with the settings and reading the docs when I suddenly realized that my site had been live on the internet for a few hours already.

At first I was uncomfortable with automatically publishing the main branch to production but then I decided it was just fine.

# Takeaways

I really loved every part of this project. I would definitely use everything again. Five stars.

### Some things missing

- I didn't make the game controls work on mobile phones but I did notice that the game actually works.
- I didn't add any sounds or music. I have a note to look into the [Retrowave Generator](https://github.com/apvilkko/retrowave-generator/tree/master).
- I found out about [instances](https://doc.babylonjs.com/features/featuresDeepDive/mesh/copies/instances) in Babylon pretty late in the project, which would dramatically improve performance for bullets, rocks and cells.
