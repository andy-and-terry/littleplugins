# DrumSynth

Physically modelled drum synthesis — kick, snare, hihat, clap, tom. No samples needed.

## Install
```html
<script src="drumsynth.js"></script>
```

## Usage
```js
const { DrumSynth } = window.DrumSynth || require('./drumsynth');

const drums = new DrumSynth();

drums.kick();
drums.snare();
drums.hihat();
drums.hihat({ open: true });  // open hi-hat
drums.clap();
drums.tom({ freq: 90 });
```

## Custom tuning
```js
drums.kick({
  freq: 150,      // start pitch
  endFreq: 40,    // end pitch
  decay: 0.5,     // seconds
  volume: 0.9
});

drums.snare({
  tone: 200,
  filterFreq: 2500,
  decay: 0.25,
  volume: 0.6
});

drums.hihat({ freq: 12000, volume: 0.4 });
```

## License
MIT