/*!
 * BreakSim - Voronoi-based fracture and shatter simulation
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.BreakSim=f();})(typeof self!=='undefined'?self:this,function(){
  function dist(ax,ay,bx,by){return Math.sqrt((ax-bx)**2+(ay-by)**2);}
  class Shard{
    constructor(points,options={}){
      this.points=points;this.color=options.color||'#4af';
      const cx=points.reduce((s,p)=>s+p[0],0)/points.length;
      const cy=points.reduce((s,p)=>s+p[1],0)/points.length;
      this.cx=cx;this.cy=cy;this.x=0;this.y=0;this.vx=0;this.vy=0;
      const dx=cx-options.impactX||0,dy=cy-options.impactY||0;
      const d=dist(cx,cy,options.impactX||0,options.impactY||0)||1;
      const force=(options.force||300)/d;this.vx=dx/d*force;this.vy=dy/d*force;
      this.angle=0;this.angularV=(Math.random()-0.5)*0.2;this.gravity=options.gravity||0.3;this.friction=0.98;this.alive=true;
    }
    update(){this.vy+=this.gravity;this.vx*=this.friction;this.vy*=this.friction;this.x+=this.vx;this.y+=this.vy;this.angle+=this.angularV;}
    render(ctx){
      ctx.save();ctx.translate(this.cx+this.x,this.cy+this.y);ctx.rotate(this.angle);
      ctx.beginPath();const pts=this.points;ctx.moveTo(pts[0][0]-this.cx,pts[0][1]-this.cy);
      for(let i=1;i<pts.length;i++)ctx.lineTo(pts[i][0]-this.cx,pts[i][1]-this.cy);
      ctx.closePath();ctx.fillStyle=this.color+'cc';ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=1;ctx.stroke();ctx.restore();
    }
  }
  class Fracture{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');this.shards=[];this._running=false;
    }
    break(x,y,options={}){
      const W=this.canvas.width,H=this.canvas.height;
      const pts=options.region||[[0,0],[W,0],[W,H],[0,H]];
      const n=options.pieces||15;
      const seeds=[[x,y]];for(let i=1;i<n;i++)seeds.push([Math.random()*W,Math.random()*H]);
      const cells=seeds.map(()=>[]);
      const step=20;
      for(let py=0;py<H;py+=step)for(let px=0;px<W;px+=step){
        let best=0,bd=Infinity;seeds.forEach(([sx,sy],i)=>{const d=dist(px,py,sx,sy);if(d<bd){bd=d;best=i;}});cells[best].push([px,py]);
      }
      this.shards=seeds.map((s,i)=>{
        const c=cells[i];if(!c.length)return null;
        const hull=c.slice(0,Math.min(8,c.length));
        hull.push([s[0]-step/2,s[1]-step/2],[s[0]+step/2,s[1]-step/2],[s[0]+step/2,s[1]+step/2],[s[0]-step/2,s[1]+step/2]);
        return new Shard(hull.slice(0,8),{...options,impactX:x,impactY:y,color:options.color||'#4af'});
      }).filter(Boolean);
      if(!this._running)this.start();
    }
    start(){this._running=true;const loop=()=>{const{ctx,canvas}=this;ctx.clearRect(0,0,canvas.width,canvas.height);this.shards.forEach(s=>{s.update();s.render(ctx);});if(this._running)requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    stop(){this._running=false;}
  }
  return{Fracture,Shard};
});
