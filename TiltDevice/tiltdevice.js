/*!
 * TiltDevice - DeviceOrientation API abstraction for gyroscope-driven UI
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.TiltDevice=f();})(typeof self!=='undefined'?self:this,function(){
  class TiltDevice{
    constructor(options={}){
      this.deadzone=options.deadzone||2;this.smoothing=options.smoothing||0.15;this.maxTilt=options.maxTilt||45;
      this._handlers={};this._alpha=0;this._beta=0;this._gamma=0;this._sa=0;this._sb=0;this._sg=0;this._running=false;
    }
    on(event,fn){if(!this._handlers[event])this._handlers[event]=[];this._handlers[event].push(fn);return this;}
    _emit(event,data){(this._handlers[event]||[]).forEach(h=>h(data));}
    async start(){
      if(typeof DeviceOrientationEvent==='undefined'){this._emit('error',{message:'DeviceOrientationEvent not supported'});return this;}
      if(typeof DeviceOrientationEvent.requestPermission==='function'){
        const perm=await DeviceOrientationEvent.requestPermission();
        if(perm!=='granted'){this._emit('error',{message:'Permission denied'});return this;}
      }
      this._running=true;
      window.addEventListener('deviceorientation',e=>{
        const alpha=e.alpha||0,beta=e.beta||0,gamma=e.gamma||0;
        this._sa=this._sa*(1-this.smoothing)+alpha*this.smoothing;
        this._sb=this._sb*(1-this.smoothing)+beta*this.smoothing;
        this._sg=this._sg*(1-this.smoothing)+gamma*this.smoothing;
        const nx=Math.max(-1,Math.min(1,this._sg/this.maxTilt));
        const ny=Math.max(-1,Math.min(1,(this._sb-45)/this.maxTilt));
        if(Math.abs(this._sg)>this.deadzone||Math.abs(this._sb-45)>this.deadzone){
          this._emit('tilt',{x:nx,y:ny,alpha:this._sa,beta:this._sb,gamma:this._sg});
        }
        if(Math.abs(gamma)>60)this._emit('shake',{direction:gamma>0?'right':'left'});
      });
      return this;
    }
    stop(){this._running=false;}
  }
  return{TiltDevice};
});
