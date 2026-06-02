# WheelDrive

Arcade vehicle physics with suspension, steering, and grip simulation.

## Install
```html
<script src="wheeldrive.js"></script>
```

## Usage
```js
const { Vehicle, InputController } = WheelDrive;

const car = new Vehicle({ x: 300, y: 300, color: '#f84' });
const input = new InputController(); // WASD or Arrow keys

function loop() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  car.update(input);
  car.wrapBounds(canvas.width, canvas.height);
  car.render(ctx);
  requestAnimationFrame(loop);
}
loop();
```

## Custom input
```js
car.update({ up: true, down: false, left: false, right: true });
```

## Options
| Option | Default | Description |
|--------|---------|-------------|
| maxSpeed | 5 | Max speed |
| acceleration | 0.15 | Acceleration rate |
| friction | 0.96 | Speed decay |
| grip | 0.85 | Tyre grip (0=slidy, 1=tight) |
| maxSteer | 0.05 | Max turning angle per frame |

## License
MIT
