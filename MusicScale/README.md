# MusicScale

Music theory engine — scales, chords, and progressions as playable data.

## Install
```html
<script src="musicscale.js"></script>
```

## Scales
```js
MusicScale.scale('C', 'major');
// ['C', 'D', 'E', 'F', 'G', 'A', 'B']

MusicScale.scale('A', 'minor');
MusicScale.scale('D', 'pentatonic');
MusicScale.scale('E', 'blues');
```

## Chords
```js
MusicScale.chord('G', 'major');   // ['G', 'B', 'D']
MusicScale.chord('A', 'min7');    // ['A', 'C', 'E', 'G']
MusicScale.chord('C', 'maj7');    // ['C', 'E', 'G', 'B']
```

## Progressions
```js
// Returns array of chord note arrays
MusicScale.progression('C', 'I_V_vi_IV', 'major');
```

## Play chords
```js
const audioCtx = new AudioContext();
MusicScale.playChord(audioCtx, ['C', 'E', 'G'], 4, 0, 1.0);
```

## Available scales
`major` `minor` `dorian` `mixolydian` `pentatonic` `blues` `chromatic`

## Available chords
`major` `minor` `dim` `aug` `maj7` `min7` `dom7` `sus4` `sus2`

## License
MIT