/*!
 * NoiseField - Perlin/Simplex noise field renderer
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.NoiseField = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  // Permutation table
  const P = new Uint8Array(512);
  function seed(s) {
    let x = s || Math.random() * 65536;
    for (let i = 0; i < 256; i++) { x ^= x << 13; x ^= x >> 17; x ^= x << 5; P[i] = ((x >>> 0) & 0xff); }
    for (let i = 256; i < 512; i++) P[i] = P[i & 255];
  }
  seed(42);

  function fade(t) { return t * t * t * (t * (t * 6 - 15) + 10); }
  function lerp(a, b, t) { return a + t * (b - a); }
  function grad(h, x, y) { const u = h < 8 ? x : y, v = h < 4 ? y : h === 12 || h === 14 ? x : 0; return ((h & 1) ? -u : u) + ((h & 2) ? -v : v); }

  function perlin2(x, y) {
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = P[X] + Y, b = P[X + 1] + Y;
    return lerp(
      lerp(grad(P[a], x, y), grad(P[b], x - 1, y), u),
      lerp(grad(P[a + 1], x, y - 1), grad(P[b + 1], x - 1, y - 1), u),
      v
    );
  }

  function fbm(x, y, octaves = 4, lacunarity = 2, gain = 0.5) {
    let val = 0, amp = 0.5, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      val += perlin2(x * freq, y * freq) * amp;
      max += amp; amp *= gain; freq *= lacunarity;
    }
    return val / max;
  }

  class Field {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      this.ctx = this.canvas.getContext('2d');
      this.scale = options.scale || 0.005;
      this.octaves = options.octaves || 4;
      this.speed = options.speed || 0.002;
      this.colorA = options.colorA || [20, 20, 80];
      this.colorB = options.colorB || [0, 200, 200];
      this.time = 0;
      this._running = false;
      this.mode = options.mode || 'color'; // 'color' | 'flow'
      this.particles = [];
      if (this.mode === 'flow') this._initParticles(options.particleCount || 500);
    }

    _initParticles(n) {
      for (let i = 0; i < n; i++) {
        this.particles.push({
          x: Math.random() * this.canvas.width,
          y: Math.random() * this.canvas.height,
          age: 0, maxAge: 100 + Math.random() * 100
        });
      }
    }

    _lerpColor(a, b, t) {
      return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
    }

    renderColor() {
      const { canvas, ctx, scale, octaves, time, colorA, colorB } = this;
      const img = ctx.createImageData(canvas.width, canvas.height);
      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const n = fbm(x * scale + time, y * scale + time * 0.7, octaves);
          const t = (n + 1) / 2;
          const c = this._lerpColor(colorA, colorB, t);
          const i = (y * canvas.width + x) * 4;
          img.data[i] = c[0]; img.data[i + 1] = c[1]; img.data[i + 2] = c[2]; img.data[i + 3] = 255;
        }
      }
      ctx.putImageData(img, 0, 0);
    }

    renderFlow() {
      const { canvas, ctx, scale, time, particles } = this;
      ctx.fillStyle = 'rgba(0,0,0,0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = 'rgba(0,200,200,0.4)';
      ctx.lineWidth = 1;
      for (const p of particles) {
        const n = fbm(p.x * scale + time, p.y * scale, 2);
        const angle = n * Math.PI * 4;
        const speed = 2;
        const nx = p.x + Math.cos(angle) * speed;
        const ny = p.y + Math.sin(angle) * speed;
        ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(nx, ny); ctx.stroke();
        p.x = nx; p.y = ny; p.age++;
        if (p.age > p.maxAge || p.x < 0 || p.x > canvas.width || p.y < 0 || p.y > canvas.height) {
          p.x = Math.random() * canvas.width;
          p.y = Math.random() * canvas.height;
          p.age = 0;
        }
      }
    }

    tick() {
      this.time += this.speed;
      if (this.mode === 'color') this.renderColor();
      else this.renderFlow();
    }

    start() {
      this._running = true;
      const loop = () => { this.tick(); if (this._running) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }

    stop() { this._running = false; }

    reseed(s) { seed(s); }
  }

  return { Field, perlin2, fbm };
});
