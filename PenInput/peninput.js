/*!
 * PenInput - Stylus pressure and tilt API abstraction for drawing apps
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.PenInput=f();})(typeof self!=='undefined'?self:this,function(){
  class PenInput{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.smoothing=options.smoothing||0.5;this.minWidth=options.minWidth||1;this.maxWidth=options.maxWidth||20;
      this.color=options.color||'#fff';this.onDraw=options.onDraw||null;
      this._pts=[];this._down=false;this._lastX=0;this._lastY=0;this._lastP=0;
      this._bind();
    }
    _getPressure(e){if(e.pressure&&e.pressure>0)return e.pressure;if(e.touches&&e.touches[0]&&e.touches[0].force)return e.touches[0].force;return 0.5;}
    _getTiltX(e){return e.tiltX||0;}
    _getTiltY(e){return e.tiltY||0;}
    _getPos(e){const r=this.canvas.getBoundingClientRect();const src=e.touches?e.touches[0]:e;return{x:src.clientX-r.left,y:src.clientY-r.top};}
    _bind(){
      const c=this.canvas;
      const down=e=>{this._down=true;const{x,y}=this._getPos(e);this._pts=[{x,y,p:this._getPressure(e)}];this._lastX=x;this._lastY=y;this._lastP=0;e.preventDefault();};
      const move=e=>{
        if(!this._down)return;
        const{x,y}=this._getPos(e);const p=this._getPressure(e);
        const sp=this._lastP*(1-this.smoothing)+p*this.smoothing;
        const width=this.minWidth+(this.maxWidth-this.minWidth)*sp;
        const{ctx}=this;ctx.beginPath();ctx.moveTo(this._lastX,this._lastY);ctx.lineTo(x,y);
        ctx.strokeStyle=this.color;ctx.lineWidth=width;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
        if(this.onDraw)this.onDraw({x,y,pressure:p,tiltX:this._getTiltX(e),tiltY:this._getTiltY(e),width});
        this._pts.push({x,y,p});this._lastX=x;this._lastY=y;this._lastP=sp;e.preventDefault();
      };
      const up=()=>{this._down=false;};
      c.addEventListener('pointerdown',down,{passive:false});c.addEventListener('pointermove',move,{passive:false});c.addEventListener('pointerup',up);c.addEventListener('pointercancel',up);
    }
    setColor(c){this.color=c;return this;}
    clear(){this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);}
  }
  return{PenInput};
});
