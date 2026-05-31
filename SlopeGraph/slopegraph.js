/*!
 * SlopeGraph - Slopegraph for comparing rankings at two time points
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.SlopeGraph=f();})(typeof self!=='undefined'?self:this,function(){
  class SlopeGraph{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.data=[];this.padding=options.padding||{top:40,right:120,bottom:40,left:120};
      this.colors=options.colors||['#4af','#f84','#4f8','#f4a','#af4'];
      this.labelA=options.labelA||'Before';this.labelB=options.labelB||'After';
    }
    setData(data){this.data=data;return this;}
    render(){
      const{ctx,canvas,data,padding:p}=this;
      if(!data.length)return;
      const W=canvas.width,H=canvas.height;
      const cH=H-p.top-p.bottom;
      const allVals=[...data.map(d=>d.a),...data.map(d=>d.b)];
      const minV=Math.min(...allVals),maxV=Math.max(...allVals);
      const toY=v=>p.top+cH-(v-minV)/(maxV-minV||1)*cH;
      const xA=p.left,xB=W-p.right;
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d0d1a';ctx.fillRect(0,0,W,H);
      ctx.fillStyle='#666';ctx.font='13px sans-serif';ctx.textAlign='center';
      ctx.fillText(this.labelA,xA,p.top-16);ctx.fillText(this.labelB,xB,p.top-16);
      ctx.strokeStyle='#333';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(xA,p.top-5);ctx.lineTo(xA,p.top+cH+5);ctx.stroke();
      ctx.beginPath();ctx.moveTo(xB,p.top-5);ctx.lineTo(xB,p.top+cH+5);ctx.stroke();
      data.forEach((d,i)=>{
        const color=d.color||this.colors[i%this.colors.length];
        const ya=toY(d.a),yb=toY(d.b);
        ctx.beginPath();ctx.moveTo(xA,ya);ctx.lineTo(xB,yb);ctx.strokeStyle=color+'99';ctx.lineWidth=2;ctx.stroke();
        ctx.fillStyle=color;[{x:xA,y:ya},{x:xB,y:yb}].forEach(({x,y})=>{ctx.beginPath();ctx.arc(x,y,4,0,Math.PI*2);ctx.fill();});
        ctx.fillStyle='#ddd';ctx.font='12px sans-serif';
        ctx.textAlign='right';ctx.fillText(`${d.label} (${d.a})`,xA-8,ya+4);
        ctx.textAlign='left';ctx.fillText(`${d.label} (${d.b})`,xB+8,yb+4);
      });
    }
  }
  return{SlopeGraph};
});
