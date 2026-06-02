# ViolinPlot

Violin plot + box plot combined renderer — shows distribution shape and quartiles.

## Install
```html
<script src="violinplot.js"></script>
```

## Usage
```js
const { ViolinPlot } = window.ViolinPlot || require('./violinplot');

const plot = new ViolinPlot('#canvas', { bandwidth: 5 });

plot.setData([
  { label: 'Group A', data: [23,34,45,56,45,34,23,67,56,45,78], color: '#4af' },
  { label: 'Group B', data: [10,20,50,60,70,55,45,30,65,40,80] },
  { label: 'Group C', data: [40,42,43,44,45,46,47,48,49,50,51] },
]);

plot.render();
```

## License
MIT