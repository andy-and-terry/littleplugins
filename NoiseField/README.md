# NoiseField

Perlin/Simplex noise field renderer with animated colour and flow modes.

## Install

```html
<script src="noisefield.js"></script>
```

## Colour Mode

Renders animated noise as a colour gradient.

```js
const { Field } = NoiseField;

const field = new Field('#canvas', {
  mode: 'color',
  scale: 0.005,
  speed: 0.002,
  colorA: [10, 10, 80],
  colorB: [0, 200, 180],
  octaves: 4
});

field.start();
```

## Flow Mode

Renders noise-driven particle flow field.

```js
const field = new Field('#canvas', {
  mode: 'flow',
  scale: 0.003,
  particleCount: 800
});

field.start();
```

## Raw Noise

```js
const { perlin2, fbm } = NoiseField;

const val = perlin2(1.5, 2.3);           // -1 to 1
const smooth = fbm(x, y, 4, 2.0, 0.5);  // fractional brownian motion
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| scale | 0.005 | Noise zoom level |
| speed | 0.002 | Animation speed |
| octaves | 4 | FBM octave count |
| colorA | [20,20,80] | Low colour (RGB) |
| colorB | [0,200,200] | High colour (RGB) |
| mode | 'color' | 'color' or 'flow' |
| particleCount | 500 | Particles for flow mode |

## License
MIT
