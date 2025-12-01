---
layout: "../../layouts/BlogPost.astro"
title: "Evolving a Tic Tac Toe AI In Your Browser"
description: "This is an experiment, implementing @neat-evolution in a real-world web app."
pubDate: "2025-12-01T18:56:05.651Z"
heroImage: "hero-tictactoe.jpg"
---

I recently completed an experiment to evolve a Tic Tac Toe AI using the
[@neat-evolution](https://github.com/neat-evolution/neat-js) library in a web
browser. The goal was to see how well a neural network could learn to play Tic
Tac Toe using the NEAT (NeuroEvolution of Augmenting Topologies) algorithm. See
my previous post on
[evolving neural networks in TypeScript](/posts/2025-10-29-evolving-neural-networks-in-type-script/)
for more background on the @neat-evolution library.

## Try it out

You can play the Tic Tac Toe AI demo here:
https://hexagonoids.heygrady.com/experiments/tictactoe/

The source code is available on Github: https://github.com/heygrady/hexagonoids/

## Key Features

- **In-Browser Training**: The AI trains directly in the browser using Web
  Workers to keep the UI responsive.
- **Auto-saving progress** (using
  [`idb-keyval`](https://github.com/jakearchibald/idb-keyval)), allowing
  training to resume after page reloads.
- **Hot swapping the NEAT variant**, allowing you to test different algorithms
  like NEAT, HyperNEAT, ES-HyperNEAT, and DES-HyperNEAT.
- **Modern frontend stack**: Built with SolidJS and nanostores for lightweight
  state management.
- **Thrilling tic-tac-toe action!**

## Game play

The game is a standard Tic Tac Toe game where you play against an AI opponent.
The AI starts off as a completely untrained neural network and trains in the
background as you play. After each match the AI will evolve for a few more
generations and choose the best performing network as your next opponent. As you
play you should see the AI improve steadily. Usually it only takes a few dozen
matches before the AI is playing at a competent level and within 200 generations
it should force a tie for nearly every game. You will likely see the same "best"
opponent for many generations with occasional breakthroughs that lead to rapid
improvement. After 500 or more generations it should max out its fitness and
further evolution will only degrade performance.

There are some settings you can tweak, such as choosing how many generations the
AI trains after each match, and which NEAT variant to use. My 7-year-old
daughter requested that there be an option to choose the emoji used for the
player pieces, but I'm the one who chose unicorns and rainbows as the default
pieces.

When you swap the NEAT variant it will save the current population and start (or
resume) training using the selected variant. You will likely see the best
results using the default options, but it's fun to experiment with the different
algorithms. Tic Tac Toe is a simple game, so the differences between the
algorithms are not as pronounced as they would be in more complex games.

## Tech Stack

The demo is built with [Astro](https://astro.build/) deployed to Vercel. The UI
uses [SolidJS](https://www.solidjs.com/) using the `client:only="solid-js"`
directive for client-side hydration (no SSR needed for this interactive app).

State management uses [nanostores](https://github.com/nanostores/nanostores), a
lightweight (~1KB) framework-agnostic library. I implemented a "draft vs
committed" pattern for settings: some changes (like emoji selection) apply
immediately, while others (like switching algorithms) stage in a draft until
confirmed.

Persistence relies on
[`idb-keyval`](https://github.com/jakearchibald/idb-keyval) for IndexedDB
storage. The app maintains three separate stores: user settings, player Glicko2
ratings and match history, and evolved populations (which can grow to several
megabytes as networks evolve). If the stored populations grow too large they are
pruned to save space.

## Fitness

The greatest challenge was devising a fitness function that would allow the AI
to learn effectively. In Tic Tac Toe, there are only three possible outcomes:
win, lose, or draw. This makes it difficult for the AI to learn from its
mistakes, as a loss does not provide much information about what went wrong.
After many iterations I settled on a tournament environment using swiss
tournaments and using glicko2 ratings to evaluate the networks. In order to bake
in the glicko2 ratings, the AI needs to play a number of games. So, prior to the
tournament I run the networks through a gauntlet of games against a fixed
opponent (a minimax solver that makes random opening moves). This way, the
tournament is seeded with networks that have a baseline rating that is
consistent across generations.

For fun, the game updates your glicko2 rating as you play against the AI, so you
can see how well you stack up against the evolving networks.

Because it's not possible to dominate tictactoe (a perfect player will always
force a draw), the fitness maxes out around 0.8 to 0.9. The final fitness score
is somewhat arbitrary based on estimates of min/max glicko2 ratings and also the
maximum game score from the gauntlet games. The glicko2 rating score and the
gauntlet score are combined into the final fitness score. These weights are
somewhat arbitrary and can be tuned (but not in the UI).

## Tournament Strategy, and Tic Tac Toe Environment

One key feature of the neat-evolution library is the ability to create custom
environments for training. In this case, I created a Tic Tac Toe environment
that will conduct a match between two networks or against a gauntlet of fixed AI
opponents. The environment handles the game logic, scoring, and fitness
evaluation of those matches.

To make this work with the built-in worker-evaluator, I added the ability to
provide an evaluation-strategy, which in this case is responsible for running
the tournament and calculating the final fitness scores from the gauntlet and
Glicko2 scores.

## Bundling with Vite

The tictactoe demo is part of an astrojs app, which is built with vite. Because
the neat-evolution library uses web workers, I had to configure vite to handle
the worker files correctly. One complication was that the workers are
initialized deep within the neat-evolution library, which is not the happy path
for vite. The documentation for using workers with vite is very thin and not
very clear. There were three tricks I had to use to get this working:

1. glob imports
2. using `?worker&url` to get the worker URL
3. manual chunking to ensure the code the worker imports isn't bundled with the
   main thread code

The `?worker&url` suffix tells Vite to process the file as a worker and return
its URL rather than the module itself:

```typescript
import workerEvaluatorScriptUrl from "@neat-evolution/worker-evaluator/workerEvaluatorScript?worker&url";
```

I had to modify the neat-evolution library code slightly to use these
techniques, allowing for paths to be passed in from the outside. This was
challenging to debug. Without manual chunking the app would throw cryptic errors
like `a is undefined`, which was caused by solid-js (which accesses the window
object) being added to the same chunk as some code the worker imported — workers
don't have a `window` object, so the minified code failed. After some trial and
error with Rollup's `manualChunks` configuration, I was able to isolate the
worker code into separate chunks.

## Effective training

A great deal of work went into how to encode the tictactoe board for the neural
network inputs and outputs. The board is represented as a flat array of 18
one-hot encoded inputs with each input representing a cell on the board, 9 for
the AI's pieces and 9 for the opponents pieces. There are 9 outputs, one for
each cell on the board, representing the AI's confidence in placing a piece in
that cell. The highest output value is chosen as the AI's move.

A crucial optimization was normalizing the orientation of the board before
feeding it to the neural network. There are a limited number of possible board
configurations. If you account for symmetries (rotations and reflections) there
are only 765 unique board states. By normalizing the board to a canonical
orientation, the neural network can learn more effectively, as it doesn't have
to learn the same patterns multiple times for different orientations.

The canonicalization algorithm searches all 8 symmetries (4 rotations × 2
reflection states) in a single loop:

```typescript
// Search all 8 symmetries to find the canonical (lexicographically smallest) board
for (let i = 0; i < 4; i++) {
  if (i > 0) {
    currentBoard = rotateBoard90(currentBoard);
    currentMapping = currentMapping.map(rotateIndex90);
  }
  // Test current rotation
  if (boardToKey(currentBoard) < bestKey) {
    bestKey = boardToKey(currentBoard);
    bestBoard = currentBoard.slice();
    bestMapping = currentMapping.slice();
  }
  // Test reflection of current rotation
  const reflected = reflectBoardVertical(currentBoard);
  if (boardToKey(reflected) < bestKey) {
    bestKey = boardToKey(reflected);
    bestBoard = reflected;
    bestMapping = currentMapping.map(reflectIndexVertical);
  }
}
```

The function returns both the canonical board and an index mapping, so after the
neural network outputs its move, the result can be transformed back to the
original orientation. Results are cached using an LRU cache for performance.

| **Metric**               | **Count** | **Description**                                                                                 |
| ------------------------ | --------- | ----------------------------------------------------------------------------------------------- |
| **State Space (Simple)** | 5,478     | All reachable legal arrangements of X and O.                                                    |
| **State Space (Unique)** | **765**   | All reachable arrangements, removing rotational/reflective duplicates.                          |
| **Game Tree Complexity** | 26,830    | The number of possible distinct _games_ played (sequences of moves), not just static snapshots. |

After some experimentation, I decided to choose the canonical board state based
on the lowest numerical representation of the board _using only the opponent's
pieces_. This seemed to help the AI learn defensive strategies more effectively,
as it would see similar board states more frequently. The canonical states are
not spatially consistent so similar board states might have different
orientations, which probably hindered learning. Choosing the stable orientation
using only the opponent's pieces seemed to improve learning speed.

Another innovation was choosing an arbitrary input for the null state (an empty
board). The network was receiving all zeroes in that case. I decided to use
zeroes for the ai pieces and ones for the opponent pieces. This seemed to help
the network choose more consistent opening moves.

## Gauntlet Opponent

This was another area of significant trial and error. Tictactoe is a solved game
and you can create a perfect player using the minimax algorithm. However, this
creates a bottleneck for learning as the minimax AI crushes the untrained
networks every time. To address this I created a second gauntlet opponent that
plays random moves for the first two turns, then plays perfectly thereafter.
This exposes the networks to a wider variety of board states and allows them to
learn more effectively. The random opening moves create more diverse board
states, which avoids overfitting to a narrow set of scenarios.

I created a stable of ai opponents that I ended up not using as the minimax +
random openings opponent worked best.

## Worker Pools and Worker Actions

As part of this work I extracted a reusable worker pool and worker action system
that can be used to run arbitrary tasks in web workers. This is now part of the
neat-evolution library as the `@neat-evolution/worker-pool` and
`@neat-evolution/worker-actions` modules. This really simplified the code for
`@neat-evolution/worker-evaluator` and `@neat-evolution/worker-reproducer`,
allowing them to focus on their core responsibilities while delegating the
worker management to the worker pool.

The architecture has two layers: `WorkerPool` manages thread lifecycle using
semaphore-based concurrency control (via
[async-sema](https://github.com/vercel/async-sema)), while `WorkerActions`
provides the communication layer. The pool uses a LIFO stack for worker reuse,
promoting cache locality, and decouples thread count from task concurrency—you
can queue more tasks than you have threads.

### Flux Standard Actions for Workers

The action system is inspired by
[redux-actions](https://github.com/redux-utilities/redux-actions) and the Flux
Standard Action pattern. The `createAction` function returns action creators
with a nice trick: `toString()` returns the action type, so action creators can
be used directly as object keys:

```ts
export function createAction<P = any>(
  type: string,
  payloadCreator: (...args: any[]) => P = identityPayloadCreator<P>,
) {
  const actionCreator = (...args: any[]): WorkerAction<P> => {
    const payload = payloadCreator(...args);
    return { type, payload };
  };
  actionCreator.toString = () => type;
  return actionCreator;
}
```

### Dual Message Handling

The system supports two communication patterns. The first is RPC-style
request/response: `dispatcher.request(action)` returns a promise that resolves
when the worker responds. Request IDs use base36 encoding for compactness
(`counter.toString(36)`) rather than UUIDs.

The second pattern is spontaneous events: workers can emit events that the main
thread listens for. The dispatcher handles both in a single message handler:

```typescript
class Dispatcher {
  private _onMessage(message: any, worker: Worker) {
    // 1. Handle RPC responses (correlate request → response)
    if (this.requestManager.handleResponse(action)) {
      return
    }
    // 2. Handle spontaneous events from worker
    const listeners = this.eventListeners.get(action.type)
    if (listeners != null) {
      for (const listener of listeners) {
        listener(action, context)
      }
    }
  }
}
```

A few other details I'm pleased with: workers signal readiness via a
`WORKER_READY` message, but there's a failsafe timeout that auto-sends the ready
signal if the developer forgets to call `handler.ready()`. The system also
supports `Transferable` objects for zero-copy passing of ArrayBuffers between
threads.

## Next Steps

It would be possible to expand the settings to expose many more of the arbitrary
parameters, such as the weights for the fitness function or the number of
gauntlet games, etc. As part of getting this all working I ended up creating an
`EvolutionManager` class that abstracted away much of the boilerplate around
managing the NEAT instance, the evaluator, the reproducer, and the training
loop. This could be further abstracted to allow for more flexible configurations
as it currently bakes in the specific configuration needed for the tictactoe
demo.

## A Little Help From My Friends

This would not have been possible without my friends Gemini CLI and Claude Code.
These tools have been rapidly advancing and picking this project back up after a
few months was made much easier with their help. I was particularly impressed
with Claude Code's ability to make smart refactors and remain effective even for
long coding sessions. It took some learning to develop a productive workflow but
once I got the hang of it, it was quite addictive.

Finalizing this project, getting all of the code committed and released, was
almost fun. I like to use conventional commits and automated release processes
and using Claude Code to make atomic commits and use `gh` to create the PR and
monitor the release process was a dream come true. It was really nice to hand
over the bulk of the work rebasing and squashing a jungle of 200+ commits into a
nice clean PR.

These tools are amazing when they work and spooky when they don't. It's like
working with the mythical 10x developer who occasionally loses their mind and
morphs into a confused intern. They are not a replacement for an experienced
developer, but they can be a force multiplier for one. Even if you don't trust
the code they write, I will never go back to committing and releasing code the
old fashioned way.

## Conclusion

This project pushed me to learn far more about Tic Tac Toe than I ever expected.
The Glicko2 rating system, board symmetry optimization, and Swiss tournament
pairing were all new territory. The tournament strategy alone required extending
the neat-evolution library in ways I hadn't anticipated, which led to the
worker-actions RPC system I'm now quite pleased with.

What I'm most satisfied with is how production-ready the result feels: training
persists across page reloads, algorithms can be hot-swapped without losing
progress, and it runs smoothly on mobile devices. The persistence layer makes it
feel like a real application rather than a throwaway demo.

If you want to see a neural network learn in real-time, give it a try. Watch the
fitness climb from 0.3 to 0.8 over a few dozen generations, and see if you can
still beat it once it's had a chance to evolve.
