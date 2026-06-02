# RigidJS

2D rigid body physics with gravity, collision resolution, and friction.

## Install

```html
<script src="rigidjs.js"></script>
```

## Usage

```js
const { World } = RigidJS;

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const world = new World({ gravityY: 500 });

// Add a bouncy ball
const ball = world.addBody({ x: 200, y: 50, radius: 20, restitution: 0.8 });

// Add a static floor
world.addBody({ x: 200, y: 400, radius: 200, isStatic: true, restitution: 0.5 });

// Game loop
function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  world.step(1 / 60);
  world.render(ctx);
  requestAnimationFrame(loop);
}
loop();
```

## World Options

| Option | Default | Description |
|--------|---------|-------------|
| gravityX | 0 | Horizontal gravity |
| gravityY | 980 | Vertical gravity |
| iterations | 5 | Collision solver iterations |

## Body Options

| Option | Default | Description |
|--------|---------|-------------|
| mass | 1 | Body mass (Infinity = static) |
| restitution | 0.5 | Bounciness (0–1) |
| friction | 0.3 | Surface friction |
| isStatic | false | Immovable body |
| shape | 'circle' | 'circle' only currently |
| radius | 20 | Circle radius |

## License
MIT
