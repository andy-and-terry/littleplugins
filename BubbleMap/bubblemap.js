/*!
 * BubbleMap - Proportional symbol / bubble chart on canvas
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.BubbleMap=f();})(typeof self!=='undefined'?self:this,function(){
  class BubbleMap{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.data=[];this.maxRadius=options.maxRadius||50;this.minRadius=options.minRadius||5;
      this.bgColor=options.bgColor||'#0d0d1a';this.colors=options.colors||['#4af','#f84','#4f8','#f4a'];
      this.padding=options.padding||60;this.labeled=options.labeled!==false;
      this.onHover=options.onHover||null;this._hovered=null;this._bind();
    }
    setData(data){this.data=data;return this;}
    _bind(){
      const c=this.canvas;
      c.addEventListener('mousemove',e=>{
        const r=c.getBoundingClientRect();const mx=e.clientX-r.left,my=e.clientY-r.top;
        this._hovered=null;
        for(const n of this._nodes||[]){if(Math.hypot(mx-n.x,my-n.y)<n.r){this._hovered=n;break;}}
        if(this.onHover)this.onHover(this._hovered);this.render();
      });
    }
    layout(){
      const{data,canvas,padding,maxRadius,minRadius}=this;
      const W=canvas.width-padding*2,H=canvas.height-padding*2;
      const vals=data.map(d=>d.value);const maxV=Math.max(...vals)||1;
      this._nodes=data.map((d,i)=>{
        const r=minRadius+(d.value/maxV)*(maxRadius-minRadius);
        const angle=(i/data.length)*Math.PI*2;const radius=Math.min(W,H)*0.3;
        return{...d,x:W/2+padding+Math.cos(angle)*radius,y:H/2+padding+Math.sin(angle)*radius,r,color:d.color||this.colors[i%this.colors.length]};
      });
      return this;
    }
    render(){
      const{ctx,canvas,bgColor}=this;ctx.fillStyle=bgColor;ctx.fillRect(0,0,canvas.width,canvas.height);
      for(const n of this._nodes||[]){
        const isH=this._hovered===n;
        ctx.beginPath();ctx.arc(n.x,n.y,n.r*(isH?1.1:1),0,Math.PI*2);
        ctx.fillStyle=n.color+(isH?'ff':'bb');ctx.fill();
        ctx.strokeStyle=isH?'#fff':'rgba(255,255,255,0.2)';ctx.lineWidth=isH?2:1;ctx.stroke();
        if(this.labeled){ctx.fillStyle='#fff';ctx.font=`${Math.max(10,n.r*0.4)}px sans-serif`;ctx.textAlign='center';ctx.textBaseline='middle';ctx.fillText(n.label||'',n.x,n.y);}
        if(isH){ctx.fillStyle='#fff';ctx.font='11px sans-serif';ctx.fillText(n.value,n.x,n.y+n.r+14);}
      }
    }
  }
  return{BubbleMap};
});
