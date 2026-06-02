# ReverbRoom

Convolution reverb with built-in impulse responses — add space to any audio source.

## Install
```html
<script src="reverbroom.js"></script>
```

## Usage
```js
const { Reverb } = ReverbRoom;

const reverb = new Reverb({ preset: 'hall', mix: 0.4 });

// Connect an audio element
const audio = document.getElementById('audio');
reverb.connect(audio);

// Or microphone
await reverb.connectMic();
```

## Change preset live
```js
reverb.setPreset('cave');    // long echo
reverb.setPreset('plate');   // dense, bright
reverb.setPreset('spring');  // springy
reverb.setPreset('none');    // dry

console.log(reverb.presets);
// ['hall', 'room', 'cave', 'plate', 'spring', 'none']
```

## Wet/dry mix
```js
reverb.setMix(0);   // fully dry
reverb.setMix(1);   // fully wet
reverb.setMix(0.3); // 30% reverb
```

## License
MIT