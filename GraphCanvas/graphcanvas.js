/*!
 * GraphCanvas - Force-directed graph layout engine
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GraphCanvas = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  class Node {
    constructor(id, options = {}) {
      this.id = id;
      this.x = options.x || Math.random() * 400;
      this.y = options.y || Math.random() * 400;
      this.vx = 0; this.vy = 0;
      this.fx = null; this.fy = null; // fixed position
      this.radius = options.radius || 12;
      this.label = options.label || String(id);
      this.color = options.color || '#4af';
      this.mass = options.mass || 1;
    }
  }

  class Edge {
    constructor(source, target, options = {}) {
      this.source = source;
      this.target = target;
      this.length = options.length || 100;
      this.strength = options.strength || 0.05;
      this.color = options.color || '#555';
      this.label = options.label || '';
    }
  }

  class Graph {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      this.ctx = this.canvas.getContext('2d');
      this.nodes = [];
      this.edges = [];
      this.repulsion = options.repulsion || 3000;
      this.damping = options.damping || 0.85;
      this.gravity = options.gravity || 0.05;
      this._running = false;
      this._dragging = null;
      this._bindEvents();
    }

    addNode(id, options = {}) {
      const n = new Node(id, { x: this.canvas.width / 2 + (Math.random() - 0.5) * 100, y: this.canvas.height / 2 + (Math.random() - 0.5) * 100, ...options });
      this.nodes.push(n);
      return n;
    }

    addEdge(sourceId, targetId, options = {}) {
      const s = this.nodes.find(n => n.id === sourceId);
      const t = this.nodes.find(n => n.id === targetId);
      if (!s || !t) return null;
      const e = new Edge(s, t, options);
      this.edges.push(e);
      return e;
    }

    _bindEvents() {
      const c = this.canvas;
      c.addEventListener('mousedown', e => {
        const { x, y } = this._mouse(e);
        this._dragging = this.nodes.find(n => Math.hypot(n.x - x, n.y - y) < n.radius + 4) || null;
      });
      c.addEventListener('mousemove', e => {
        if (!this._dragging) return;
        const { x, y } = this._mouse(e);
        this._dragging.x = x; this._dragging.y = y;
        this._dragging.vx = 0; this._dragging.vy = 0;
      });
      c.addEventListener('mouseup', () => { this._dragging = null; });
    }

    _mouse(e) {
      const r = this.canvas.getBoundingClientRect();
      return { x: e.clientX - r.left, y: e.clientY - r.top };
    }

    _step() {
      const cx = this.canvas.width / 2, cy = this.canvas.height / 2;
      for (const n of this.nodes) {
        if (n.fx !== null) { n.x = n.fx; n.y = n.fy; continue; }
        if (n === this._dragging) continue;
        // gravity to center
        n.vx += (cx - n.x) * this.gravity;
        n.vy += (cy - n.y) * this.gravity;
        // repulsion
        for (const m of this.nodes) {
          if (m === n) continue;
          const dx = n.x - m.x, dy = n.y - m.y;
          const dist2 = dx * dx + dy * dy || 1;
          const force = this.repulsion / dist2;
          n.vx += dx * force; n.vy += dy * force;
        }
      }
      // spring attraction
      for (const e of this.edges) {
        const dx = e.target.x - e.source.x, dy = e.target.y - e.source.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 1;
        const force = (dist - e.length) * e.strength;
        const fx = (dx / dist) * force, fy = (dy / dist) * force;
        e.source.vx += fx; e.source.vy += fy;
        e.target.vx -= fx; e.target.vy -= fy;
      }
      for (const n of this.nodes) {
        if (n === this._dragging || n.fx !== null) continue;
        n.vx *= this.damping; n.vy *= this.damping;
        n.x += n.vx; n.y += n.vy;
      }
    }

    _render() {
      const { ctx, canvas } = this;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const e of this.edges) {
        ctx.beginPath();
        ctx.moveTo(e.source.x, e.source.y);
        ctx.lineTo(e.target.x, e.target.y);
        ctx.strokeStyle = e.color; ctx.lineWidth = 1.5;
        ctx.stroke();
        if (e.label) {
          ctx.fillStyle = '#aaa'; ctx.font = '11px sans-serif';
          ctx.fillText(e.label, (e.source.x + e.target.x) / 2, (e.source.y + e.target.y) / 2);
        }
      }
      for (const n of this.nodes) {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.color; ctx.fill();
        ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.5; ctx.stroke();
        if (n.label) {
          ctx.fillStyle = '#fff'; ctx.font = `${Math.max(10, n.radius)}px sans-serif`;
          ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
          ctx.fillText(n.label, n.x, n.y + n.radius + 12);
        }
      }
      ctx.textAlign = 'left'; ctx.textBaseline = 'alphabetic';
    }

    _loop() {
      this._step();
      this._render();
      if (this._running) requestAnimationFrame(() => this._loop());
    }

    start() { this._running = true; this._loop(); }
    stop() { this._running = false; }
  }

  return { Graph };
});
