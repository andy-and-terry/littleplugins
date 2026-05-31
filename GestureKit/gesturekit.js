/*!
 * GestureKit - Unified gesture engine
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.GestureKit = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  class Recognizer {
    constructor(el, options = {}) {
      this.el = typeof el === 'string' ? document.querySelector(el) : el;
      this._handlers = {};
      this._touches = {};
      this._lastTap = 0;
      this._longPressTimer = null;
      this._swipeThreshold = options.swipeThreshold || 50;
      this._longPressDelay = options.longPressDelay || 600;
      this._tapGap = options.tapGap || 300;
      this._startX = 0; this._startY = 0;
      this._startDist = 0; this._startAngle = 0;
      this._bind();
    }

    on(event, handler) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(handler);
      return this;
    }

    off(event, handler) {
      if (!this._handlers[event]) return this;
      this._handlers[event] = this._handlers[event].filter(h => h !== handler);
      return this;
    }

    _emit(event, data) {
      (this._handlers[event] || []).forEach(h => h({ type: event, ...data }));
    }

    _getTouches(e) { return Array.from(e.touches); }

    _dist(t1, t2) {
      const dx = t1.clientX - t2.clientX, dy = t1.clientY - t2.clientY;
      return Math.sqrt(dx * dx + dy * dy);
    }

    _angle(t1, t2) {
      return Math.atan2(t2.clientY - t1.clientY, t2.clientX - t1.clientX) * 180 / Math.PI;
    }

    _bind() {
      const el = this.el;

      el.addEventListener('touchstart', e => {
        const ts = this._getTouches(e);
        this._startX = ts[0].clientX;
        this._startY = ts[0].clientY;
        if (ts.length === 2) {
          this._startDist = this._dist(ts[0], ts[1]);
          this._startAngle = this._angle(ts[0], ts[1]);
        }
        this._longPressTimer = setTimeout(() => {
          this._emit('longpress', { x: this._startX, y: this._startY });
        }, this._longPressDelay);
      }, { passive: true });

      el.addEventListener('touchmove', e => {
        clearTimeout(this._longPressTimer);
        const ts = this._getTouches(e);
        if (ts.length === 2) {
          const dist = this._dist(ts[0], ts[1]);
          const angle = this._angle(ts[0], ts[1]);
          this._emit('pinch', { scale: dist / this._startDist, delta: dist - this._startDist });
          this._emit('rotate', { angle: angle - this._startAngle, delta: angle - this._startAngle });
        }
        const dx = ts[0].clientX - this._startX, dy = ts[0].clientY - this._startY;
        this._emit('pan', { dx, dy, x: ts[0].clientX, y: ts[0].clientY });
      }, { passive: true });

      el.addEventListener('touchend', e => {
        clearTimeout(this._longPressTimer);
        const dx = this._startX - (e.changedTouches[0]?.clientX || this._startX);
        const dy = this._startY - (e.changedTouches[0]?.clientY || this._startY);
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) > this._swipeThreshold) {
          if (absDx > absDy) this._emit('swipe', { direction: dx > 0 ? 'left' : 'right', dx, dy });
          else this._emit('swipe', { direction: dy > 0 ? 'up' : 'down', dx, dy });
        } else {
          const now = Date.now();
          if (now - this._lastTap < this._tapGap) this._emit('doubletap', { x: this._startX, y: this._startY });
          else this._emit('tap', { x: this._startX, y: this._startY });
          this._lastTap = now;
        }
      }, { passive: true });

      // Mouse fallback for desktop
      let mouseDown = false, mouseStartX = 0, mouseStartY = 0;
      el.addEventListener('mousedown', e => { mouseDown = true; mouseStartX = e.clientX; mouseStartY = e.clientY; });
      el.addEventListener('mousemove', e => {
        if (!mouseDown) return;
        this._emit('pan', { dx: e.clientX - mouseStartX, dy: e.clientY - mouseStartY, x: e.clientX, y: e.clientY });
      });
      el.addEventListener('mouseup', e => {
        if (!mouseDown) return; mouseDown = false;
        const dx = mouseStartX - e.clientX, dy = mouseStartY - e.clientY;
        const absDx = Math.abs(dx), absDy = Math.abs(dy);
        if (Math.max(absDx, absDy) > this._swipeThreshold) {
          if (absDx > absDy) this._emit('swipe', { direction: dx > 0 ? 'left' : 'right', dx, dy });
          else this._emit('swipe', { direction: dy > 0 ? 'up' : 'down', dx, dy });
        } else {
          this._emit('tap', { x: e.clientX, y: e.clientY });
        }
      });
    }

    destroy() { /* TODO: removeEventListener cleanup */ }
  }

  return { Recognizer };
});
