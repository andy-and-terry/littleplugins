/*!
 * WarpGrid - Grid-based distortion renderer
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.WarpGrid=factory();})(typeof self!=='undefined'?self:this,function(){
  class Grid {
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.cols=options.cols||20; this.rows=options.rows||15;
      this.speed=options.speed||0.02; this.amplitude=options.amplitude||30;
      this.color=options.color||'#4af'; this.lineWidth=options.lineWidth||1;
      this.time=0; this._running=false;
      this.distortFn=options.distortFn||null;
    }
    _defaultDistort(x,y,t){
      return{dx:Math.sin(y*0.5+t)*this.amplitude,dy:Math.cos(x*0.3+t*0.7)*this.amplitude};
    }
    render(){
      const{ctx,canvas,cols,rows,time,color,lineWidth}=this;
      const cw=canvas.width/(cols-1),ch=canvas.height/(rows-1);
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle=color; ctx.lineWidth=lineWidth;
      const pts=[];
      for(let j=0;j<rows;j++){pts[j]=[];for(let i=0;i<cols;i++){const bx=i*cw,by=j*ch;const fn=this.distortFn||this._defaultDistort.bind(this);const{dx,dy}=fn(i/(cols-1),j/(rows-1),time);pts[j][i]={x:bx+dx,y:by+dy};}}
      for(let j=0;j<rows;j++){ctx.beginPath();for(let i=0;i<cols;i++){if(i===0)ctx.moveTo(pts[j][i].x,pts[j][i].y);else ctx.lineTo(pts[j][i].x,pts[j][i].y);}ctx.stroke();}
      for(let i=0;i<cols;i++){ctx.beginPath();for(let j=0;j<rows;j++){if(j===0)ctx.moveTo(pts[j][i].x,pts[j][i].y);else ctx.lineTo(pts[j][i].x,pts[j][i].y);}ctx.stroke();}
    }
    start(){this._running=true;const loop=()=>{this.time+=this.speed;this.render();if(this._running)requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    stop(){this._running=false;}
  }
  return{Grid};
});
