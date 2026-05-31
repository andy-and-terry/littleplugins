/*!
 * CrowdFlow - Steering behaviour library (flocking, avoidance, formation)
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.CrowdFlow = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const V = {
    add: (a, b) => ({ x: a.x + b.x, y: a.y + b.y }),
    sub: (a, b) => ({ x: a.x - b.x, y: a.y - b.y }),
    scale: (a, s) => ({ x: a.x * s, y: a.y * s }),
    len: a => Math.sqrt(a.x * a.x + a.y * a.y),
    norm: a => { const l = V.len(a) || 1; return { x: a.x / l, y: a.y / l }; },
    limit: (a, max) => { const l = V.len(a); return l > max ? V.scale(V.norm(a), max) : a; },
    dist: (a, b) => V.len(V.sub(a, b)),
    zero: () => ({ x: 0, y: 0 }),
    clone: a => ({ x: a.x, y: a.y }),
  };

  class Agent {
    constructor(options = {}) {
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.vx = (Math.random() - 0.5) * 2;
      this.vy = (Math.random() - 0.5) * 2;
      this.maxSpeed = options.maxSpeed || 2;
      this.maxForce = options.maxForce || 0.1;
      this.radius = options.radius || 5;
      this.color = options.color || '#4af';
      this.group = options.group || 0;
      this.target = null;
    }

    get pos() { return { x: this.x, y: this.y }; }
    get vel() { return { x: this.vx, y: this.vy }; }

    steer(desired) {
      const d = V.limit(desired, this.maxSpeed);
      return V.limit(V.sub(d, this.vel), this.maxForce);
    }

    seek(target) {
      const desired = V.scale(V.norm(V.sub(target, this.pos)), this.maxSpeed);
      return this.steer(desired);
    }

    flee(threat) {
      const f = this.seek(threat);
      return V.scale(f, -1);
    }

    arrive(target, slowRadius = 80) {
      const d = V.dist(this.pos, target);
      const speed = d < slowRadius ? this.maxSpeed * (d / slowRadius) : this.maxSpeed;
      const desired = V.scale(V.norm(V.sub(target, this.pos)), speed);
      return this.steer(desired);
    }

    separate(agents, range = 30) {
      let force = V.zero(), count = 0;
      for (const a of agents) {
        if (a === this) continue;
        const d = V.dist(this.pos, a.pos);
        if (d < range && d > 0) {
          const away = V.scale(V.norm(V.sub(this.pos, a.pos)), 1 / d);
          force = V.add(force, away);
          count++;
        }
      }
      if (count > 0) { force = V.scale(force, 1 / count); return this.steer(V.scale(V.norm(force), this.maxSpeed)); }
      return V.zero();
    }

    align(agents, range = 60) {
      let sum = V.zero(), count = 0;
      for (const a of agents) {
        if (a === this) continue;
        if (V.dist(this.pos, a.pos) < range) { sum = V.add(sum, a.vel); count++; }
      }
      if (count > 0) { sum = V.scale(sum, 1 / count); return this.steer(V.scale(V.norm(sum), this.maxSpeed)); }
      return V.zero();
    }

    cohere(agents, range = 80) {
      let center = V.zero(), count = 0;
      for (const a of agents) {
        if (a === this) continue;
        if (V.dist(this.pos, a.pos) < range) { center = V.add(center, a.pos); count++; }
      }
      if (count > 0) return this.seek(V.scale(center, 1 / count));
      return V.zero();
    }

    flock(agents, weights = { separate: 1.5, align: 1.0, cohere: 1.0 }) {
      const s = V.scale(this.separate(agents), weights.separate);
      const a = V.scale(this.align(agents), weights.align);
      const c = V.scale(this.cohere(agents), weights.cohere);
      return V.add(V.add(s, a), c);
    }

    applyForce(f) { this.vx += f.x; this.vy += f.y; }

    update(bounds) {
      const speed = V.len(this.vel);
      if (speed > this.maxSpeed) { this.vx = (this.vx / speed) * this.maxSpeed; this.vy = (this.vy / speed) * this.maxSpeed; }
      this.x += this.vx; this.y += this.vy;
      if (bounds) {
        if (this.x < 0) this.x += bounds.w;
        if (this.x > bounds.w) this.x -= bounds.w;
        if (this.y < 0) this.y += bounds.h;
        if (this.y > bounds.h) this.y -= bounds.h;
      }
    }

    render(ctx) {
      const angle = Math.atan2(this.vy, this.vx);
      ctx.save();
      ctx.translate(this.x, this.y);
      ctx.rotate(angle);
      ctx.fillStyle = this.color;
      ctx.beginPath();
      ctx.moveTo(this.radius * 2, 0);
      ctx.lineTo(-this.radius, this.radius);
      ctx.lineTo(-this.radius, -this.radius);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    }
  }

  class Flock {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      this.ctx = this.canvas.getContext('2d');
      this.agents = [];
      this.weights = options.weights || { separate: 1.5, align: 1.0, cohere: 1.0 };
      this._running = false;
    }

    spawn(n, options = {}) {
      for (let i = 0; i < n; i++) {
        this.agents.push(new Agent({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          ...options
        }));
      }
      return this;
    }

    step() {
      const bounds = { w: this.canvas.width, h: this.canvas.height };
      for (const agent of this.agents) {
        const f = agent.flock(this.agents, this.weights);
        agent.applyForce(f);
        agent.update(bounds);
      }
    }

    render() {
      const { ctx, canvas } = this;
      ctx.fillStyle = 'rgba(0,0,0,0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      for (const a of this.agents) a.render(ctx);
    }

    start() {
      this._running = true;
      const loop = () => { this.step(); this.render(); if (this._running) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }

    stop() { this._running = false; }
  }

  return { Flock, Agent };
});
