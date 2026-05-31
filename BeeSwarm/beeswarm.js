/*!
 * BeeSwarm - Beeswarm plot with collision-avoidance layout
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.BeeSwarm=f();})(typeof self!=='undefined'?self:this,function(){
  class Swarm{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.data=[];this.radius=options.radius||5;this.iterations=options.iterations||200;
      this.axis=options.axis||'x';this.padding=options.padding||40;
      this.colors=options.colors||null;this.colorFn=options.colorFn||null;
      this.tooltip=options.tooltip||null;this._nodes=[];
      this._setupTooltip();
    }
    _setupTooltip(){if(!this.tooltip)return;this._tip=document.createElement('div');this._tip.style.cssText='position:fixed;background:#222;color:#fff;padding:4px 8px;border-radius:4px;font-size:12px;pointer-events:none;opacity:0;transition:opacity 0.1s';document.body.appendChild(this._tip);}
    setData(data){this.data=data;return this;}
    layout(){
      const{canvas,data,radius,iterations,padding}=this;
      const W=canvas.width,H=canvas.height;
      const vals=data.map(d=>d.value);const minV=Math.min(...vals),maxV=Math.max(...vals);
      const toPos=v=>(v-minV)/(maxV-minV||1)*(this.axis==='x'?W-padding*2:H-padding*2)+padding;
      this._nodes=data.map(d=>({...d,x:this.axis==='x'?toPos(d.value):W/2,y:this.axis==='y'?toPos(d.value):H/2}));
      for(let iter=0;iter<iterations;iter++){
        for(let i=0;i<this._nodes.length;i++){
          const a=this._nodes[i];
          for(let j=i+1;j<this._nodes.length;j++){
            const b=this._nodes[j];const dx=b.x-a.x,dy=b.y-a.y;
            const dist=Math.sqrt(dx*dx+dy*dy)||0.01;const min=radius*2+1;
            if(dist<min){const push=(min-dist)/2;const nx=dx/dist,ny=dy/dist;
              if(this.axis==='x'){a.y-=ny*push;b.y+=ny*push;}else{a.x-=nx*push;b.x+=nx*push;}
            }
          }
          if(this.axis==='x'){a.y=Math.max(padding,Math.min(H-padding,a.y));}
          else{a.x=Math.max(padding,Math.min(W-padding,a.x));}
        }
      }
      return this;
    }
    render(){
      const{ctx,canvas,_nodes,radius}=this;
      ctx.clearRect(0,0,canvas.width,canvas.height);
      ctx.strokeStyle='#444';ctx.lineWidth=1;
      if(this.axis==='x'){ctx.beginPath();ctx.moveTo(this.padding,canvas.height/2);ctx.lineTo(canvas.width-this.padding,canvas.height/2);ctx.stroke();}
      for(const n of _nodes){
        ctx.beginPath();ctx.arc(n.x,n.y,radius,0,Math.PI*2);
        ctx.fillStyle=this.colorFn?this.colorFn(n):this.colors&&n.group!==undefined?this.colors[n.group%this.colors.length]:'#4af';
        ctx.fill();ctx.strokeStyle='rgba(0,0,0,0.3)';ctx.lineWidth=0.5;ctx.stroke();
      }
    }
  }
  return{Swarm};
});
