# PointerTrail

Records and replays pointer paths with timing for UX analysis or effects.

## Install
```html
<script src="pointertrail.js"></script>
```

## Usage
```js
const { Trail } = PointerTrail;

const trail = new Trail(document.body, {
  color: 'rgba(74,170,255,0.6)',
  width: 3,
  maxLen: 80,
  fade: true
});

trail.start();
```

## Record and replay
```js
trail.record();

// ...user moves mouse...

const data = trail.stopRecord();
// data = [{ x, y, t }, ...]

trail.replay(data, 1.5); // replay at 1.5x speed
```

## License
MIT