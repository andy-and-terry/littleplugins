# TiltDevice

DeviceOrientation API abstraction — use phone tilt and rotation to drive UI.

## Install
```html
<script src="tiltdevice.js"></script>
```

## Usage
```js
const { TiltDevice } = window.TiltDevice || require('./tiltdevice');

const tilt = new TiltDevice({
  deadzone: 2,       // degrees before firing
  smoothing: 0.15,   // lerp factor (0=instant, 1=frozen)
  maxTilt: 45        // degrees at which x/y = ±1
});

tilt.on('tilt', ({ x, y }) => {
  // x: -1 (left) to 1 (right)
  // y: -1 (forward) to 1 (backward)
  ball.style.left = (50 + x * 40) + '%';
  ball.style.top  = (50 + y * 40) + '%';
});

tilt.on('shake', ({ direction }) => console.log('shook', direction));
tilt.on('error', e => console.warn(e.message));

await tilt.start(); // iOS 13+ requires a user gesture before this
```

## Notes
- On iOS 13+, call `tilt.start()` inside a click handler to trigger the permission prompt.

## License
MIT