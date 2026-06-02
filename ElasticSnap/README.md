# ElasticSnap

Spring-based UI animation physics for smooth elastic transitions.

## Install
```html
<script src="elasticsnap.js"></script>
```

## 1D Spring (single value)
```js
const { Spring } = ElasticSnap;

const spring = new Spring({
  stiffness: 0.2,  // higher = snappier
  damping: 0.75,   // higher = less bouncy
  value: 0,
  onChange: v => {
    box.style.left = v + 'px';
  }
});

// Animate to target
spring.setTarget(300);

// Jump instantly
spring.setValue(0);
```

## 2D Spring (position)
```js
const { SpringVec2 } = ElasticSnap;

const pos = new SpringVec2({
  stiffness: 0.15,
  damping: 0.8,
  onChange: ({ x, y }) => {
    el.style.transform = `translate(${x}px, ${y}px)`;
  }
});

pos.setTarget(mouseX, mouseY);
```

## License
MIT