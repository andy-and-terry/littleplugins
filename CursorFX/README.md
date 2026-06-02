# CursorFX

Custom cursor with trailing effect and magnetic snap to elements.

## Install
```html
<script src="cursorfx.js"></script>
```

## Usage
```js
const { Cursor } = CursorFX;

const cursor = new Cursor({
  trailLength: 20,
  trailColor: 'rgba(74,170,255,0.4)',
  trailWidth: 3,
  magnetRadius: 80,
  magnetStrength: 0.3
});
```

## Add magnetic elements
```js
// Cursor snaps toward these elements when nearby
cursor.addMagnetTarget('#button-1');
cursor.addMagnetTarget('.cta-button');
```

## Cleanup
```js
cursor.destroy(); // restores default cursor
```

## License
MIT