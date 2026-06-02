# PitchShift

Real-time pitch shifting for audio elements or microphone input.

## Install
```html
<script src="pitchshift.js"></script>
```

## Usage
```js
const { PitchShift } = window.PitchShift || require('./pitchshift');

const shifter = new PitchShift();

// Connect audio element
const audio = document.getElementById('audio');
shifter.connectElement(audio);

// Or microphone
await shifter.connectMic();
```

## Set pitch
```js
shifter.setSemitones(+7);   // up a fifth
shifter.setSemitones(-12);  // down an octave
shifter.setSemitones(0);    // original pitch

// Or raw ratio
shifter.setRatio(1.5);   // 1.5x frequency
shifter.setRatio(0.5);   // half frequency
```

## Notes
- Uses a ScriptProcessorNode with linear interpolation resampling
- `setSemitones` range: approximately -24 to +24

## License
MIT