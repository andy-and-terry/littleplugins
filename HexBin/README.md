# HexBin

Hexagonal binning renderer — aggregate dense scatter points into hex cells.

## Install
```html
<script src="hexbin.js"></script>
```

## Usage
```js
const { HexBin } = window.HexBin || require('./hexbin');

const chart = new HexBin('#canvas', {
  radius: 20,
  colorLow:  [13, 13, 26],
  colorHigh: [74, 170, 255]
});

// Each point has x and y in canvas pixels
const points = Array.from({ length: 2000 }, () => ({
  x: Math.random() * 800,
  y: Math.random() * 600
}));

chart.setData(points);
chart.render();
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| radius | 20 | Hexagon radius (px) |
| colorLow | [13,13,26] | Empty bin colour (RGB) |
| colorHigh | [74,170,255] | Full bin colour (RGB) |

## License
MIT