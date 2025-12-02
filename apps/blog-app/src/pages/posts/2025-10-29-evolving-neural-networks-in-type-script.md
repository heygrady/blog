---
layout: "../../layouts/BlogPost.astro"
title: "Evolving Neural Networks in TypeScript"
description: "Introducing @neat-evolution, a modular implementation of NEAT in TypeScript."
pubDate: "2025-10-29T21:45:16.426Z"
heroImage: "hero-neat.jpg"
---

I've been sitting on this for quite a while. After months of development, I'm
excited to finally introduce
[@neat-evolution](https://github.com/neat-evolution/neat-js), a modular
implementation of the NEAT (NeuroEvolution of Augmenting Topologies) algorithm
in TypeScript. This was based on
[des-hyperneat](https://github.com/tenstad/des-hyperneat), a Rust implementation
of NEAT. I was drawn to the project because I wanted to experiment with evolving
neural networks in a language I was more comfortable with.

I was impressed by how the original Rust implementation composed the various
flavors of the NEAT algorithm in a modular fashion. This inspired me to create a
TypeScript version that could be easily integrated into web applications and
other TypeScript projects.

The resulting code works quite well but it's not yet battle-tested. I wanted to
share this work to document it and make it available to others who might find it
useful.

## What is NEAT?

If you aren't familiar,
[NEAT](https://en.wikipedia.org/wiki/Neuroevolution_of_augmenting_topologies) is
a genetic algorithm for evolving neural networks. There have been many popular
YouTube videos, which is where I first heard about it many years ago. Here's a
video where someone uses
[NEAT to play Asteroids](https://youtu.be/f3QAtOEn4Is?si=m-zcRCbVov_IXowQ).

If you're wondering why you haven't heard of this or why it's not more widely
used, it's because NEAT is primarily a research algorithm. While it has some
interesting properties, it hasn't seen widespread adoption in production
systems. However, it's a fascinating area of study for those interested in
evolutionary algorithms and neural networks.

## Why I Built It

I was originally interested in developing this library to play the
Asteroids-style game, [Hexagonoids](/posts/2023-07-28-hexagonoids/), that I
built a while back. My goal was to evolve neural networks that could effectively
play the game using the NEAT algorithm. This proved to be quite a lofty goal. I
started with a
[Tic Tac Toe experiment](/posts/2025-12-01-evolving-a-tic-tac-toe-ai-in-your-browser/),
which seemed like a manageable starting point but, of course, had many hidden
complexities.

I also pursued this project because I was not happy with the NEAT
implementations available. I had read about more advanced implementations, like
ES-Hyperneat, that had been developed by the inventor of NEAT but were not
available in the existing JS implementations. Most of the existing JS NEAT
implementations are not set up for extensibility and don't include basic
features like exporting and importing neural networks.

This was also a good opportunity for me to explore good code management best
practices, utilizing a Yarn Monorepo for managing the code as separate packages,
and GitHub Actions for automatically versioning and publishing the code to the
GitHub Package Registry. To that end, I implemented a fully automated package
release workflow using [Beachball](https://github.com/microsoft/beachball).

## Key features

- **Modular architecture:** Easily swap out components like the
  [evaluator](https://github.com/neat-evolution/neat-js/tree/main/packages/evaluator),
  [reproducer](https://github.com/neat-evolution/neat-js/tree/main/packages/evolution),
  and
  [environment](https://github.com/neat-evolution/neat-js/tree/main/packages/dataset-environment).
- **Multiple NEAT variants:** Supports NEAT, HyperNEAT, ES-HyperNEAT, and
  DES-HyperNEAT.
- **Cross-platform:** Works in both Node.js and browser environments.
- **Worker threads:** Utilizes
  [worker threads](https://github.com/neat-evolution/neat-js/tree/main/packages/worker-threads)
  for parallel processing to improve performance.
- **Serialization:** Supports exporting and importing neural networks for easy
  storage and transfer.

## Parallel Processing

I spent a significant amount of time focusing on performance. Obviously Rust is
known for being much faster than TypeScript. However, after some significant
tweaking, my TypeScript implementation was just as fast as the Rust version on
my machine. To be fair, the Rust version was not heavily optimized, but I was
still pleased with the results.

The original Rust implementation used threads for a portion of the algorithm,
and I was able to implement that in a cross-platform manner using Node Worker
Threads and Web Workers based on the environment. I created the
[@neat-evolution/worker-threads](https://github.com/neat-evolution/neat-js/tree/main/packages/worker-threads)
package to transparently switch to the correct worker implementation using
[conditional exports](https://nodejs.org/api/packages.html#conditional-exports).

Interestingly, I noticed some parts of the Rust implementation that _could_ have
been parallelized but weren't. The original implementation was intended for
academic purposes and was never fully optimized. I implemented parallel
processing for the evaluation _and_ the reproduction steps of the NEAT
algorithm. Making reproduction parallel was especially helpful for performance.

If you aren't aware, NEAT evolves a population of neural networks and then
selects the best network after each generation. Most implementations use a
default of 100 "genomes" grouped into species, which means that it can be quite
computationally expensive as you need to evaluate 100 neural networks at each
training step. By contrast, training a neural network with something like
TensorFlow evaluates only _one_ network at a time.

I was able to move all of the
[evaluation](https://github.com/neat-evolution/neat-js/tree/main/packages/worker-evaluator)
_and_
[reproduction](https://github.com/neat-evolution/neat-js/tree/main/packages/worker-reproducer)
steps into workers, which ended up making my implementation quite fast as it can
use all of the CPU cores available, even in the browser.

## Stateless Innovation Tracking

Once I had the full library implemented, I noticed it was not able to run for
very long without crashing. Upon inspection, it was because the original
implementation kept a registry of every structural mutation that had ever
occurred. This is part of the NEAT algorithm — the original paper by Kenneth
Stanley establishes that "whenever a new gene appears (through structural
mutation), a global innovation number is incremented and assigned to that gene."
This registry enables meaningful crossover between genomes with different
structures by providing a historical record of how each gene was introduced.

The original Rust implementation used a centralized `InnovationLog` with
multiple hash maps tracking innovations. This approach causes unbounded memory
growth as evolution progresses. The problem was especially pronounced when
running DES-HyperNEAT, which is like a nesting doll of NEAT algorithms where
each node is itself an independent NEAT network. The nested registries ballooned
quickly.

I replaced the registry entirely with deterministic hashing. Instead of looking
up innovations in a mutable registry, the library computes them on-demand.

### Benefits

The hash-based approach provides significant engineering advantages:

1. **Worker-friendly**: No synchronization needed; each worker computes
   innovations independently
2. **Bounded memory**: No registry growth; only a small LRU cache for
   performance
3. **Reproducibility**: Deterministic across runs (registry-based approaches
   produce different IDs based on random mutation order)
4. **Debugging**: Human-readable innovation keys (e.g., `"i0:h3c2f:o1"`)
5. **Serialization**: String keys serialize naturally without preserving counter
   state

The result is much faster performance, much lower memory overhead, and
dramatically simpler worker coordination.

## Other Performance Tweaks

### Use `for` Loops

One of the biggest performance tweaks was avoiding built-in array looping
functions like `Array.map` or `Array.some`. In a normal web application it
doesn't matter, but there is a tiny overhead involved in creating and executing
an arrow function. In all cases where looping is required, using a traditional
`for` loop is faster, if only by that tiny amount. In the case of NEAT, where we
constantly are looping over 100 neural networks and then looping over all of the
nodes in those networks, that tiny difference is magnified and this kind of
micro-optimization is worth the hassle.

### Use Generators

This is most evident in the `Population` class where most of the work is done.
There are numerous times when we need to iterate over a set of objects, and in
each of those times, we rely on iterators (often async iterators) to reduce the
performance hit of creating temporary arrays. This allows us to more efficiently
pass the streaming output from, say, a worker pool that is processing every
`Genome` in the population directly into a loop, which saves memory and
processing time.

```ts
class Population<G> {
  *genomeEntries(): IterableIterator<GenomeEntry<G>> {
    for (const [speciesIndex, species] of this.species.entries()) {
      for (const [organismIndex, { genome }] of species.organismEntries()) {
        yield [speciesIndex, organismIndex, genome];
      }
    }
  }
}
```

### Use `Map` and `QuickLRU`

Whenever we need to keep a collection of objects, it's always better to use a
`Map` instead of a plain object. Whenever a `Map` might grow out of control, use
[`QuickLRU`](https://github.com/sindresorhus/quick-lru) to prevent any
possibility of memory leak. You do need to make sure that any data the QuickLRU
might discard is not useful or could easily be recalculated.

```ts
this.species = new Map<number, Species<CD, SD, HND, LD, GFO, GO, G>>();

// extinct species are only used for reporting
this.extinctSpecies = new QuickLRU<
  number,
  Species<CD, SD, HND, LD, GFO, GO, G>
>({ maxSize: 1000 });
```

## Translation Challenges

The greatest challenge was translating from Rust to TypeScript. I heavily relied
on ChatGPT for this, as I did not know Rust. I developed a workflow where I
would paste each Rust file into ChatGPT and ask it to translate it to
TypeScript. This was surprisingly effective but far from perfect. The final code
in the project today is very different from what ChatGPT produced, but the
initial translation was automated.

I did the bulk of the translation work more than 2 years ago when ChatGPT was
quite new and not as capable as it is today.

Some things ported over quite well. Some things did not.

In all cases, Rust is strongly typed, which is a great advantage as the code is
easy to trace, and the resulting TypeScript code is also well typed. However, in
all cases, TypeScript is loosely typed. TypeScript is simply not as robust as
Rust.

### TypeScript classes are not simply Rust `struct` and `impl`

Rust does not have classes in the same way that TypeScript does. Instead, the
components of a class are split up between structs (conceptually similar to
class properties) and implementations (conceptually similar to class methods).
In many cases, glueing the struct and implementation together into a single
TypeScript class will work just fine, and that's mostly what was done in the
translation process. However, Rust is very expressive and allows for a kind of
context-aware inheritance that is impossible to recreate in TypeScript.

The original Rust source code used many clever techniques that allowed them to
compose the various NEAT algorithms from the basic building blocks. For
instance, the NEAT algorithm could be extended to support HyperNEAT and
ES-HyperNEAT, and the Population can adapt to the needs of these different
algorithms. Most of the functionality is the same, but different traits enable
different capabilities based on the context.

Rust is really powerful. TypeScript is not. This led to many hours of tracing
the Rust code in circles to unpack what was really happening and making
adjustments to the TypeScript classes to accommodate that. The most obvious side
effect is that all of this dependency injection needed to be represented in
TypeScript's woefully underpowered type system... and some of the types got
HUGE.

#### Rust

Rust is able to fill in the blanks because it is fully context-aware. The
population might be a Genome of _any_ NEAT variant, and Rust can figure that out
based on the context.

```rust
pub struct Population<G: Genome> {
	// ...
}

impl<G: Genome> Population<G> {
	// ...
}
```

#### TypeScript

TypeScript has no idea what's going on, so you have to tell it about all
possible use cases. It's possible this could be simplified, but the extensible
nature of the source implementation means that TypeScript isn't sure what it's
dealing with unless you are explicit.

```ts
export class Population<
  // Genome
  CFO extends ConfigFactoryOptions,
  NCO extends ConfigOptions,
  LCO extends ConfigOptions,
  CD extends ConfigData,
  C extends CoreConfig<CFO, NCO, LCO, CD>,
  NSD,
  LSD,
  NS extends ExtendedState<NSD>,
  LS extends ExtendedState<LSD>,
  SD extends StateData,
  S extends CoreState<NSD, LSD, NS, LS, SD>,
  HND,
  LD,
  GFO extends GenomeFactoryOptions<HND, LD>,
  GO extends GenomeOptions,
  GD extends GenomeData<CD, SD, HND, LD, GFO, GO>,
  // CoreNode
  NFO extends NodeFactoryOptions,
  N extends CoreNode<NFO, NCO, NSD, NS, N>,
  // CoreLink
  LFO extends LinkFactoryOptions,
  L extends CoreLink<LFO, LCO, LSD, LS, L>,
  // CoreGenome
  G extends CoreGenome<
    CFO,
    NCO,
    LCO,
    CD,
    C,
    NSD,
    LSD,
    NS,
    LS,
    SD,
    S,
    HND,
    LD,
    GFO,
    GO,
    GD,
    NFO,
    N,
    LFO,
    L,
    G
  >,
  // Algorithm
  A extends Algorithm<
    CFO,
    NCO,
    LCO,
    CD,
    C,
    NSD,
    LSD,
    NS,
    LS,
    SD,
    S,
    HND,
    LD,
    GFO,
    GO,
    GD,
    NFO,
    N,
    LFO,
    L,
    G
  >,
> {
  // ...
}
```

#### Fixing with Contextual Typing

I have on my todo list to replace this extensive generic typing using context
types instead. This would allow TypeScript to infer the types based on the
context, similar to how Rust does it, which would greatly simplify the type
definitions.

I have a parked branch where I've started this work, and the initial results are
promising. Here's an example of how the `Population` class could be defined
using contextual typing:

```ts
export class Population<Ctx extends AlgorithmContext> {
  // ...
}
```

## Extensibility Versus Usability

The original source code was designed to be extendible so that you could swap
out key components of the algorithm quickly, which suited the experimental needs
of the original implementer. This is a feature that I found quite compelling.
The final TypeScript code builds on that extensible base, and it is possible to,
for instance, replace the async `WorkerEvaluator` with an imaginary
`RESTEvaluator` to move the evaluation of populations to a backend service. You
could also replace the default `DatasetEnvironment` with an imaginary
`GameEnvironment` that gets data from a game state instead of a CSV file.

The downside to all of this extensibility is that it's not very easy to use this
library without fully understanding how all of it works.

The upside is that if you wanted to actually use this in your project, you might
redefine key aspects of the system, such as your training environment (maybe a
`DatabaseEnvironment` or a `RESTEnvironment`) and how your population is
evaluated. These hooks are crucial for using NEAT for any practical purposes but
obviously poses a huge barrier to entry.

### Barebones Example

Here you can see a barebones example of running the plain NEAT algorithm with
all default options.

```ts
import { defaultNEATConfigOptions } from "@neat-evolution/core";
import {
  DatasetEnvironment,
  defaultDatasetOptions,
  loadDataset,
} from "@neat-evolution/dataset-environment";
import { createEvaluator } from "@neat-evolution/evaluator";
import {
  createReproducer,
  defaultEvolutionOptions,
  defaultPopulationOptions,
} from "@neat-evolution/evolution";
import {
  defaultNEATGenomeOptions,
  neat,
  NEATAlgorithm,
} from "@neat-evolution/neat";

async function runNeatExample() {
  // 1. Setup the environment (e.g., a dataset environment)

  const datasetOptions = {
    ...defaultDatasetOptions,
    dataset: "./path/to/your/dataset.txt",
  };

  const dataset = await loadDataset(datasetOptions);

  const environment = new DatasetEnvironment(dataset);

  // 2. Create an evaluator

  const evaluator = createEvaluator(NEATAlgorithm, environment, null); // null for executor if not needed directly

  // 3. Define evolution options

  const evolutionOptions = { ...defaultEvolutionOptions, iterations: 100 };

  // 4. Define NEAT-specific configuration

  const neatConfigOptions = { ...defaultNEATConfigOptions };

  // 5. Define population options

  const populationOptions = { ...defaultPopulationOptions };

  // 6. Define genome options

  const genomeOptions = { ...defaultNEATGenomeOptions };

  // 7. Run the NEAT algorithm

  const bestGenome = await neat(
    createReproducer,
    evaluator,
    evolutionOptions,
    neatConfigOptions,
    populationOptions,
    genomeOptions,
  );

  console.log("Best genome found:", bestGenome);
}

runNeatExample();
```

## Next Steps

There is still a lot of work to be done. The forthcoming tic-tac-toe example
uncovered several edges cases and bugs that needed to be addressed to get it
working smoothly with build tools like vite. The type system needs to be
overhauled to use contextual typing to make it easier to work with. I need to do
a more thorough review of ES-HyperNEAT and DES-HyperNEAT to ensure that they are
implemented correctly as those parts of the code were not tested as thoroughly.
ES-HyperNEAT seems curiously slow.

There is also an opportunity to simplify the boilerplate considerably by
providing a `PopulationManager` that encapsulates much of the setup work. This
would make it easier to get started with the library, choosing sensible defaults
for most options and allowing users to override the parts that they need. In
practice, most users would only want to provide a custom `Environment` and
override some default options.

## Conclusion

This was a really fun project and totally scratched an itch for me. For many
years I'd been thinking about the NEAT algorithm, as it seemed like a far
superior solution to hand-crafting a neural network using TensorFlow. Numerous
times I'd started a weekend project to experiment with NEAT and hit roadblocks,
such as the existing solutions not being very extensible or the best solutions
all being in Python.

Genetic algorithms like NEAT are a bit of a honeypot for people who are new to
neural networks. The promise of a self-building neural network that is optimized
for the use case -- using the _power of evolution_ -- seems appealing compared
to hand-crafting an arbitrary neural network architecture. Of course, the
reality is that NEAT is not a silver bullet. It has its own set of challenges
and limitations. For instance, NEAT can be computationally expensive, is prone
to overfitting and is heavily reliant on your fitness function. Any imprecisions
in the fitness function will lead to a network that doesn't train well.

The more advanced NEAT variants, like HyperNEAT, ES-HyperNEAT and DES-HyperNEAT,
are generally not much better than NEAT in most cases. They are focused on
helping to train more complex and deeper networks but they are slower to train.
For most examples, plain NEAT will train faster and achieve similar results.
