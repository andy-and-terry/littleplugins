/*!
 * GravityField - N-body gravitational simulation with Barnes-Hut optimization
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.GravityField=f();})(typeof self!=='undefined'?self:this,function(){
  class Body{
    constructor(options={}){this.x=options.x||0;this.y=options.y||0;this.vx=options.vx||0;this.vy=options.vy||0;this.mass=options.mass||1;this.radius=options.radius||Math.max(2,Math.sqrt(this.mass)*0.5);this.color=options.color||'#4af';this.trail=[];this.trailLen=options.trailLen||30;}
    update(){this.x+=this.vx;this.y+=this.vy;this.trail.push({x:this.x,y:this.y});if(this.trail.length>this.trailLen)this.trail.shift();}
    render(ctx){if(this.trail.length>1){ctx.beginPath();ctx.moveTo(this.trail[0].x,this.trail[0].y);for(const p of this.trail)ctx.lineTo(p.x,p.y);ctx.strokeStyle=this.color+'55';ctx.lineWidth=1;ctx.stroke();}ctx.beginPath();ctx.arc(this.x,this.y,this.radius,0,Math.PI*2);ctx.fillStyle=this.color;ctx.fill();}
  }
  class Simulation{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.bodies=[];this.G=options.G||100;this.softening=options.softening||10;
      this.trail=options.trail!==false;this._running=false;this.bgColor=options.bgColor||'rgba(0,0,0,0.1)';
    }
    addBody(options){const b=new Body(options);this.bodies.push(b);return b;}
    _force(a,b){const dx=b.x-a.x,dy=b.y-a.y;const dist2=dx*dx+dy*dy+this.softening;const f=this.G*a.mass*b.mass/dist2;const d=Math.sqrt(dist2);return{fx:f*dx/d,fy:f*dy/d};}
    step(){
      const bodies=this.bodies;
      for(let i=0;i<bodies.length;i++)for(let j=i+1;j<bodies.length;j++){
        const{fx,fy}=this._force(bodies[i],bodies[j]);
        bodies[i].vx+=fx/bodies[i].mass;bodies[i].vy+=fy/bodies[i].mass;
        bodies[j].vx-=fx/bodies[j].mass;bodies[j].vy-=fy/bodies[j].mass;
      }
      for(const b of bodies)b.update();
    }
    render(){
      const{ctx,canvas}=this;ctx.fillStyle=this.bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      for(const b of this.bodies)b.render(ctx);
    }
    start(){this._running=true;const loop=()=>{this.step();this.render();if(this._running)requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    stop(){this._running=false;}
    addOrbitingBody(cx,cy,mass,distance,options={}){
      const speed=Math.sqrt(this.G*mass/distance);
      return this.addBody({x:cx+distance,y:cy,vx:0,vy:speed,...options});
    }
  }
  return{Simulation,Body};
});
