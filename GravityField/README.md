# GravityField

N-body gravitational simulation with orbital trails.

## Install
```html
<script src="gravityfield.js"></script>
```

## Usage
```js
const { Simulation } = GravityField;

const sim = new Simulation('#canvas', { G: 100, softening: 10 });

// Add a large central star
const star = sim.addBody({
  x: 400, y: 300,
  mass: 5000, radius: 20,
  color: '#ff8'
});

// Add orbiting planet
sim.addOrbitingBody(400, 300, 5000, 150, {
  mass: 10, radius: 8, color: '#4af', trailLen: 60
});

sim.start();
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| G | 100 | Gravitational constant |
| softening | 10 | Prevents singularity at close range |
| bgColor | rgba(0,0,0,0.1) | Trail fade color |

## License
MIT