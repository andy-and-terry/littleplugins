# ParticleGPU

GPU-accelerated particle system using WebGL. Handles 10,000+ particles smoothly.

## Install

```html
<script src="particlegpu.js"></script>
```

## Usage

```js
const { Emitter } = ParticleGPU;

const emitter = new Emitter('#canvas', {
  maxParticles: 10000,
  emitRate: 80,
  x: 400, y: 300,
  spread: 20,
  life: 100,
  gravity: 0.05,
  color: [1.0, 0.4, 0.0], // RGB 0-1
  size: 8
});

emitter.start();
```

## Move the emitter

```js
// Follow mouse
canvas.addEventListener('mousemove', e => {
  emitter.setPosition(e.offsetX, e.offsetY);
});
```

## Change colour live

```js
emitter.setColor(0.0, 0.8, 1.0); // cyan
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| maxParticles | 10000 | Buffer size |
| emitRate | 100 | Particles emitted per frame |
| life | 120 | Base particle lifetime (frames) |
| spread | 30 | Spawn spread radius |
| gravity | 0.05 | Downward acceleration |
| size | 8 | Base particle size (px) |
| color | [1,0.5,0] | RGB values 0–1 |

## License
MIT
