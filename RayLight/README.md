# RayLight

2D ray casting light and shadow engine for canvas.

## Install

```html
<script src="raylight.js"></script>
```

## Usage

```js
const { Scene } = RayLight;

const scene = new Scene('#canvas', {
  ambientColor: 'rgba(0,0,0,0.9)'
});

// Add a light
const light = scene.addLight({
  x: 300, y: 200,
  color: 'rgba(255,220,100,0.9)',
  radius: 250
});

// Add walls (x1,y1 → x2,y2)
scene.addWall(100, 100, 200, 100);
scene.addWall(200, 100, 200, 200);

// Add a rectangle obstacle
scene.addRect(300, 300, 80, 60);

// Render once or in a loop
function loop() {
  scene.render();
  requestAnimationFrame(loop);
}
loop();
```

## Move light with mouse

```js
canvas.addEventListener('mousemove', e => {
  light.x = e.offsetX;
  light.y = e.offsetY;
});
```

## Multiple lights

```js
scene.addLight({ x: 100, y: 100, color: 'rgba(255,80,80,0.8)', radius: 200 });
scene.addLight({ x: 500, y: 300, color: 'rgba(80,80,255,0.8)', radius: 300 });
```

## License
MIT
