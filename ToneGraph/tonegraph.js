/*!
 * ToneGraph - Web Audio API node graph builder
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.ToneGraph = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  class AudioNode {
    constructor(graph, type, options = {}) {
      this.graph = graph;
      this.type = type;
      this.id = 'node_' + Math.random().toString(36).slice(2);
      this._node = null;
      this._options = options;
      this._build();
    }

    _build() {
      const ctx = this.graph.ctx;
      switch (this.type) {
        case 'oscillator':
          this._node = ctx.createOscillator();
          this._node.type = this._options.wave || 'sine';
          this._node.frequency.value = this._options.frequency || 440;
          break;
        case 'gain':
          this._node = ctx.createGain();
          this._node.gain.value = this._options.gain !== undefined ? this._options.gain : 1;
          break;
        case 'filter':
          this._node = ctx.createBiquadFilter();
          this._node.type = this._options.filterType || 'lowpass';
          this._node.frequency.value = this._options.frequency || 1000;
          this._node.Q.value = this._options.Q || 1;
          break;
        case 'delay':
          this._node = ctx.createDelay(this._options.maxDelay || 2);
          this._node.delayTime.value = this._options.delayTime || 0.3;
          break;
        case 'analyser':
          this._node = ctx.createAnalyser();
          this._node.fftSize = this._options.fftSize || 256;
          break;
        case 'compressor':
          this._node = ctx.createDynamicsCompressor();
          break;
        case 'destination':
          this._node = ctx.destination;
          break;
      }
    }

    connect(targetNode) {
      this._node.connect(targetNode._node || targetNode);
      return targetNode;
    }

    set(param, value, rampTime) {
      const p = this._node[param];
      if (!p) return this;
      if (rampTime) p.linearRampToValueAtTime(value, this.graph.ctx.currentTime + rampTime);
      else p.setValueAtTime(value, this.graph.ctx.currentTime);
      return this;
    }

    start(when = 0) {
      if (this._node.start) this._node.start(this.graph.ctx.currentTime + when);
      return this;
    }

    stop(when = 0) {
      if (this._node.stop) this._node.stop(this.graph.ctx.currentTime + when);
      return this;
    }

    getData() {
      if (this.type !== 'analyser') return null;
      const arr = new Uint8Array(this._node.frequencyBinCount);
      this._node.getByteFrequencyData(arr);
      return arr;
    }
  }

  class Graph {
    constructor() {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.nodes = {};
    }

    add(type, options = {}) {
      const node = new AudioNode(this, type, options);
      this.nodes[node.id] = node;
      return node;
    }

    destination() {
      return { _node: this.ctx.destination };
    }

    resume() { return this.ctx.resume(); }
    suspend() { return this.ctx.suspend(); }
    get currentTime() { return this.ctx.currentTime; }
  }

  return { Graph };
});
