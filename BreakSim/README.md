# BreakSim

Voronoi-based fracture and shatter simulation for destructible objects.

## Install
```html
<script src="breaksim.js"></script>
```

## Usage
```js
const { Fracture } = BreakSim;

const fracture = new Fracture('#canvas');

// Break at coordinate (x, y)
canvas.addEventListener('click', e => {
  fracture.break(e.offsetX, e.offsetY, {
    pieces: 15,
    force: 300,
    gravity: 0.4,
    color: '#4af'
  });
});
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| pieces | 15 | Number of shards |
| force | 300 | Explosion force |
| gravity | 0.3 | Gravity on shards |
| color | '#4af' | Shard fill colour |

## License
MIT