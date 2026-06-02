# AudioMotion

Audio-reactive animation driver. Maps frequency bands to your animation properties.

## Install

```html
<script src="audiomotion.js"></script>
```

## From Microphone

```js
const { Reactor } = AudioMotion;
const reactor = new Reactor({ fftSize: 1024, smoothing: 0.8 });

await reactor.fromMic();

reactor.on('tick', ({ volume, bass, mid, treble, beat }) => {
  // All values are 0–1
  circle.radius = 50 + bass * 100;
  circle.color  = `hsl(${treble * 360}, 80%, 50%)`;
});

reactor.on('beat', () => {
  console.log('beat detected!');
  flash();
});

reactor.start();
```

## From Audio Element

```js
const audio = document.getElementById('myAudio');
reactor.fromElement(audio);
reactor.start();
```

## Tick Payload

| Property | Type | Description |
|----------|------|-------------|
| volume | 0–1 | Overall loudness |
| bass | 0–1 | 20–250 Hz energy |
| mid | 0–1 | 250–4000 Hz energy |
| treble | 0–1 | 4000–20000 Hz energy |
| beat | bool | True on beat detection |
| data | Uint8Array | Raw FFT data |
| history | object | Rolling 60-frame history per band |

## License
MIT
