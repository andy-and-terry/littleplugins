/*!
 * EchoTrail - Multi-tap delay engine with feedback and filtering per tap
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.EchoTrail=factory();})(typeof self!=='undefined'?self:this,function(){
  class Delay{
    constructor(options={}){
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      this.taps=[];this._input=this.ctx.createGain();this._output=this.ctx.createGain();this._output.connect(this.ctx.destination);this._input.connect(this._output);
    }
    addTap(options={}){
      const{ctx}=this;const delay=ctx.createDelay(5);const gain=ctx.createGain();const filter=ctx.createBiquadFilter();
      delay.delayTime.value=options.time||0.3;gain.gain.value=options.volume||0.5;filter.type=options.filterType||'lowpass';filter.frequency.value=options.filterFreq||3000;
      let src=this._input;if(options.feedback){const fb=ctx.createGain();fb.gain.value=options.feedback;delay.connect(fb);fb.connect(delay);}
      src.connect(delay);delay.connect(filter);filter.connect(gain);gain.connect(this._output);
      this.taps.push({delay,gain,filter});return this;
    }
    connect(mediaEl){const src=this.ctx.createMediaElementSource(mediaEl);src.connect(this._input);this.ctx.resume();return this;}
    connectMic(){return navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const src=this.ctx.createMediaStreamSource(stream);src.connect(this._input);this.ctx.resume();return this;});}
    setTap(idx,param,value){const tap=this.taps[idx];if(!tap)return;if(param==='time')tap.delay.delayTime.value=value;if(param==='volume')tap.gain.gain.value=value;if(param==='filterFreq')tap.filter.frequency.value=value;}
    get output(){return this._output;}
  }
  return{Delay};
});
