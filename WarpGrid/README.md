# WarpGrid

Animated distortion grid for backgrounds and transitions.

## Install
```html
<script src="warpgrid.js"></script>
```

## Usage
```js
const { Grid } = WarpGrid;
const grid = new Grid('#canvas', {
  cols: 20, rows: 15,
  amplitude: 30, speed: 0.02,
  color: '#4af'
});
grid.start();
```

## Custom distortion function
```js
const grid = new Grid('#canvas', {
  distortFn: (x, y, t) => ({
    dx: Math.sin(y * 3 + t) * 40,
    dy: Math.cos(x * 2 + t) * 20
  })
});
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| cols | 20 | Grid columns |
| rows | 15 | Grid rows |
| amplitude | 30 | Distortion amount |
| speed | 0.02 | Animation speed |
| color | '#4af' | Line colour |

## License
MIT
