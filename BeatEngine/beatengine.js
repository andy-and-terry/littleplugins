/*!
 * BeatEngine - Step sequencer engine
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.BeatEngine=factory();})(typeof self!=='undefined'?self:this,function(){
  class Sequencer {
    constructor(options={}){
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      this.bpm=options.bpm||120; this.steps=options.steps||16; this.swing=options.swing||0;
      this._tracks={}; this._currentStep=0; this._running=false; this._nextTime=0;
      this._lookahead=0.1; this._scheduleAhead=0.25; this._onStep=options.onStep||null;
    }
    addTrack(name,options={}){
      this._tracks[name]={pattern:new Array(this.steps).fill(false),volume:options.volume||0.8,pitch:options.pitch||440,type:options.type||'square',onHit:options.onHit||null};
      return this;
    }
    setStep(track,step,active){if(this._tracks[track])this._tracks[track].pattern[step]=active;return this;}
    toggleStep(track,step){if(this._tracks[track])this._tracks[track].pattern[step]=!this._tracks[track].pattern[step];return this;}
    setPattern(track,pattern){if(this._tracks[track])this._tracks[track].pattern=pattern.slice(0,this.steps);return this;}
    _playNote(time,freq,type,vol){
      const osc=this.ctx.createOscillator(),g=this.ctx.createGain();
      osc.type=type; osc.frequency.value=freq;
      g.gain.setValueAtTime(vol,time); g.gain.exponentialRampToValueAtTime(0.001,time+0.1);
      osc.connect(g); g.connect(this.ctx.destination); osc.start(time); osc.stop(time+0.15);
    }
    _schedule(){
      while(this._nextTime<this.ctx.currentTime+this._scheduleAhead){
        const step=this._currentStep;
        const swing=step%2===1?this.swing*0.01*(60/this.bpm):0;
        const time=this._nextTime+swing;
        for(const[name,track]of Object.entries(this._tracks)){
          if(track.pattern[step]){
            this._playNote(time,track.pitch,track.type,track.volume);
            if(track.onHit)setTimeout(()=>track.onHit(step),(time-this.ctx.currentTime)*1000);
          }
        }
        if(this._onStep)setTimeout(()=>this._onStep(step),(time-this.ctx.currentTime)*1000);
        this._currentStep=(step+1)%this.steps;
        this._nextTime+=60/this.bpm/4;
      }
    }
    start(){this.ctx.resume();this._running=true;this._nextTime=this.ctx.currentTime;const loop=()=>{if(!this._running)return;this._schedule();setTimeout(loop,this._lookahead*1000);};loop();}
    stop(){this._running=false;this._currentStep=0;}
    get currentStep(){return this._currentStep;}
  }
  return{Sequencer};
});
