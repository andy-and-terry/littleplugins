# NavMesh2D

Polygon navmesh pathfinding with line-of-sight and A* routing.

## Install
```html
<script src="navmesh2d.js"></script>
```

## Usage
```js
const { NavMesh } = NavMesh2D;

const nav = new NavMesh();

// Define walkable area as polygon points
nav.setWalkable([[0,0],[600,0],[600,400],[0,400]]);

// Add obstacles
nav.addObstacle([[100,100],[200,100],[200,200],[100,200]]);
nav.addObstacle([[350,50],[450,50],[450,300],[350,300]]);

// Build the nav graph (grid size = 30px)
nav.build(30);

// Find path from start to end
const path = nav.findPath(50, 50, 550, 350);
// path = [{ x, y }, ...]

// Draw the path
if (path) {
  ctx.beginPath();
  ctx.moveTo(path[0].x, path[0].y);
  path.forEach(p => ctx.lineTo(p.x, p.y));
  ctx.stroke();
}

// Debug view
nav.renderDebug(ctx);
```

## License
MIT
