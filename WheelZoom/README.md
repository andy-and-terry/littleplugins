# WheelZoom

Smooth pinch/wheel zoom and pan with momentum for any HTML element.

## Install
```html
<script src="wheelzoom.js"></script>
```

## Usage
```js
const { ZoomPan } = WheelZoom;

const zp = new ZoomPan('#myImage', {
  minZoom: 0.5,
  maxZoom: 8,
  friction: 0.92   // momentum friction (higher = longer glide)
});
```

## Programmatic zoom
```js
zp.zoomTo(2);           // zoom to 2x
zp.zoomTo(2, 400, 300); // zoom to 2x, centered at (400,300)
zp.reset();             // back to original
```

## Change callback
```js
const zp = new ZoomPan('#el', {
  onChange: ({ x, y, scale }) => console.log(scale)
});
```

## Notes
- Works with mouse wheel, click-drag, and two-finger pinch on touch
- Apply to a wrapper `div` containing an image, canvas, SVG, etc.

## License
MIT