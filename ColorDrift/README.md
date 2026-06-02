# ColorDrift

Procedural colour palette animation engine — generates living colour swatches.

## Install
```html
<script src="colordrift.js"></script>
```

## Usage
```js
const { Palette } = ColorDrift;

const palette = new Palette('#canvas', {
  swatches: 6,
  speed: 0.3,
  saturation: 70,
  lightness: 55,
  spread: 60
});

palette.start();
```

## Get live hex colours
```js
const palette = new Palette('#canvas', {
  onUpdate: colors => {
    colors.forEach((c, i) => {
      document.getElementById(`swatch-${i}`).style.background = c.hex;
    });
  }
});
```

## Snapshot colours
```js
const colors = palette.getColors();
// [{ hue, s, l, rgb: [r,g,b], hex: '#rrggbb' }, ...]
```

## License
MIT
