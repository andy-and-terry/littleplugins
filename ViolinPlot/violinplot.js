/*!
 * ViolinPlot - Violin and box-plot combined renderer
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.ViolinPlot=f();})(typeof self!=='undefined'?self:this,function(){
  function kde(data,bw){return x=>{let sum=0;for(const d of data){const z=(x-d)/bw;sum+=Math.exp(-0.5*z*z);}return sum/(data.length*bw*Math.sqrt(2*Math.PI));};}
  class ViolinPlot{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.groups=[];this.padding=options.padding||{top:30,right:20,bottom:40,left:50};
      this.colors=options.colors||['#4af','#f84','#4f8','#f4a'];this.bw=options.bandwidth||5;
    }
    setData(groups){this.groups=groups;return this;}
    render(){
      const{ctx,canvas,groups,padding:p}=this;if(!groups.length)return;
      const W=canvas.width,H=canvas.height;const cH=H-p.top-p.bottom;
      const allVals=groups.flatMap(g=>g.data);const minV=Math.min(...allVals),maxV=Math.max(...allVals);
      const toY=v=>p.top+cH-(v-minV)/(maxV-minV||1)*cH;
      const colW=(W-p.left-p.right)/groups.length;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d0d1a';ctx.fillRect(0,0,W,H);
      ctx.strokeStyle='#333';ctx.lineWidth=1;
      for(let i=0;i<=4;i++){const y=p.top+i*cH/4;ctx.beginPath();ctx.moveTo(p.left,y);ctx.lineTo(W-p.right,y);ctx.stroke();ctx.fillStyle='#555';ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText((maxV-i*(maxV-minV)/4).toFixed(1),p.left-4,y+4);}
      groups.forEach((g,gi)=>{
        const cx=p.left+gi*colW+colW/2;const halfW=colW*0.35;const color=g.color||this.colors[gi%this.colors.length];
        const kdeF=kde(g.data,this.bw);const steps=50;const ys=[];for(let i=0;i<=steps;i++)ys.push(minV+i*(maxV-minV)/steps);
        const dens=ys.map(v=>kdeF(v));const maxD=Math.max(...dens)||1;
        ctx.beginPath();ys.forEach((v,i)=>{const y=toY(v);const w=dens[i]/maxD*halfW;if(i===0)ctx.moveTo(cx+w,y);else ctx.lineTo(cx+w,y);});
        [...ys].reverse().forEach((v,i)=>{const y=toY(v);const ri=ys.length-1-i;const w=dens[ri]/maxD*halfW;ctx.lineTo(cx-w,y);});
        ctx.closePath();ctx.fillStyle=color+'55';ctx.fill();ctx.strokeStyle=color;ctx.lineWidth=1.5;ctx.stroke();
        const sorted=g.data.slice().sort((a,b)=>a-b);const q1=sorted[Math.floor(sorted.length*0.25)];const med=sorted[Math.floor(sorted.length*0.5)];const q3=sorted[Math.floor(sorted.length*0.75)];
        ctx.fillStyle='rgba(255,255,255,0.15)';ctx.fillRect(cx-halfW*0.3,toY(q3),halfW*0.6,toY(q1)-toY(q3));
        ctx.strokeStyle='#fff';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(cx-halfW*0.3,toY(med));ctx.lineTo(cx+halfW*0.3,toY(med));ctx.stroke();
        ctx.fillStyle='#aaa';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(g.label||`G${gi}`,cx,H-p.bottom+18);
      });
    }
  }
  return{ViolinPlot};
});
