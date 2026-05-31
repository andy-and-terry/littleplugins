/*!
 * ScrollMomentum - Inertial scroll with configurable friction
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ScrollMomentum=factory();})(typeof self!=='undefined'?self:this,function(){
  class Scroller {
    constructor(el,options={}){
      this.el=typeof el==='string'?document.querySelector(el):el;
      this.friction=options.friction!==undefined?options.friction:0.92;
      this.speedMult=options.speedMult||1;
      this.horizontal=options.horizontal||false;
      this.vertical=options.vertical!==false;
      this.onScroll=options.onScroll||null;
      this._vx=0;this._vy=0;this._raf=null;
      this._isDragging=false;this._lastX=0;this._lastY=0;
      this._bind();
    }
    _bind(){
      const el=this.el;
      el.addEventListener('wheel',e=>{
        e.preventDefault();
        cancelAnimationFrame(this._raf);
        this._vy+=e.deltaY*this.speedMult*0.5;
        if(this.horizontal)this._vx+=e.deltaX*this.speedMult*0.5;
        this._animate();
      },{passive:false});
      el.addEventListener('mousedown',e=>{this._isDragging=true;this._lastX=e.clientX;this._lastY=e.clientY;cancelAnimationFrame(this._raf);this._vx=0;this._vy=0;el.style.cursor='grabbing';e.preventDefault();});
      document.addEventListener('mousemove',e=>{
        if(!this._isDragging)return;
        const dx=e.clientX-this._lastX,dy=e.clientY-this._lastY;
        this._vx=dx*0.7+this._vx*0.3;this._vy=dy*0.7+this._vy*0.3;
        if(this.horizontal)el.scrollLeft-=dx;
        if(this.vertical)el.scrollTop-=dy;
        this._lastX=e.clientX;this._lastY=e.clientY;
        if(this.onScroll)this.onScroll({scrollLeft:el.scrollLeft,scrollTop:el.scrollTop});
      });
      document.addEventListener('mouseup',()=>{if(!this._isDragging)return;this._isDragging=false;el.style.cursor='';this._animate();});
    }
    _animate(){
      this._raf=requestAnimationFrame(()=>{
        if(this.vertical){this.el.scrollTop+=this._vy;this._vy*=this.friction;}
        if(this.horizontal){this.el.scrollLeft+=this._vx;this._vx*=this.friction;}
        if(this.onScroll)this.onScroll({scrollLeft:this.el.scrollLeft,scrollTop:this.el.scrollTop});
        if(Math.abs(this._vy)>0.2||Math.abs(this._vx)>0.2)this._animate();
      });
    }
    scrollTo(x,y,animated=true){
      if(!animated){this.el.scrollLeft=x;this.el.scrollTop=y;return;}
      this._vx=(x-this.el.scrollLeft)*0.1;this._vy=(y-this.el.scrollTop)*0.1;this._animate();
    }
    stop(){cancelAnimationFrame(this._raf);this._vx=0;this._vy=0;}
  }
  return{Scroller};
});
