/*!
 * DrumSynth - Physically modelled drum synthesis without samples
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.DrumSynth=f();})(typeof self!=='undefined'?self:this,function(){
  class DrumSynth{
    constructor(options={}){this.ctx=new(window.AudioContext||window.webkitAudioContext)();}
    _noise(dur){const buf=this.ctx.createBuffer(1,this.ctx.sampleRate*dur,this.ctx.sampleRate);const d=buf.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const src=this.ctx.createBufferSource();src.buffer=buf;return src;}
    _env(param,attack,decay,from,to,now){param.setValueAtTime(from,now);param.linearRampToValueAtTime(to,now+attack);param.exponentialRampToValueAtTime(0.0001,now+attack+decay);}
    kick(options={}){
      const{ctx}=this;const now=ctx.currentTime;ctx.resume();
      const osc=ctx.createOscillator();const g=ctx.createGain();const drive=options.drive||80;
      osc.frequency.setValueAtTime(options.freq||150,now);osc.frequency.exponentialRampToValueAtTime(options.endFreq||40,now+0.08);
      g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(options.volume||0.9,now+0.002);g.gain.exponentialRampToValueAtTime(0.0001,now+options.decay||0.4);
      osc.connect(g);g.connect(ctx.destination);osc.start(now);osc.stop(now+0.5);
    }
    snare(options={}){
      const{ctx}=this;const now=ctx.currentTime;ctx.resume();
      const noise=this._noise(0.3);const noiseG=ctx.createGain();const filt=ctx.createBiquadFilter();filt.type='highpass';filt.frequency.value=options.filterFreq||2000;
      noiseG.gain.setValueAtTime(0,now);noiseG.gain.linearRampToValueAtTime(options.volume||0.5,now+0.002);noiseG.gain.exponentialRampToValueAtTime(0.0001,now+(options.decay||0.2));
      const osc=ctx.createOscillator();const oscG=ctx.createGain();osc.frequency.value=options.tone||180;oscG.gain.setValueAtTime(options.volume||0.5,now);oscG.gain.exponentialRampToValueAtTime(0.0001,now+0.08);
      noise.connect(filt);filt.connect(noiseG);noiseG.connect(ctx.destination);osc.connect(oscG);oscG.connect(ctx.destination);noise.start(now);osc.start(now);noise.stop(now+0.3);osc.stop(now+0.1);
    }
    hihat(options={}){
      const{ctx}=this;const now=ctx.currentTime;ctx.resume();
      const noise=this._noise(0.1);const g=ctx.createGain();const filt=ctx.createBiquadFilter();filt.type='bandpass';filt.frequency.value=options.freq||10000;filt.Q.value=0.5;
      g.gain.setValueAtTime(0,now);g.gain.linearRampToValueAtTime(options.volume||0.3,now+0.001);g.gain.exponentialRampToValueAtTime(0.0001,now+(options.open?0.3:0.05));
      noise.connect(filt);filt.connect(g);g.connect(ctx.destination);noise.start(now);noise.stop(now+0.4);
    }
    clap(options={}){
      const{ctx}=this;const now=ctx.currentTime;ctx.resume();
      for(let i=0;i<3;i++){const noise=this._noise(0.05);const g=ctx.createGain();const t=now+i*0.01;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(options.volume||0.5,t+0.002);g.gain.exponentialRampToValueAtTime(0.0001,t+0.06);noise.connect(g);g.connect(ctx.destination);noise.start(t);noise.stop(t+0.1);}
    }
    tom(options={}){
      const{ctx}=this;const now=ctx.currentTime;ctx.resume();
      const osc=ctx.createOscillator();const g=ctx.createGain();
      osc.frequency.setValueAtTime(options.freq||120,now);osc.frequency.exponentialRampToValueAtTime(options.endFreq||60,now+0.1);
      g.gain.setValueAtTime(options.volume||0.7,now);g.gain.exponentialRampToValueAtTime(0.0001,now+(options.decay||0.3));
      osc.connect(g);g.connect(ctx.destination);osc.start(now);osc.stop(now+0.4);
    }
  }
  return{DrumSynth};
});
