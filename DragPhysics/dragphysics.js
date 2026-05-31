/*!
 * DragPhysics - Drag and drop with momentum, throw, and spring snap
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.DragPhysics=factory();})(typeof self!=='undefined'?self:this,function(){
  class Draggable {
    constructor(el,options={}){
      this.el=typeof el==='string'?document.querySelector(el):el;
      this.friction=options.friction||0.92;
      this.springStrength=options.springStrength||0.15;
      this.snapTargets=options.snapTargets||[];
      this.snapRadius=options.snapRadius||80;
      this.onSnap=options.onSnap||null;
      this.onThrow=options.onThrow||null;
      this._vx=0;this._vy=0;this._x=0;this._y=0;
      this._dragging=false;this._snapTarget=null;
      this._lastX=0;this._lastY=0;this._raf=null;
      const rect=this.el.getBoundingClientRect();
      this._x=rect.left; this._y=rect.top;
      this.el.style.position='fixed';
      this._bind();
    }
    _bind(){
      const el=this.el;
      el.addEventListener('mousedown',e=>{this._dragging=true;cancelAnimationFrame(this._raf);this._lastX=e.clientX;this._lastY=e.clientY;el.style.cursor='grabbing';e.preventDefault();});
      document.addEventListener('mousemove',e=>{if(!this._dragging)return;const dx=e.clientX-this._lastX,dy=e.clientY-this._lastY;this._vx=dx*0.7+this._vx*0.3;this._vy=dy*0.7+this._vy*0.3;this._x+=dx;this._y+=dy;this._lastX=e.clientX;this._lastY=e.clientY;this._applyPos();});
      document.addEventListener('mouseup',()=>{if(!this._dragging)return;this._dragging=false;this.el.style.cursor='grab';const snap=this._findSnap();if(snap){this._snapTarget=snap;this._animateSnap();}else{if(this.onThrow)this.onThrow({vx:this._vx,vy:this._vy});this._animateMomentum();}});
      el.style.cursor='grab';el.style.userSelect='none';
    }
    _applyPos(){this.el.style.left=this._x+'px';this.el.style.top=this._y+'px';}
    _findSnap(){let best=null,bestD=Infinity;for(const t of this.snapTargets){const tx=t.x!==undefined?t.x:t.getBoundingClientRect().left;const ty=t.y!==undefined?t.y:t.getBoundingClientRect().top;const d=Math.hypot(this._x-tx,this._y-ty);if(d<this.snapRadius&&d<bestD){bestD=d;best={x:tx,y:ty,target:t};}}return best;}
    _animateMomentum(){this._raf=requestAnimationFrame(()=>{this._vx*=this.friction;this._vy*=this.friction;this._x+=this._vx;this._y+=this._vy;this._applyPos();if(Math.abs(this._vx)>0.1||Math.abs(this._vy)>0.1)this._animateMomentum();});}
    _animateSnap(){const{x,y}=this._snapTarget;this._raf=requestAnimationFrame(()=>{const dx=x-this._x,dy=y-this._y;this._vx=dx*this.springStrength;this._vy=dy*this.springStrength;this._x+=this._vx;this._y+=this._vy;this._applyPos();if(Math.abs(dx)>0.5||Math.abs(dy)>0.5){this._animateSnap();}else{this._x=x;this._y=y;this._applyPos();if(this.onSnap)this.onSnap(this._snapTarget);}});}
    addSnapTarget(x,y){this.snapTargets.push({x,y});return this;}
    setPosition(x,y){this._x=x;this._y=y;this._applyPos();}
  }
  return{Draggable};
});
