# BubbleMap

Proportional bubble chart — bubble size encodes data value.

## Install
```html
<script src="bubblemap.js"></script>
```

## Usage
```js
const { BubbleMap } = window.BubbleMap || require('./bubblemap');

const chart = new BubbleMap('#canvas', { maxRadius: 60, labeled: true });

chart.setData([
  { label: 'USA',    value: 330, color: '#4af' },
  { label: 'China',  value: 1400 },
  { label: 'Brazil', value: 215 },
  { label: 'India',  value: 1380 },
]);

chart.layout();
chart.render();
```

## Hover callback
```js
const chart = new BubbleMap('#canvas', {
  onHover: node => {
    if (node) console.log(node.label, node.value);
  }
});
```

## License
MIT