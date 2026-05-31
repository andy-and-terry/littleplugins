/*!
 * Vanta2 - Lightweight 2D scene graph
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Vanta2 = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  class Layer {
    constructor(name) {
      this.name = name;
      this.objects = [];
      this.visible = true;
      this.alpha = 1;
    }
    add(obj) { this.objects.push(obj); return this; }
    remove(obj) { this.objects = this.objects.filter(o => o !== obj); return this; }
    clear() { this.objects = []; return this; }
  }

  class Camera {
    constructor() { this.x = 0; this.y = 0; this.zoom = 1; this.rotation = 0; }
    moveTo(x, y) { this.x = x; this.y = y; }
    zoomTo(z) { this.zoom = z; }
  }

  class Scene {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      this.ctx = this.canvas.getContext('2d');
      this.layers = [];
      this.camera = new Camera();
      this.bgColor = options.bgColor || '#000';
      this._running = false;
      this._lastTime = 0;
      this.fps = 0;
      this._fpsCounter = 0;
      this._fpsTime = 0;
    }

    addLayer(name) {
      const layer = new Layer(name);
      this.layers.push(layer);
      return layer;
    }

    getLayer(name) { return this.layers.find(l => l.name === name); }

    clear() {
      const { ctx, canvas, bgColor } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (bgColor) { ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height); }
    }

    render(ts = 0) {
      const dt = (ts - this._lastTime) / 1000;
      this._lastTime = ts;
      this._fpsCounter++;
      this._fpsTime += dt;
      if (this._fpsTime >= 1) { this.fps = this._fpsCounter; this._fpsCounter = 0; this._fpsTime = 0; }

      this.clear();
      const { ctx, camera } = this;
      ctx.save();
      ctx.translate(this.canvas.width / 2, this.canvas.height / 2);
      ctx.scale(camera.zoom, camera.zoom);
      ctx.rotate(camera.rotation);
      ctx.translate(-camera.x, -camera.y);

      for (const layer of this.layers) {
        if (!layer.visible) continue;
        ctx.globalAlpha = layer.alpha;
        for (const obj of layer.objects) {
          if (obj.render) obj.render(ctx, dt);
        }
      }
      ctx.restore();
      if (this._running) requestAnimationFrame(ts => this.render(ts));
    }

    start() { this._running = true; requestAnimationFrame(ts => this.render(ts)); }
    stop() { this._running = false; }

    resize(w, h) { this.canvas.width = w; this.canvas.height = h; }
  }

  return { Scene, Layer, Camera };
});
