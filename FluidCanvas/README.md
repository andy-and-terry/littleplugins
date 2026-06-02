# FluidCanvas

Real-time Eulerian fluid simulation. Click and drag on canvas to add fluid.

## Install

```html
<script src="fluidcanvas.js"></script>
```

## Usage

```js
const { Fluid } = FluidCanvas;
const fluid = new Fluid('#canvas', { N: 64 });
fluid.start(); // drag mouse on canvas to interact
```

## Manual injection

```js
fluid.addDensity(32, 32, 100);   // add density at grid cell
fluid.addVelocity(32, 32, 5, -3); // add velocity
```

## Options

| Option | Default | Description |
|--------|---------|-------------|
| N | 64 | Grid size (higher = slower but smoother) |
| visc | 0.0001 | Viscosity |
| diff | 0.0001 | Diffusion rate |
| dt | 0.1 | Time step |
| iter | 4 | Solver iterations |

## License
MIT
