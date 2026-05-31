/*!
 * FluidCanvas - Eulerian fluid simulation
 * MIT License
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.FluidCanvas = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  class Fluid {
    constructor(canvas, options={}) {
      this.canvas = typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx = this.canvas.getContext('2d');
      this.N = options.N||64; this.iter = options.iter||4;
      const size = (this.N+2)*(this.N+2);
      this.u=new Float32Array(size); this.v=new Float32Array(size);
      this.u_prev=new Float32Array(size); this.v_prev=new Float32Array(size);
      this.dens=new Float32Array(size); this.dens_prev=new Float32Array(size);
      this.visc=options.visc||0.0001; this.diff=options.diff||0.0001;
      this.dt=options.dt||0.1; this._running=false;
      this._bind();
    }
    IX(i,j){return i+(this.N+2)*j;}
    addDensity(x,y,amt){this.dens[this.IX(x,y)]+=amt;}
    addVelocity(x,y,ax,ay){const i=this.IX(x,y);this.u[i]+=ax;this.v[i]+=ay;}
    _bnd(b,x){const N=this.N;for(let i=1;i<=N;i++){x[this.IX(0,i)]=b===1?-x[this.IX(1,i)]:x[this.IX(1,i)];x[this.IX(N+1,i)]=b===1?-x[this.IX(N,i)]:x[this.IX(N,i)];x[this.IX(i,0)]=b===2?-x[this.IX(i,1)]:x[this.IX(i,1)];x[this.IX(i,N+1)]=b===2?-x[this.IX(i,N)]:x[this.IX(i,N)];}x[this.IX(0,0)]=0.5*(x[this.IX(1,0)]+x[this.IX(0,1)]);x[this.IX(0,N+1)]=0.5*(x[this.IX(1,N+1)]+x[this.IX(0,N)]);x[this.IX(N+1,0)]=0.5*(x[this.IX(N,0)]+x[this.IX(N+1,1)]);x[this.IX(N+1,N+1)]=0.5*(x[this.IX(N,N+1)]+x[this.IX(N+1,N)]);}
    _diffuse(b,x,x0){const a=this.dt*this.diff*this.N*this.N,N=this.N;for(let k=0;k<this.iter;k++){for(let i=1;i<=N;i++)for(let j=1;j<=N;j++)x[this.IX(i,j)]=(x0[this.IX(i,j)]+a*(x[this.IX(i-1,j)]+x[this.IX(i+1,j)]+x[this.IX(i,j-1)]+x[this.IX(i,j+1)]))/(1+4*a);this._bnd(b,x);}}
    _advect(b,d,d0,u,v){const N=this.N,dt0=this.dt*N;for(let i=1;i<=N;i++){for(let j=1;j<=N;j++){let x=i-dt0*u[this.IX(i,j)],y=j-dt0*v[this.IX(i,j)];if(x<0.5)x=0.5;if(x>N+0.5)x=N+0.5;const i0=Math.floor(x),i1=i0+1;if(y<0.5)y=0.5;if(y>N+0.5)y=N+0.5;const j0=Math.floor(y),j1=j0+1;const s1=x-i0,s0=1-s1,t1=y-j0,t0=1-t1;d[this.IX(i,j)]=s0*(t0*d0[this.IX(i0,j0)]+t1*d0[this.IX(i0,j1)])+s1*(t0*d0[this.IX(i1,j0)]+t1*d0[this.IX(i1,j1)]);}}this._bnd(b,d);}
    _project(u,v){const N=this.N,p=new Float32Array(u.length),div=new Float32Array(u.length);for(let i=1;i<=N;i++)for(let j=1;j<=N;j++){div[this.IX(i,j)]=-0.5*(u[this.IX(i+1,j)]-u[this.IX(i-1,j)]+v[this.IX(i,j+1)]-v[this.IX(i,j-1)])/N;p[this.IX(i,j)]=0;}this._bnd(0,div);this._bnd(0,p);for(let k=0;k<this.iter;k++){for(let i=1;i<=N;i++)for(let j=1;j<=N;j++)p[this.IX(i,j)]=(div[this.IX(i,j)]+p[this.IX(i-1,j)]+p[this.IX(i+1,j)]+p[this.IX(i,j-1)]+p[this.IX(i,j+1)])/4;this._bnd(0,p);}for(let i=1;i<=N;i++)for(let j=1;j<=N;j++){u[this.IX(i,j)]-=0.5*N*(p[this.IX(i+1,j)]-p[this.IX(i-1,j)]);v[this.IX(i,j)]-=0.5*N*(p[this.IX(i,j+1)]-p[this.IX(i,j-1)]);}this._bnd(1,u);this._bnd(2,v);}
    step(){this._diffuse(1,this.u_prev,this.u);this._diffuse(2,this.v_prev,this.v);this._project(this.u_prev,this.v_prev);this._advect(1,this.u,this.u_prev,this.u_prev,this.v_prev);this._advect(2,this.v,this.v_prev,this.u_prev,this.v_prev);this._project(this.u,this.v);this._diffuse(0,this.dens_prev,this.dens);this._advect(0,this.dens,this.dens_prev,this.u,this.v);for(let i=0;i<this.dens.length;i++)this.dens[i]*=0.99;}
    render(){const{ctx,canvas,N}=this;const cw=canvas.width/N,ch=canvas.height/N;ctx.clearRect(0,0,canvas.width,canvas.height);for(let i=1;i<=N;i++)for(let j=1;j<=N;j++){const d=Math.min(this.dens[this.IX(i,j)]*255,255);ctx.fillStyle=`rgba(${Math.floor(d*0.4)},${Math.floor(d*0.7)},${Math.floor(d)},0.9)`;ctx.fillRect((i-1)*cw,(j-1)*ch,cw+1,ch+1);}}
    _bind(){const c=this.canvas;let down=false,px=0,py=0;c.addEventListener('mousedown',()=>down=true);c.addEventListener('mouseup',()=>down=false);c.addEventListener('mousemove',e=>{if(!down)return;const r=c.getBoundingClientRect();const x=Math.max(1,Math.min(this.N,Math.floor((e.clientX-r.left)/c.width*this.N)+1));const y=Math.max(1,Math.min(this.N,Math.floor((e.clientY-r.top)/c.height*this.N)+1));this.addDensity(x,y,50);this.addVelocity(x,y,(e.clientX-r.left-px)*3,(e.clientY-r.top-py)*3);px=e.clientX-r.left;py=e.clientY-r.top;});}
    start(){this._running=true;const loop=()=>{this.step();this.render();if(this._running)requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    stop(){this._running=false;}
  }
  return {Fluid};
});
