# EchoTrail

Multi-tap delay engine for Web Audio with feedback and per-tap filtering.

## Install
```html
<script src="echotrail.js"></script>
```

## Usage
```js
const { Delay } = EchoTrail;
const echo = new Delay();

echo
  .addTap({ time: 0.25, volume: 0.6, filterFreq: 4000 })
  .addTap({ time: 0.5,  volume: 0.4, filterFreq: 2000, feedback: 0.3 })
  .addTap({ time: 0.75, volume: 0.2, filterFreq: 1000 });

// Connect to an audio element
const audio = document.getElementById('audio');
echo.connect(audio);

// Or microphone
await echo.connectMic();
```

## Adjust live
```js
echo.setTap(0, 'time', 0.3);
echo.setTap(1, 'volume', 0.5);
echo.setTap(2, 'filterFreq', 800);
```

## License
MIT