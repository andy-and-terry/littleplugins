# SpriteFlow

Frame-by-frame sprite animation engine with basic bone rigging support.

## Install

```html
<script src="spriteflow.js"></script>
```

## Spritesheet Animation

```js
const { Spritesheet, Sprite } = SpriteFlow;

// Load a spritesheet (each frame is 64×64)
const sheet = new Spritesheet('hero.png', 64, 64);

const sprite = new Sprite(sheet, { x: 100, y: 100 });

// Define animations (frame indices from the sheet)
sprite.addAnimation({ name: 'idle', frames: [0, 1, 2, 3], fps: 8 });
sprite.addAnimation({ name: 'run',  frames: [4, 5, 6, 7, 8, 9], fps: 12 });
sprite.addAnimation({ name: 'jump', frames: [10, 11, 12], fps: 10, loop: false });

sprite.play('run');

let last = 0;
function loop(ts) {
  const dt = (ts - last) / 1000; last = ts;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  sprite.update(dt);
  sprite.render(ctx);
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
```

## Switch Animations

```js
sprite.play('jump');

// On complete callback
sprite.addAnimation({
  name: 'die', frames: [20,21,22,23], fps: 8, loop: false,
  onComplete: () => console.log('dead')
});
```

## Bone Rig

```js
const { Bone } = SpriteFlow;

const root = new Bone('body', { x: 200, y: 200, length: 60 });
const arm  = new Bone('arm',  { x: 60, y: 0, length: 40 });
root.addChild(arm);

// Animate by setting angle each frame
arm.angle = Math.sin(Date.now() / 300) * 0.5;

root.render(ctx);
```

## License
MIT
