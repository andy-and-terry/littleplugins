/*!
 * RigidJS - 2D Rigid Body Physics
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RigidJS = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const V = {
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
    scale: (a, s) => ({ x: a.x * s, y: a.y * s }),
    dot: (a, b) => a.x * b.x + a.y * b.y,
    len: a => Math.sqrt(a.x * a.x + a.y * a.y),
    norm: a => { const l = V.len(a) || 1; return { x: a.x / l, y: a.y / l }; },
    perp: a => ({ x: -a.y, y: a.x }),
  };

  class Body {
    constructor(options = {}) {
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.vx = 0; this.vy = 0;
      this.angle = 0; this.angularVel = 0;
      this.mass = options.mass || 1;
      this.invMass = this.mass === Infinity ? 0 : 1 / this.mass;
      this.restitution = options.restitution !== undefined ? options.restitution : 0.5;
      this.friction = options.friction !== undefined ? options.friction : 0.3;
      this.shape = options.shape || 'circle';
      this.radius = options.radius || 20;
      this.width = options.width || 40;
      this.height = options.height || 40;
      this.isStatic = options.isStatic || false;
      if (this.isStatic) this.invMass = 0;
      this.userData = options.userData || {};
    }

    applyForce(fx, fy) {
      this.vx += fx * this.invMass;
      this.vy += fy * this.invMass;
    }

    integrate(dt) {
      if (this.isStatic) return;
      this.x += this.vx * dt;
      this.y += this.vy * dt;
      this.angle += this.angularVel * dt;
    }
  }

  class World {
    constructor(options = {}) {
      this.bodies = [];
      this.gravity = { x: options.gravityX || 0, y: options.gravityY || 980 };
      this.iterations = options.iterations || 5;
    }

    addBody(options) {
      const b = new Body(options);
      this.bodies.push(b);
      return b;
    }

    removeBody(body) { this.bodies = this.bodies.filter(b => b !== body); }

    _circleCircle(a, b) {
      const dx = b.x - a.x, dy = b.y - a.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const minDist = a.radius + b.radius;
      if (dist >= minDist) return null;
      const overlap = minDist - dist;
      const nx = dist ? dx / dist : 1, ny = dist ? dy / dist : 0;
      return { nx, ny, overlap, a, b };
    }

    _resolveCollision(c) {
      const { a, b, nx, ny, overlap } = c;
      const totalInvMass = a.invMass + b.invMass;
      if (totalInvMass === 0) return;
      const correction = overlap / totalInvMass * 0.8;
      a.x -= nx * correction * a.invMass;
      a.y -= ny * correction * a.invMass;
      b.x += nx * correction * b.invMass;
      b.y += ny * correction * b.invMass;
      const rvx = b.vx - a.vx, rvy = b.vy - a.vy;
      const velAlongNormal = rvx * nx + rvy * ny;
      if (velAlongNormal > 0) return;
      const e = Math.min(a.restitution, b.restitution);
      const j = -(1 + e) * velAlongNormal / totalInvMass;
      a.vx -= j * nx * a.invMass;
      a.vy -= j * ny * a.invMass;
      b.vx += j * nx * b.invMass;
      b.vy += j * ny * b.invMass;
    }

    step(dt) {
      const bodies = this.bodies;
      for (const b of bodies) {
        if (!b.isStatic) {
          b.vx += this.gravity.x * dt;
          b.vy += this.gravity.y * dt;
          b.integrate(dt);
        }
      }
      for (let i = 0; i < bodies.length; i++) {
        for (let j = i + 1; j < bodies.length; j++) {
          const a = bodies[i], b = bodies[j];
          if (a.shape === 'circle' && b.shape === 'circle') {
            const col = this._circleCircle(a, b);
            if (col) this._resolveCollision(col);
          }
        }
      }
    }

    render(ctx) {
      for (const b of this.bodies) {
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.angle);
        ctx.strokeStyle = b.isStatic ? '#888' : '#4af';
        ctx.lineWidth = 2;
        if (b.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(0, 0, b.radius, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(b.radius, 0);
          ctx.stroke();
        } else {
          ctx.strokeRect(-b.width / 2, -b.height / 2, b.width, b.height);
        }
        ctx.restore();
      }
    }
  }

  return { World, Body };
});
