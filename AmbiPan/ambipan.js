/*!
 * AmbiPan - 360 spatial audio panner for web
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.AmbiPan=f();})(typeof self!=='undefined'?self:this,function(){
  class Panner{
    constructor(options={}){
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      this.masterGain=this.ctx.createGain();this.masterGain.connect(this.ctx.destination);
      this.sources={};
    }
    createSource(id,options={}){
      const g=this.ctx.createGain();const pan=this.ctx.createPanner();
      pan.panningModel=options.model||'HRTF';pan.distanceModel='inverse';
      pan.refDistance=1;pan.maxDistance=500;pan.rolloffFactor=1;
      g.connect(pan);pan.connect(this.masterGain);
      this.sources[id]={gain:g,panner:pan};return g;
    }
    setPosition(id,x,y,z){const s=this.sources[id];if(s)s.panner.setPosition(x,y,z||0);}
    setListenerPosition(x,y,z,fx,fy,fz){
      this.ctx.listener.setPosition(x,y,z||0);
      if(fx!==undefined)this.ctx.listener.setOrientation(fx,fy,fz||0,0,1,0);
    }
    connectElement(id,mediaEl){
      if(!this.sources[id])this.createSource(id);
      const src=this.ctx.createMediaElementSource(mediaEl);
      src.connect(this.sources[id].gain);this.ctx.resume();
    }
    playTone(id,freq,dur){
      if(!this.sources[id])this.createSource(id);
      const osc=this.ctx.createOscillator();const g=this.ctx.createGain();
      osc.frequency.value=freq;g.gain.setValueAtTime(0.3,this.ctx.currentTime);g.gain.exponentialRampToValueAtTime(0.001,this.ctx.currentTime+dur);
      osc.connect(g);g.connect(this.sources[id].panner);osc.start();osc.stop(this.ctx.currentTime+dur);this.ctx.resume();
    }
  }
  return{Panner};
});
