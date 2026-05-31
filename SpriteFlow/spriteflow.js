/*!
 * SpriteFlow - Sprite animation engine with bone rigging
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.SpriteFlow = factory();
})(typeof self !== 'undefined' ? self : this, function () {

  class Spritesheet {
    constructor(image, frameW, frameH) {
      this.image = typeof image === 'string' ? (() => { const img = new Image(); img.src = image; return img; })() : image;
      this.frameW = frameW;
      this.frameH = frameH;
      this.cols = 0;
      this.image.onload = () => { this.cols = Math.floor(this.image.naturalWidth / frameW); };
    }

    draw(ctx, frame, dx, dy, scaleX = 1, scaleY = 1) {
      if (!this.cols) return;
      const sx = (frame % this.cols) * this.frameW;
      const sy = Math.floor(frame / this.cols) * this.frameH;
      ctx.drawImage(this.image, sx, sy, this.frameW, this.frameH, dx, dy, this.frameW * scaleX, this.frameH * scaleY);
    }
  }

  class Animation {
    constructor(options) {
      this.name = options.name;
      this.frames = options.frames; // array of frame indices
      this.fps = options.fps || 12;
      this.loop = options.loop !== undefined ? options.loop : true;
      this.onComplete = options.onComplete || null;
    }
  }

  class Sprite {
    constructor(spritesheet, options = {}) {
      this.sheet = spritesheet;
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.scaleX = options.scaleX || 1;
      this.scaleY = options.scaleY || 1;
      this.rotation = 0;
      this.alpha = 1;
      this.animations = {};
      this._current = null;
      this._frame = 0;
      this._time = 0;
      this._playing = false;
      this._frameIndex = 0;
    }

    addAnimation(options) {
      const anim = new Animation(options);
      this.animations[anim.name] = anim;
      return this;
    }

    play(name, restart = false) {
      if (this._current && this._current.name === name && !restart) return this;
      this._current = this.animations[name];
      if (!this._current) { console.warn(`Animation "${name}" not found`); return this; }
      this._frameIndex = 0;
      this._time = 0;
      this._playing = true;
      return this;
    }

    stop() { this._playing = false; return this; }

    update(dt) {
      if (!this._playing || !this._current) return;
      this._time += dt;
      const frameDur = 1 / this._current.fps;
      while (this._time >= frameDur) {
        this._time -= frameDur;
        this._frameIndex++;
        if (this._frameIndex >= this._current.frames.length) {
          if (this._current.loop) {
            this._frameIndex = 0;
          } else {
            this._frameIndex = this._current.frames.length - 1;
            this._playing = false;
            if (this._current.onComplete) this._current.onComplete();
          }
        }
      }
    }

    render(ctx) {
      const frame = this._current ? this._current.frames[this._frameIndex] : 0;
      ctx.save();
      ctx.globalAlpha = this.alpha;
      ctx.translate(this.x + this.sheet.frameW * this.scaleX / 2, this.y + this.sheet.frameH * this.scaleY / 2);
      ctx.rotate(this.rotation);
      ctx.translate(-this.sheet.frameW * this.scaleX / 2, -this.sheet.frameH * this.scaleY / 2);
      this.sheet.draw(ctx, frame, 0, 0, this.scaleX, this.scaleY);
      ctx.restore();
    }
  }

  class Bone {
    constructor(name, options = {}) {
      this.name = name;
      this.x = options.x || 0;
      this.y = options.y || 0;
      this.length = options.length || 40;
      this.angle = options.angle || 0;
      this.children = [];
      this.parent = null;
      this.image = null;
      this._keyframes = {};
    }

    addChild(bone) { bone.parent = this; this.children.push(bone); return this; }

    setImage(img, offX = 0, offY = 0) { this.image = { img, offX, offY }; return this; }

    addKeyframes(property, frames) { this._keyframes[property] = frames; return this; }

    _getWorldTransform() {
      let wx = this.x, wy = this.y, wa = this.angle;
      let p = this.parent;
      while (p) {
        const cos = Math.cos(p.angle), sin = Math.sin(p.angle);
        const nx = p.x + wx * cos - wy * sin;
        const ny = p.y + wx * sin + wy * cos;
        wx = nx; wy = ny; wa += p.angle;
        p = p.parent;
      }
      return { x: wx, y: wy, angle: wa };
    }

    render(ctx) {
      const { x, y, angle } = this._getWorldTransform();
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(angle);
      if (this.image) {
        ctx.drawImage(this.image.img, this.image.offX, this.image.offY);
      }
      ctx.strokeStyle = '#4af'; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(this.length, 0); ctx.stroke();
      ctx.restore();
      for (const child of this.children) child.render(ctx);
    }
  }

  return { Spritesheet, Sprite, Bone };
});
