# PenInput

Stylus pressure and tilt API abstraction for drawing apps. Uses the Pointer Events API.

## Install
```html
<script src="peninput.js"></script>
```

## Usage
```js
const { PenInput } = window.PenInput || require('./peninput');

const pen = new PenInput('#canvas', {
  minWidth: 1,
  maxWidth: 20,
  color: '#fff',
  smoothing: 0.5   // 0 = no smoothing, 1 = very smooth
});
```

## Change colour
```js
pen.setColor('#f84');
pen.clear();
```

## Pressure data callback
```js
const pen = new PenInput('#canvas', {
  onDraw: ({ x, y, pressure, tiltX, tiltY, width }) => {
    console.log(`Drawing at (${x},${y}) pressure=${pressure}`);
  }
});
```

## Notes
- Works best with a real stylus (Surface Pen, Apple Pencil, Wacom)
- Falls back to mouse (pressure = 0.5) on non-stylus input

## License
MIT