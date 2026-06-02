# GestureKit

Unified gesture engine: tap, double-tap, swipe, pinch, rotate, pan, long-press.
Works on touch and mouse.

## Install

```html
<script src="gesturekit.js"></script>
```

## Usage

```js
const { Recognizer } = GestureKit;

const g = new Recognizer('#myElement');

g.on('tap',       e => console.log('tapped', e.x, e.y));
g.on('doubletap', e => console.log('double tap'));
g.on('swipe',     e => console.log('swipe', e.direction)); // left/right/up/down
g.on('pinch',     e => console.log('scale', e.scale));
g.on('rotate',    e => console.log('angle', e.angle));
g.on('pan',       e => console.log('panning', e.dx, e.dy));
g.on('longpress', e => console.log('long press'));
```

## Options

```js
const g = new Recognizer('#el', {
  swipeThreshold: 50,   // min px to count as swipe
  longPressDelay: 600,  // ms before longpress fires
  tapGap: 300           // ms window for double-tap
});
```

## Remove listener

```js
const handler = e => console.log(e);
g.on('tap', handler);
g.off('tap', handler);
```

## License
MIT
