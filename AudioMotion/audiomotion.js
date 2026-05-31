/*!
 * AudioMotion - Audio-reactive animation driver
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.AudioMotion = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  const BANDS = { bass: [20, 250], mid: [250, 4000], treble: [4000, 20000] };

  class Reactor {
    constructor(options = {}) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      this.fftSize = options.fftSize || 1024;
      this.smoothing = options.smoothing !== undefined ? options.smoothing : 0.8;
      this.analyser = this.ctx.createAnalyser();
      this.analyser.fftSize = this.fftSize;
      this.analyser.smoothingTimeConstant = this.smoothing;
      this._data = new Uint8Array(this.analyser.frequencyBinCount);
      this._handlers = {};
      this._running = false;
      this._source = null;
      this._history = { bass: [], mid: [], treble: [], volume: [] };
      this._historyLen = 60;
    }

    async fromMic() {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this._source = this.ctx.createMediaStreamSource(stream);
      this._source.connect(this.analyser);
      return this;
    }

    fromElement(mediaEl) {
      this._source = this.ctx.createMediaElementSource(mediaEl);
      this._source.connect(this.analyser);
      this.analyser.connect(this.ctx.destination);
      return this;
    }

    on(event, handler) {
      if (!this._handlers[event]) this._handlers[event] = [];
      this._handlers[event].push(handler);
      return this;
    }

    _emit(event, data) { (this._handlers[event] || []).forEach(h => h(data)); }

    _getBandEnergy(low, high) {
      const nyquist = this.ctx.sampleRate / 2;
      const total = this.analyser.frequencyBinCount;
      const lowIdx = Math.floor(low / nyquist * total);
      const highIdx = Math.ceil(high / nyquist * total);
      let sum = 0;
      for (let i = lowIdx; i < highIdx; i++) sum += this._data[i];
      return sum / ((highIdx - lowIdx) * 255);
    }

    _tick() {
      this.analyser.getByteFrequencyData(this._data);
      let volume = 0;
      for (let i = 0; i < this._data.length; i++) volume += this._data[i];
      volume /= this._data.length * 255;

      const bass = this._getBandEnergy(20, 250);
      const mid = this._getBandEnergy(250, 4000);
      const treble = this._getBandEnergy(4000, 20000);

      const h = this._history;
      const track = (arr, v) => { arr.push(v); if (arr.length > this._historyLen) arr.shift(); };
      track(h.bass, bass); track(h.mid, mid); track(h.treble, treble); track(h.volume, volume);

      const avg = arr => arr.reduce((s, v) => s + v, 0) / (arr.length || 1);
      const beat = bass > avg(h.bass) * 1.5 && bass > 0.3;

      const payload = { volume, bass, mid, treble, beat, data: this._data, history: h };
      this._emit('tick', payload);
      if (beat) this._emit('beat', payload);

      if (this._running) requestAnimationFrame(() => this._tick());
    }

    start() { this.ctx.resume(); this._running = true; this._tick(); return this; }
    stop() { this._running = false; return this; }
    getSpectrum() { this.analyser.getByteFrequencyData(this._data); return new Uint8Array(this._data); }
  }

  return { Reactor };
});
