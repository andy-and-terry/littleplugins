# GraphCanvas

Force-directed graph layout engine. Interactive, draggable nodes on canvas.

## Install

```html
<script src="graphcanvas.js"></script>
```

## Usage

```js
const { Graph } = GraphCanvas;
const graph = new Graph('#canvas');

graph.addNode('a', { label: 'Alice', color: '#f66' });
graph.addNode('b', { label: 'Bob',   color: '#4af' });
graph.addNode('c', { label: 'Carol', color: '#4f8' });

graph.addEdge('a', 'b', { length: 120 });
graph.addEdge('b', 'c', { length: 80, label: 'knows' });
graph.addEdge('a', 'c');

graph.start();
```

## Node Options

| Option | Default | Description |
|--------|---------|-------------|
| label | id | Display label |
| color | '#4af' | Fill colour |
| radius | 12 | Node radius |
| x, y | random | Initial position |

## Graph Options

| Option | Default | Description |
|--------|---------|-------------|
| repulsion | 3000 | Node repulsion strength |
| damping | 0.85 | Velocity damping |
| gravity | 0.05 | Pull toward center |

## Drag
Nodes are draggable by mouse out of the box.

## License
MIT
