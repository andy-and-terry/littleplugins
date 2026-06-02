# ToneGraph

Node-based Web Audio API graph builder. Chain audio nodes with a clean API.

## Install

```html
<script src="tonegraph.js"></script>
```

## Usage

```js
const { Graph } = ToneGraph;
const graph = new Graph();

// Build: oscillator → gain → output
const osc  = graph.add('oscillator', { wave: 'sine', frequency: 440 });
const gain = graph.add('gain', { gain: 0.5 });

osc.connect(gain).connect(graph.destination());

// Start/stop
graph.resume();
osc.start();
osc.stop(2); // stop after 2 seconds
```

## Node Types

| Type | Key Options |
|------|-------------|
| oscillator | wave, frequency |
| gain | gain |
| filter | filterType, frequency, Q |
| delay | delayTime, maxDelay |
| analyser | fftSize |
| compressor | — |

## Ramp Parameters

```js
gain.set('gain', 0, 1.5); // fade to 0 over 1.5s
osc.set('frequency', 880, 0.5); // pitch up over 0.5s
```

## Analyser

```js
const analyser = graph.add('analyser', { fftSize: 512 });
osc.connect(analyser).connect(graph.destination());
const data = analyser.getData(); // Uint8Array of frequency data
```

## License
MIT
