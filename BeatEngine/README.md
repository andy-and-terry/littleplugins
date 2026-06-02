# BeatEngine

Step sequencer with swing and per-track callbacks.

## Install
```html
<script src="beatengine.js"></script>
```

## Usage
```js
const { Sequencer } = BeatEngine;
const seq = new Sequencer({ bpm: 128, steps: 16, swing: 20 });

seq.addTrack('kick',  { pitch: 80,  type: 'sine' });
seq.addTrack('snare', { pitch: 200, type: 'square' });

seq.setPattern('kick',  [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0]);
seq.setPattern('snare', [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0]);

seq.start();
// seq.stop();
```

## Toggle steps live
```js
seq.toggleStep('kick', 4);
seq.setStep('snare', 8, true);
```

## Step callback
```js
const seq = new Sequencer({ bpm: 120, onStep: step => highlightUI(step) });
```

## License
MIT
