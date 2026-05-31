/*!
 * CursorFX - Custom cursor engine with trail, morph, and magnetic snap
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.CursorFX=f();})(typeof self!=='undefined'?self:this,function(){
  class Cursor{
    constructor(options={}){
      this.trailLength=options.trailLength||20;this.trailColor=options.trailColor||'rgba(74,170,255,0.4)';
      this.trailWidth=options.trailWidth||3;this.morphTargets=options.morphTargets||[];
      this.magnetRadius=options.magnetRadius||80;this.magnetStrength=options.magnetStrength||0.3;
      this._pts=[];this._mx=0;this._my=0;this._rx=0;this._ry=0;this._raf=null;
      this._canvas=document.createElement('canvas');this._canvas.style.cssText='position:fixed;top:0;left:0;pointer-events:none;z-index:99999';document.body.appendChild(this._canvas);this._ctx=this._canvas.getContext('2d');
      this._resize();window.addEventListener('resize',()=>this._resize());document.addEventListener('mousemove',e=>{this._mx=e.clientX;this._my=e.clientY;});
      document.body.style.cursor='none';this._start();
    }
    _resize(){this._canvas.width=window.innerWidth;this._canvas.height=window.innerHeight;}
    _getTarget(){let best=null,bestD=Infinity;for(const t of this.morphTargets){const r=t.getBoundingClientRect();const cx=r.left+r.width/2,cy=r.top+r.height/2;const d=Math.hypot(this._rx-cx,this._ry-cy);if(d<this.magnetRadius&&d<bestD){bestD=d;best={cx,cy,d,el:t};}}return best;}
    _start(){const loop=()=>{const target=this._getTarget();if(target){const pull=1-target.d/this.magnetRadius;this._rx+=(target.cx-this._rx)*this.magnetStrength*pull;this._ry+=(target.cy-this._ry)*this.magnetStrength*pull;}else{this._rx+=(this._mx-this._rx)*0.15;this._ry+=(this._my-this._ry)*0.15;}this._pts.push({x:this._rx,y:this._ry});if(this._pts.length>this.trailLength)this._pts.shift();this._draw();requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    _draw(){const{_ctx:ctx,_canvas:c,_pts:pts,_rx:x,_ry:y}=this;ctx.clearRect(0,0,c.width,c.height);if(pts.length>1){for(let i=1;i<pts.length;i++){const alpha=(i/pts.length)*0.8;ctx.beginPath();ctx.moveTo(pts[i-1].x,pts[i-1].y);ctx.lineTo(pts[i].x,pts[i].y);ctx.strokeStyle=this.trailColor.replace(/[\d.]+\)$/,alpha+')');ctx.lineWidth=this.trailWidth*(i/pts.length);ctx.lineCap='round';ctx.stroke();}}ctx.beginPath();ctx.arc(x,y,6,0,Math.PI*2);ctx.fillStyle='#fff';ctx.fill();}
    addMagnetTarget(el){this.morphTargets.push(typeof el==='string'?document.querySelector(el):el);return this;}
    destroy(){this._canvas.remove();document.body.style.cursor='';}
  }
  return{Cursor};
});
