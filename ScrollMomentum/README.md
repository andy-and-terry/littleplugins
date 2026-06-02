# ScrollMomentum

Inertial scroll with configurable friction for custom scroll containers.

## Install
```html
<script src="scrollmomentum.js"></script>
```

## Usage
```js
const { Scroller } = ScrollMomentum;

// Container must have overflow: auto/scroll and fixed dimensions
const scroller = new Scroller('#my-container', {
  friction: 0.92,    // 0.8 = fast stop, 0.98 = long glide
  speedMult: 1,
  vertical: true,
  horizontal: false
});
```

## Programmatic scroll
```js
scroller.scrollTo(0, 500, true); // smooth
scroller.scrollTo(0, 0, false);  // instant
```

## Scroll callback
```js
const scroller = new Scroller('#el', {
  onScroll: ({ scrollTop, scrollLeft }) => {
    console.log('scrolled to', scrollTop);
  }
});
```

## Stop inertia
```js
scroller.stop();
```

## License
MIT
