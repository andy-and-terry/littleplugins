/*!
 * RayLight - 2D ray casting light/shadow engine
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.RayLight = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  function intersect(ax, ay, bx, by, cx, cy, dx, dy) {
    const r = bx - ax, s = dx - cx, t = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx));
    const denom = r * (dy - cy) - s * (bx - ax);
    if (Math.abs(denom) < 1e-10) return null;
    const u = ((cx - ax) * s - (cy - ay) * r) / denom;
    const v = t / denom; // recompute properly
    // proper ray-segment: parametric
    const d2 = r * (dy - cy) - (bx - ax) * s;
    if (Math.abs(d2) < 1e-10) return null;
    const u2 = ((cx - ax) * (dy - cy) - (cy - ay) * (dx - cx)) / d2;
    const v2 = ((cx - ax) * (by - ay) - (cy - ay) * (bx - ax)) / d2;
    if (u2 >= 0 && v2 >= 0 && v2 <= 1) return { x: ax + u2 * (bx - ax), y: ay + u2 * (by - ay), t: u2 };
    return null;
  }

  class Light {
    constructor(options = {}) {
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.color = options.color || 'rgba(255,220,100,0.8)';
      this.radius = options.radius || 300;
      this.rays = options.rays || 360;
      this.softness = options.softness || 3;
    }
  }

  class Scene {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      this.ctx = this.canvas.getContext('2d');
      this.lights = [];
      this.walls = [];
      this.ambientColor = options.ambientColor || 'rgba(0,0,0,0.85)';
      this._offscreen = document.createElement('canvas');
      this._offscreen.width = this.canvas.width;
      this._offscreen.height = this.canvas.height;
      this._octx = this._offscreen.getContext('2d');
    }

    addLight(options) {
      const l = new Light(options);
      this.lights.push(l);
      return l;
    }

    addWall(x1, y1, x2, y2) {
      this.walls.push({ x1, y1, x2, y2 });
      return this;
    }

    addRect(x, y, w, h) {
      this.addWall(x, y, x + w, y);
      this.addWall(x + w, y, x + w, y + h);
      this.addWall(x + w, y + h, x, y + h);
      this.addWall(x, y + h, x, y);
      return this;
    }

    _castRays(light) {
      const angles = [];
      for (const w of this.walls) {
        for (const pt of [[w.x1, w.y1], [w.x2, w.y2]]) {
          const a = Math.atan2(pt[1] - light.y, pt[0] - light.x);
          angles.push(a - 0.0001, a, a + 0.0001);
        }
      }
      // Add boundary angles
      const { width, height } = this.canvas;
      const corners = [[0, 0], [width, 0], [width, height], [0, height]];
      for (const c of corners) angles.push(Math.atan2(c[1] - light.y, c[0] - light.x));

      const boundary = [
        { x1: 0, y1: 0, x2: width, y2: 0 },
        { x1: width, y1: 0, x2: width, y2: height },
        { x1: width, y1: height, x2: 0, y2: height },
        { x1: 0, y1: height, x2: 0, y2: 0 },
      ];
      const allWalls = [...this.walls, ...boundary];

      const points = angles.map(angle => {
        const dx = Math.cos(angle), dy = Math.sin(angle);
        let closest = null;
        for (const w of allWalls) {
          const hit = intersect(light.x, light.y, light.x + dx * light.radius, light.y + dy * light.radius, w.x1, w.y1, w.x2, w.y2);
          if (hit && (!closest || hit.t < closest.t)) closest = hit;
        }
        return closest || { x: light.x + dx * light.radius, y: light.y + dy * light.radius };
      });

      return points.sort((a, b) => Math.atan2(a.y - light.y, a.x - light.x) - Math.atan2(b.y - light.y, b.x - light.x));
    }

    render() {
      const { ctx, canvas, _octx, _offscreen } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Dark layer
      _octx.clearRect(0, 0, canvas.width, canvas.height);
      _octx.fillStyle = this.ambientColor;
      _octx.fillRect(0, 0, canvas.width, canvas.height);

      for (const light of this.lights) {
        const pts = this._castRays(light);
        const grd = _octx.createRadialGradient(light.x, light.y, 0, light.x, light.y, light.radius);
        grd.addColorStop(0, light.color);
        grd.addColorStop(1, 'rgba(0,0,0,0)');

        _octx.save();
        _octx.globalCompositeOperation = 'destination-out';
        _octx.beginPath();
        _octx.moveTo(pts[0].x, pts[0].y);
        for (const p of pts) _octx.lineTo(p.x, p.y);
        _octx.closePath();
        _octx.fillStyle = grd;
        _octx.fill();
        _octx.restore();
      }

      ctx.drawImage(_offscreen, 0, 0);

      // Draw walls
      ctx.strokeStyle = '#333';
      ctx.lineWidth = 2;
      for (const w of this.walls) {
        ctx.beginPath();
        ctx.moveTo(w.x1, w.y1);
        ctx.lineTo(w.x2, w.y2);
        ctx.stroke();
      }
    }
  }

  return { Scene, Light };
});
