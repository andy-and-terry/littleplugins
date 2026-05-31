__        __   _                            _ 
\ \      / /__| | ___ ___  _ __ ___   ___  | |
 \ \ /\ / / _ \ |/ __/ _ \| '_ ` _ \ / _ \ | |
  \ V  V /  __/ | (_| (_) | | | | | |  __/ |_|
   \_/\_/ \___|_|\___\___/|_| |_| |_|\___| (_)
-----------------------------------------------
In this file, you will learn how to use the
HTML-compactible AmbiPan plugin [2026]
-----------------------------------------------
AmbiPan: 360° spatial audio panner — position sounds in 3D space around the listener.
-----------------------------------------------
1. Setup
To setup this plugin, you will need to import
the CSS file into your HTML document.
[RECOMMENDED]:
<script defer src="https://raw.githubusercontent.com/andy-and-terry/littleplugins/refs/heads/plugins-data/AmbiPan/ambipan.js"></script>
-----------------------------------------------
2. Usage
To use this, you have to use the following JS
function(s).
-----
2.1 USAGE
---
const { Panner } = AmbiPan;
const panner = new Panner();

// Create a source slot
panner.createSource('enemy');

// Position it in 3D space (x, y, z)
panner.setPosition('enemy', 5, 0, -3);

// Play a tone at that position
panner.playTone('enemy', 440, 1.0);

// Connect to an audio element
const audio = document.getElementById('sfx');
panner.connectElement('sound1', audio);
---
2.2 MOVE LISTENER
// position, then forward direction
panner.setListenerPosition(0, 0, 0,  0, 0, -1);
---
2.3 ANIMATE
```js
let angle = 0;
setInterval(() => {
  angle += 0.05;
  panner.setPosition('enemy', Math.cos(angle) * 5, 0, Math.sin(angle) * 5);
}, 50);
-----------------------------------------------
littleplugins 2026 • MIT license
