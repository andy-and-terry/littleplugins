# SlopeGraph

Slopegraph renderer — compare ranked values at two time points with connecting lines.

## Install
```html
<script src="slopegraph.js"></script>
```

## Usage
```js
const { SlopeGraph } = window.SlopeGraph || require('./slopegraph');

const chart = new SlopeGraph('#canvas', {
  labelA: '2020',
  labelB: '2024'
});

chart.setData([
  { label: 'React',  a: 1, b: 1, color: '#4af' },
  { label: 'Vue',    a: 3, b: 2 },
  { label: 'Angular',a: 2, b: 4 },
  { label: 'Svelte', a: 6, b: 3 },
]);

chart.render();
```

## License
MIT