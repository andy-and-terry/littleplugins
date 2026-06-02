# VoiceCmd

Web Speech API command binder with fuzzy matching — no exact phrases needed.

## Install
```html
<script src="voicecmd.js"></script>
```

## Usage
```js
const { VoiceCmd } = window.VoiceCmd || require('./voicecmd');

const voice = new VoiceCmd({ threshold: 0.65, lang: 'en-US' });

voice.add('go home',     () => navigateTo('/'));
voice.add('open menu',   () => menu.open());
voice.add('scroll down', () => window.scrollBy(0, 300));
voice.add('stop',        () => voice.stop());

voice.start();
```

## Hear all transcripts
```js
const voice = new VoiceCmd({
  onResult: text => console.log('Heard:', text)
});
```

## Remove a command
```js
voice.remove('scroll down');
```

## Notes
- Requires a browser that supports `SpeechRecognition` (Chrome, Edge)
- User must grant microphone permission

## License
MIT