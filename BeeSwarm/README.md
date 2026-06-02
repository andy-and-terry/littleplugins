# BeeSwarm

Beeswarm plot engine with collision-avoidance layout — spread dots along an axis without overlap.

## Install
```html
<script src="beeswarm.js"></script>
```

## Usage
```js
const { Swarm } = BeeSwarm;

const swarm = new Swarm('#canvas', {
  radius: 5,
  axis: 'x',          // 'x' or 'y'
  iterations: 150
});

swarm.setData([
  { value: 23, label: 'Alice', group: 0 },
  { value: 45, label: 'Bob',   group: 1 },
  { value: 31, label: 'Carol', group: 0 },
  // ...
]);

swarm.layout();
swarm.render();
```

## Custom colours
```js
const swarm = new Swarm('#canvas', {
  colors: ['#4af', '#f84', '#4f8'],
  colorFn: d => d.value > 50 ? '#f84' : '#4af'
});
```

## License
MIT