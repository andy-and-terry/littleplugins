/*!
 * PointerTrail - Records and replays pointer paths with timing
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.PointerTrail=factory();})(typeof self!=='undefined'?self:this,function(){
  class Trail{
    constructor(el,options={}){this.el=typeof el==='string'?document.querySelector(el):el;this.color=options.color||'rgba(74,170,255,0.6)';this.width=options.width||3;this.maxLen=options.maxLen||80;this.fade=options.fade!==false;this._pts=[];this._times=[];this._raf=null;this._canvas=document.createElement('canvas');this._canvas.style.cssText='position:fixed;top:0;left:0;pointer-events:none;z-index:9999';document.body.appendChild(this._canvas);this._ctx=this._canvas.getContext('2d');this._resize();window.addEventListener('resize',()=>this._resize());this._recording=false;this._recorded=[];}
    _resize(){this._canvas.width=window.innerWidth;this._canvas.height=window.innerHeight;}
    _bind(){const fn=e=>{this._pts.push({x:e.clientX,y:e.clientY});this._times.push(Date.now());if(this._pts.length>this.maxLen){this._pts.shift();this._times.shift();}if(this._recording)this._recorded.push({x:e.clientX,y:e.clientY,t:Date.now()});};this.el.addEventListener('mousemove',fn);return fn;}
    start(){const fn=this._bind();this._raf=requestAnimationFrame(()=>this._draw());this._stopFn=fn;}
    _draw(){const{_ctx:ctx,_pts:pts,_canvas:c}=this;ctx.clearRect(0,0,c.width,c.height);if(pts.length>1){for(let i=1;i<pts.length;i++){const alpha=this.fade?(i/pts.length)*0.8:0.8;ctx.beginPath();ctx.moveTo(pts[i-1].x,pts[i-1].y);ctx.lineTo(pts[i].x,pts[i].y);ctx.strokeStyle=this.color.replace(/[\d.]+\)$/,alpha+')');ctx.lineWidth=this.width*(this.fade?i/pts.length:1);ctx.lineCap='round';ctx.stroke();}}this._raf=requestAnimationFrame(()=>this._draw());}
    record(){this._recording=true;this._recorded=[];return this;}
    stopRecord(){this._recording=false;return this._recorded.slice();}
    replay(data,speed=1){let i=0;const t0=data[0].t;const go=()=>{if(i>=data.length)return;const delay=(data[i].t-t0)/speed;setTimeout(()=>{this._pts.push(data[i]);this._times.push(Date.now());if(this._pts.length>this.maxLen){this._pts.shift();this._times.shift();}i++;go();},i===0?0:delay-(data[i-1]?delay:0));};go();}
    destroy(){cancelAnimationFrame(this._raf);this._canvas.remove();}
  }
  return{Trail};
});
