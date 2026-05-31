/*!
 * ChainPhys - Rope and chain simulation
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ChainPhys=factory();})(typeof self!=='undefined'?self:this,function(){
  class Chain {
    constructor(options={}){
      this.segments=options.segments||20;this.segLen=options.segLen||15;
      this.gravity=options.gravity||0.5;this.iterations=options.iterations||20;
      this.stiffness=options.stiffness||1;this.damping=options.damping||0.98;
      this.color=options.color||'#aaa';this.lineWidth=options.lineWidth||3;
      const sx=options.x||200,sy=options.y||100;
      this.points=[];
      for(let i=0;i<this.segments+1;i++)this.points.push({x:sx,y:sy+i*this.segLen,px:sx,py:sy+i*this.segLen,pinned:i===0});
      if(options.pinEnd)this.points[this.segments].pinned=true;
    }
    pin(idx,x,y){if(this.points[idx]){this.points[idx].pinned=true;if(x!==undefined)this.points[idx].x=x;if(y!==undefined)this.points[idx].y=y;}}
    unpin(idx){if(this.points[idx])this.points[idx].pinned=false;}
    setPos(idx,x,y){const p=this.points[idx];if(p){p.x=x;p.y=y;p.px=x;p.py=y;}}
    update(){
      for(const p of this.points){
        if(p.pinned)continue;
        const vx=(p.x-p.px)*this.damping,vy=(p.y-p.py)*this.damping;
        p.px=p.x;p.py=p.y;p.x+=vx;p.y+=vy+this.gravity;
      }
      for(let iter=0;iter<this.iterations;iter++){
        for(let i=0;i<this.points.length-1;i++){
          const a=this.points[i],b=this.points[i+1];
          const dx=b.x-a.x,dy=b.y-a.y;
          const dist=Math.sqrt(dx*dx+dy*dy)||1;
          const diff=(dist-this.segLen)/dist*0.5*this.stiffness;
          if(!a.pinned){a.x+=dx*diff;a.y+=dy*diff;}
          if(!b.pinned){b.x-=dx*diff;b.y-=dy*diff;}
        }
      }
    }
    render(ctx){
      const pts=this.points;
      ctx.beginPath();ctx.moveTo(pts[0].x,pts[0].y);
      for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i].x,pts[i].y);
      ctx.strokeStyle=this.color;ctx.lineWidth=this.lineWidth;ctx.lineCap='round';ctx.lineJoin='round';ctx.stroke();
      for(const p of pts.filter(p=>p.pinned)){ctx.beginPath();ctx.arc(p.x,p.y,5,0,Math.PI*2);ctx.fillStyle='#f84';ctx.fill();}
    }
  }
  return{Chain};
});
