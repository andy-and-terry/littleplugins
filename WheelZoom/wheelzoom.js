/*!
 * WheelZoom - Smooth pinch and wheel zoom+pan handler for any element
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.WheelZoom=f();})(typeof self!=='undefined'?self:this,function(){
  class ZoomPan{
    constructor(el,options={}){
      this.el=typeof el==='string'?document.querySelector(el):el;
      this.minZoom=options.minZoom||0.1;this.maxZoom=options.maxZoom||10;
      this.friction=options.friction||0.92;this.onChange=options.onChange||null;
      this.x=options.x||0;this.y=options.y||0;this.scale=options.scale||1;
      this._vx=0;this._vy=0;this._dragging=false;this._lastX=0;this._lastY=0;
      this._prevDist=null;this._raf=null;this._bind();this._apply();
    }
    _bind(){
      const el=this.el;
      el.addEventListener('wheel',e=>{
        e.preventDefault();const f=e.deltaY<0?1.1:1/1.1;const r=el.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
        this.x=(this.x-mx)*f+mx;this.y=(this.y-my)*f+my;this.scale=Math.max(this.minZoom,Math.min(this.maxZoom,this.scale*f));
        this._apply();
      },{passive:false});
      el.addEventListener('mousedown',e=>{this._dragging=true;this._lastX=e.clientX;this._lastY=e.clientY;cancelAnimationFrame(this._raf);this._vx=0;this._vy=0;});
      document.addEventListener('mousemove',e=>{if(!this._dragging)return;const dx=e.clientX-this._lastX,dy=e.clientY-this._lastY;this._vx=dx*0.7+this._vx*0.3;this._vy=dy*0.7+this._vy*0.3;this.x+=dx;this.y+=dy;this._lastX=e.clientX;this._lastY=e.clientY;this._apply();});
      document.addEventListener('mouseup',()=>{if(!this._dragging)return;this._dragging=false;this._momentum();});
      el.addEventListener('touchstart',e=>{if(e.touches.length===2){this._prevDist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);}},{passive:true});
      el.addEventListener('touchmove',e=>{
        if(e.touches.length===2){const dist=Math.hypot(e.touches[0].clientX-e.touches[1].clientX,e.touches[0].clientY-e.touches[1].clientY);const f=dist/(this._prevDist||dist);this.scale=Math.max(this.minZoom,Math.min(this.maxZoom,this.scale*f));this._prevDist=dist;this._apply();}
      },{passive:true});
    }
    _momentum(){this._raf=requestAnimationFrame(()=>{this._vx*=this.friction;this._vy*=this.friction;this.x+=this._vx;this.y+=this._vy;this._apply();if(Math.abs(this._vx)>0.2||Math.abs(this._vy)>0.2)this._momentum();});}
    _apply(){this.el.style.transformOrigin='0 0';this.el.style.transform=`translate(${this.x}px,${this.y}px) scale(${this.scale})`;if(this.onChange)this.onChange({x:this.x,y:this.y,scale:this.scale});}
    reset(){this.x=0;this.y=0;this.scale=1;this._apply();}
    zoomTo(s,cx,cy){const f=s/this.scale;this.x=(this.x-(cx||0))*f+(cx||0);this.y=(this.y-(cy||0))*f+(cy||0);this.scale=s;this._apply();}
  }
  return{ZoomPan};
});
