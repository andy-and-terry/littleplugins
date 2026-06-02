# SelectionBox

Rubber-band multi-select — drag to select items on a canvas.

## Install
```html
<script src="selectionbox.js"></script>
```

## Usage
```js
const { SelectionBox } = window.SelectionBox || require('./selectionbox');

const sel = new SelectionBox('#canvas', {
  onSelect: items => console.log('Selected:', items.map(i => i.label))
});

sel.setItems([
  { x: 50,  y: 50,  w: 80, h: 60, label: 'Box A' },
  { x: 200, y: 80,  w: 80, h: 60, label: 'Box B' },
  { x: 100, y: 200, w: 80, h: 60, label: 'Box C' },
]);

sel.render();
```

## Programmatic selection
```js
sel.clearSelection();
const selected = sel.getSelected(); // array of selected items
```

## Notes
- Hold Shift to add to existing selection
- Items need `{ x, y, w, h }` properties

## License
MIT