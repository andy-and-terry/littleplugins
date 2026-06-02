# TimelineViz

Zoomable, pannable timeline for event sequences.

## Install
```html
<script src="timelineviz.js"></script>
```

## Usage
```js
const { Timeline } = TimelineViz;
const tl = new Timeline('#canvas');

tl.addGroup('Video', 0);
tl.addGroup('Audio', 1);

tl.addEvent({ start: 0,   end: 5,  row: 0, label: 'Intro',    color: '#4af' });
tl.addEvent({ start: 5,   end: 12, row: 0, label: 'Scene 1',  color: '#f84' });
tl.addEvent({ start: 0,   end: 12, row: 1, label: 'Narration',color: '#4f8' });

tl.render();
```

## Interaction
- **Scroll** to zoom in/out
- **Drag** to pan left/right

## License
MIT
