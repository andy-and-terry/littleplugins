/*!
 * ElasticSnap - Spring-based UI animation physics for elastic effects
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.ElasticSnap=f();})(typeof self!=='undefined'?self:this,function(){
  class Spring{
    constructor(options={}){
      this.stiffness=options.stiffness||0.2;this.damping=options.damping||0.75;this.mass=options.mass||1;
      this.value=options.value||0;this.velocity=0;this.target=options.target||0;
      this._raf=null;this._onChange=options.onChange||null;
    }
    setTarget(t){this.target=t;this._animate();return this;}
    setValue(v){this.value=v;this.velocity=0;if(this._onChange)this._onChange(v);return this;}
    _animate(){cancelAnimationFrame(this._raf);const step=()=>{const force=(this.target-this.value)*this.stiffness;const damp=this.velocity*this.damping;this.velocity+=(force-damp)/this.mass;this.value+=this.velocity;if(this._onChange)this._onChange(this.value);const settled=Math.abs(this.target-this.value)<0.01&&Math.abs(this.velocity)<0.01;if(!settled)this._raf=requestAnimationFrame(step);else{this.value=this.target;this.velocity=0;if(this._onChange)this._onChange(this.value);}};this._raf=requestAnimationFrame(step);}
    stop(){cancelAnimationFrame(this._raf);}
  }
  class SpringVec2{
    constructor(options={}){
      this.x=new Spring({stiffness:options.stiffness||0.2,damping:options.damping||0.75,value:options.x||0,onChange:()=>this._emit()});
      this.y=new Spring({stiffness:options.stiffness||0.2,damping:options.damping||0.75,value:options.y||0,onChange:()=>this._emit()});
      this._onChange=options.onChange||null;
    }
    _emit(){if(this._onChange)this._onChange({x:this.x.value,y:this.y.value});}
    setTarget(x,y){this.x.setTarget(x);this.y.setTarget(y);return this;}
    getValue(){return{x:this.x.value,y:this.y.value};}
    stop(){this.x.stop();this.y.stop();}
  }
  return{Spring,SpringVec2};
});
