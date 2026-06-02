# DragPhysics

Drag and drop with momentum, throw velocity, and spring snap-to-target.

## Install
```html
<script src="dragphysics.js"></script>
```

## Usage
```js
const { Draggable } = DragPhysics;

const card = new Draggable('#card', {
  friction: 0.92,        // momentum decay (0–1)
  springStrength: 0.15,  // snap spring force
  snapRadius: 80         // snap detection radius (px)
});
```

## Snap targets
```js
// Snap to fixed coordinates
card.addSnapTarget(200, 300);

// Snap to another element's position
const slot = document.getElementById('slot');
const rect = slot.getBoundingClientRect();
card.addSnapTarget(rect.left, rect.top);
```

## Events
```js
const card = new Draggable('#card', {
  onSnap: target => console.log('snapped to', target),
  onThrow: ({ vx, vy }) => console.log('thrown', vx, vy)
});
```

## License
MIT
