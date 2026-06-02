# FractalKit

Real-time Mandelbrot and Julia set renderer using WebGL with smooth colouring.

## Install
```html
<script src="fractalkit.js"></script>
```

## Usage
```js
const { Renderer } = FractalKit;

const fractal = new Renderer('#canvas', {
  cx: -0.5, cy: 0,  // initial center
  zoom: 1,
  iter: 100          // max iterations (higher = more detail)
});

fractal.render();
```

## Interaction
- **Scroll** to zoom in/out at cursor
- **Drag** to pan

## Julia sets
```js
fractal.setJulia(-0.7, 0.27);  // c = -0.7 + 0.27i
fractal.setJulia(-0.4, 0.6);
fractal.setMandelbrot();        // back to Mandelbrot
```

## License
MIT