/*!
 * HexBin - Hexagonal binning renderer for dense scatter data
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.HexBin=f();})(typeof self!=='undefined'?self:this,function(){
  class HexBin{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.radius=options.radius||20;this.padding=options.padding||40;
      this.colorLow=options.colorLow||[13,13,26];this.colorHigh=options.colorHigh||[74,170,255];
    }
    setData(points){this.points=points;return this;}
    _hexCenter(col,row){const r=this.radius;const w=r*2,h=Math.sqrt(3)*r;return{x:col*w*0.75+r+this.padding,y:row*h+(col%2?h/2:0)+this.padding};}
    _hexPath(cx,cy){const r=this.radius;const ctx=this.ctx;ctx.beginPath();for(let i=0;i<6;i++){const a=Math.PI/180*(60*i-30);ctx.lineTo(cx+r*Math.cos(a),cy+r*Math.sin(a));}ctx.closePath();}
    _lerp(a,b,t){return a+(b-a)*t;}
    render(){
      const{ctx,canvas,radius,padding}=this;
      const W=canvas.width,H=canvas.height;
      const hexW=radius*2,hexH=Math.sqrt(3)*radius;
      const cols=Math.ceil((W-padding*2)/(hexW*0.75))+1;
      const rows=Math.ceil((H-padding*2)/hexH)+1;
      const bins={};
      for(const p of this.points||[]){
        const col=Math.round((p.x-padding)/(hexW*0.75));
        const row=Math.round((p.y-padding-(col%2?hexH/2:0))/hexH);
        const key=`${col},${row}`;bins[key]=(bins[key]||0)+1;
      }
      const maxBin=Math.max(1,...Object.values(bins));
      ctx.clearRect(0,0,W,H);ctx.fillStyle='#0d0d1a';ctx.fillRect(0,0,W,H);
      for(let c=0;c<cols;c++)for(let rr=0;rr<rows;rr++){
        const{x,y}=this._hexCenter(c,rr);if(x>W||y>H)continue;
        const count=bins[`${c},${rr}`]||0;const t=count/maxBin;
        const cr=this.colorLow,ch=this.colorHigh;
        ctx.fillStyle=`rgba(${Math.round(this._lerp(cr[0],ch[0],t))},${Math.round(this._lerp(cr[1],ch[1],t))},${Math.round(this._lerp(cr[2],ch[2],t))},${0.2+t*0.8})`;
        this._hexPath(x,y);ctx.fill();
        if(count>0){ctx.strokeStyle='rgba(255,255,255,0.1)';ctx.lineWidth=0.5;this._hexPath(x,y);ctx.stroke();}
      }
    }
  }
  return{HexBin};
});
