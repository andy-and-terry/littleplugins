/*!
 * ParticleGPU - WebGL GPU-accelerated particle system
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ParticleGPU = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const VS = `
    attribute vec2 a_position;
    attribute float a_age;
    attribute float a_life;
    attribute float a_size;
    attribute vec3 a_color;
    uniform vec2 u_resolution;
    varying float v_alpha;
    varying vec3 v_color;
    void main() {
      vec2 pos = (a_position / u_resolution) * 2.0 - 1.0;
      pos.y = -pos.y;
      gl_Position = vec4(pos, 0.0, 1.0);
      gl_PointSize = a_size * (1.0 - a_age / a_life);
      v_alpha = 1.0 - a_age / a_life;
      v_color = a_color;
    }
  `;

  const FS = `
    precision mediump float;
    varying float v_alpha;
    varying vec3 v_color;
    void main() {
      vec2 coord = gl_PointCoord - 0.5;
      if (length(coord) > 0.5) discard;
      gl_FragColor = vec4(v_color, v_alpha);
    }
  `;

  function createShader(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src); gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(s)); return null; }
    return s;
  }

  function createProgram(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs); gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS)) { console.error(gl.getProgramInfoLog(p)); return null; }
    return p;
  }

  class Emitter {
    constructor(canvas, options = {}) {
      this.canvas = typeof canvas === 'string' ? document.querySelector(canvas) : canvas;
      const gl = this.gl = this.canvas.getContext('webgl');
      if (!gl) throw new Error('WebGL not supported');

      this.maxParticles = options.maxParticles || 10000;
      this.emitRate = options.emitRate || 100;
      this.emitX = options.x || this.canvas.width / 2;
      this.emitY = options.y || this.canvas.height / 2;
      this.spread = options.spread || 30;
      this.life = options.life || 120;
      this.gravity = options.gravity || 0.05;
      this.color = options.color || [1, 0.5, 0];
      this.size = options.size || 8;

      this._pos = new Float32Array(this.maxParticles * 2);
      this._vel = new Float32Array(this.maxParticles * 2);
      this._age = new Float32Array(this.maxParticles);
      this._life = new Float32Array(this.maxParticles);
      this._size = new Float32Array(this.maxParticles);
      this._color = new Float32Array(this.maxParticles * 3);
      this._count = 0;
      this._head = 0;
      this._running = false;

      this._setupGL();
    }

    _setupGL() {
      const gl = this.gl;
      gl.clearColor(0, 0, 0, 0);
      gl.enable(gl.BLEND);
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE);

      const vs = createShader(gl, gl.VERTEX_SHADER, VS);
      const fs = createShader(gl, gl.FRAGMENT_SHADER, FS);
      this._prog = createProgram(gl, vs, fs);
      gl.useProgram(this._prog);

      this._bufs = {};
      ['a_position', 'a_age', 'a_life', 'a_size', 'a_color'].forEach(name => {
        this._bufs[name] = gl.createBuffer();
      });
      this._uRes = gl.getUniformLocation(this._prog, 'u_resolution');
    }

    emit(n = 1) {
      for (let i = 0; i < n; i++) {
        const idx = this._head % this.maxParticles;
        const angle = (Math.random() - 0.5) * Math.PI;
        const speed = 1 + Math.random() * 3;
        this._pos[idx * 2] = this.emitX + (Math.random() - 0.5) * this.spread;
        this._pos[idx * 2 + 1] = this.emitY + (Math.random() - 0.5) * this.spread;
        this._vel[idx * 2] = Math.cos(angle) * speed;
        this._vel[idx * 2 + 1] = Math.sin(angle) * speed - 2;
        this._age[idx] = 0;
        this._life[idx] = this.life * (0.5 + Math.random());
        this._size[idx] = this.size * (0.5 + Math.random());
        this._color[idx * 3] = this.color[0]; this._color[idx * 3 + 1] = this.color[1]; this._color[idx * 3 + 2] = this.color[2];
        this._head++;
        this._count = Math.min(this._count + 1, this.maxParticles);
      }
    }

    _update() {
      for (let i = 0; i < this._count; i++) {
        this._vel[i * 2 + 1] += this.gravity;
        this._pos[i * 2] += this._vel[i * 2];
        this._pos[i * 2 + 1] += this._vel[i * 2 + 1];
        this._age[i]++;
      }
      this.emit(this.emitRate);
    }

    _draw() {
      const gl = this.gl;
      gl.viewport(0, 0, this.canvas.width, this.canvas.height);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.useProgram(this._prog);
      gl.uniform2f(this._uRes, this.canvas.width, this.canvas.height);

      const setAttr = (name, data, size) => {
        const loc = gl.getAttribLocation(this._prog, name);
        gl.bindBuffer(gl.ARRAY_BUFFER, this._bufs[name]);
        gl.bufferData(gl.ARRAY_BUFFER, data.slice(0, this._count * size), gl.DYNAMIC_DRAW);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };

      setAttr('a_position', this._pos, 2);
      setAttr('a_age', this._age, 1);
      setAttr('a_life', this._life, 1);
      setAttr('a_size', this._size, 1);
      setAttr('a_color', this._color, 3);
      gl.drawArrays(gl.POINTS, 0, this._count);
    }

    start() {
      this._running = true;
      const loop = () => { this._update(); this._draw(); if (this._running) requestAnimationFrame(loop); };
      requestAnimationFrame(loop);
    }

    stop() { this._running = false; }

    setPosition(x, y) { this.emitX = x; this.emitY = y; }
    setColor(r, g, b) { this.color = [r, g, b]; }
  }

  return { Emitter };
});
