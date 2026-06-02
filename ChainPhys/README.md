# ChainPhys

Rope and chain simulation with Verlet integration, anchor points, and stiffness.

## Install
```html
<script src="chainphys.js"></script>
```

## Usage
```js
const { Chain } = ChainPhys;

const rope = new Chain({
  x: 300, y: 50,
  segments: 20,
  segLen: 15,
  gravity: 0.5,
  stiffness: 1
});

// First point is pinned by default
// Move the anchor
rope.setPos(0, mouseX, mouseY);

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  rope.update();
  rope.render(ctx);
  requestAnimationFrame(loop);
}
loop();
```

## Pin both ends (bridge)
```js
const bridge = new Chain({ x: 100, y: 200, segments: 30, pinEnd: true });
bridge.pin(0, 100, 200);
bridge.pin(30, 500, 200);
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| segments | 20 | Number of links |
| segLen | 15 | Rest length per link |
| gravity | 0.5 | Gravity per step |
| stiffness | 1 | Constraint stiffness |
| iterations | 20 | Solver accuracy |
| damping | 0.98 | Velocity damping |

## License
MIT
