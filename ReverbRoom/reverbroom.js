/*!
 * ReverbRoom - Convolution reverb with built-in impulse responses
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.ReverbRoom=f();})(typeof self!=='undefined'?self:this,function(){
  function makeImpulse(ctx,duration,decay,reverse){
    const sampleRate=ctx.sampleRate;const length=sampleRate*duration;const impulse=ctx.createBuffer(2,length,sampleRate);
    for(let c=0;c<2;c++){const channel=impulse.getChannelData(c);for(let i=0;i<length;i++){const n=i/length;channel[i]=(Math.random()*2-1)*Math.pow(1-n,decay);if(reverse)channel[i]=channel[length-1-i];}}
    return impulse;
  }
  const PRESETS={hall:{duration:2.5,decay:3},room:{duration:0.8,decay:4},cave:{duration:4,decay:1.5},plate:{duration:1.5,decay:5},spring:{duration:1.2,decay:2},none:{duration:0.01,decay:20}};
  class Reverb{
    constructor(options={}){
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      this._convolver=this.ctx.createConvolver();this._dry=this.ctx.createGain();this._wet=this.ctx.createGain();this._in=this.ctx.createGain();
      this._in.connect(this._dry);this._in.connect(this._convolver);this._convolver.connect(this._wet);this._dry.connect(this.ctx.destination);this._wet.connect(this.ctx.destination);
      this.setPreset(options.preset||'room');this.setMix(options.mix!==undefined?options.mix:0.3);
    }
    setPreset(name){const p=PRESETS[name]||PRESETS.room;this._convolver.buffer=makeImpulse(this.ctx,p.duration,p.decay,false);this._preset=name;return this;}
    setMix(wet){this._wet.gain.value=wet;this._dry.gain.value=1-wet;return this;}
    connect(mediaEl){const src=this.ctx.createMediaElementSource(mediaEl);src.connect(this._in);this.ctx.resume();return this;}
    connectMic(){return navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const src=this.ctx.createMediaStreamSource(stream);src.connect(this._in);this.ctx.resume();return this;});}
    get presets(){return Object.keys(PRESETS);}
    get input(){return this._in;}
  }
  return{Reverb,PRESETS};
});
