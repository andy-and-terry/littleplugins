# ProceduralFX

Synthesises game sound effects from parameters — no audio files needed.

## Install
```html
<script src="proceduralfx.js"></script>
```

## Built-in presets
```js
ProceduralFX.shoot();
ProceduralFX.jump();
ProceduralFX.land();
ProceduralFX.explosion();
ProceduralFX.collect();
ProceduralFX.error();
ProceduralFX.powerup();
ProceduralFX.hit();
ProceduralFX.click();
```

## Custom sound
```js
ProceduralFX.custom({
  wave: 'sawtooth',    // sine | square | sawtooth | triangle
  startFreq: 400,      // starting pitch (Hz)
  endFreq: 100,        // ending pitch (Hz)
  duration: 0.3,       // seconds
  volume: 0.5,         // 0–1
  distortion: 3        // 0 = clean, 10 = very distorted
});
```

## License
MIT
