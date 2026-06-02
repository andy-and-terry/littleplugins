# StreamChart

Real-time streaming data chart with fixed window and auto-scroll.

## Install
```html
<script src="streamchart.js"></script>
```

## Usage
```js
const { Chart } = StreamChart;

const chart = new Chart('#canvas', { window: 60 });

chart.addSeries('cpu',  { color: '#4af', fill: true });
chart.addSeries('mem',  { color: '#f84' });

// Push data as it arrives
chart.start(); // auto re-renders every 100ms

setInterval(() => {
  chart.push('cpu', Math.random() * 100);
  chart.push('mem', 40 + Math.random() * 30);
}, 200);
```

## Manual render
```js
chart.push('cpu', value);
chart.render(); // render on demand
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| window | 100 | Visible data point count |
| autoScale | true | Auto fit Y axis |
| minY / maxY | 0/100 | Fixed Y range if autoScale is off |

## License
MIT
