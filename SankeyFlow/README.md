# SankeyFlow

Sankey diagram engine for flow and allocation data.

## Install
```html
<script src="sankeyflow.js"></script>
```

## Usage
```js
const { Sankey } = SankeyFlow;
const chart = new Sankey('#canvas');

chart.addNode('income', 'Income');
chart.addNode('tax',    'Tax');
chart.addNode('spend',  'Spending');
chart.addNode('save',   'Savings');

chart.addLink('income', 'tax',   300);
chart.addLink('income', 'spend', 500);
chart.addLink('income', 'save',  200);

chart.render();
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| nodeW | 20 | Node bar width |
| nodePad | 10 | Padding between nodes |
| colors | array | Node colour palette |

## License
MIT
