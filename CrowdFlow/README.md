# CrowdFlow

Steering behaviour library: flocking, separation, alignment, cohesion, seek, arrive.

## Install

```html
<script src="crowdflow.js"></script>
```

## Quick Flock

```js
const { Flock } = CrowdFlow;

const flock = new Flock('#canvas', {
  weights: { separate: 1.5, align: 1.0, cohere: 1.0 }
});

flock.spawn(150, { maxSpeed: 2.5, color: '#4af' });
flock.start();
```

## Individual Agent Control

```js
const { Agent } = CrowdFlow;

const agent = new Agent({ x: 100, y: 100, maxSpeed: 3 });

// In your update loop:
const seekForce   = agent.seek({ x: mouseX, y: mouseY });
const fleeForce   = agent.flee({ x: threatX, y: threatY });
const arriveForce = agent.arrive({ x: 400, y: 300 }, 80); // slowRadius=80

agent.applyForce(seekForce);
agent.update({ w: canvas.width, h: canvas.height });
agent.render(ctx);
```

## Behaviours

| Method | Description |
|--------|-------------|
| seek(target) | Steer toward a point at max speed |
| flee(threat) | Steer away from a point |
| arrive(target, r) | Seek but slow within radius r |
| separate(agents) | Push away from nearby agents |
| align(agents) | Match velocity of nearby agents |
| cohere(agents) | Steer toward group center |
| flock(agents) | All three combined |

## License
MIT
