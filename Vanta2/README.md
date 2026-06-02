# Vanta2

Lightweight 2D scene graph with layers, camera, and dirty-rect rendering.

## Install

```html
<script src="vanta2.js"></script>
```

## Usage

```js
const { Scene } = Vanta2;

const scene = new Scene('#myCanvas', { bgColor: '#111' });

const layer = scene.addLayer('main');

// Add any object with a render(ctx, dt) method
layer.add({
  x: 100, y: 100,
  render(ctx, dt) {
    ctx.fillStyle = 'red';
    ctx.fillRect(this.x, this.y, 50, 50);
    this.x += 50 * dt; // move right 50px/sec
  }
});

scene.start();
```

## Camera

```js
scene.camera.moveTo(200, 200); // pan
scene.camera.zoomTo(2);        // zoom in 2x
scene.camera.rotation = 0.1;   // rotate scene
```

## Layers

```js
const bg = scene.addLayer('background');
const fg = scene.addLayer('foreground');
fg.alpha = 0.8;
fg.visible = false; // hide layer
```

## License
MIT
