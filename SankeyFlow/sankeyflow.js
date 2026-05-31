/*!
 * SankeyFlow - Sankey diagram engine
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.SankeyFlow=factory();})(typeof self!=='undefined'?self:this,function(){
  class Sankey{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.nodes=[];this.links=[];
      this.nodeW=options.nodeW||20;this.nodePad=options.nodePad||10;
      this.colors=options.colors||['#4af','#f84','#4f8','#f4a','#af4','#a4f'];
    }
    addNode(id,label,options={}){this.nodes.push({id,label,color:options.color||null,value:0});return this;}
    addLink(source,target,value){this.links.push({source,target,value});return this;}
    _layout(){
      const W=this.canvas.width,H=this.canvas.height,nw=this.nodeW,pad=this.nodePad;
      const nodeMap={};this.nodes.forEach((n,i)=>{nodeMap[n.id]=n;n.color=n.color||this.colors[i%this.colors.length];n.inValue=0;n.outValue=0;});
      this.links.forEach(l=>{nodeMap[l.source].outValue+=l.value;nodeMap[l.target].inValue+=l.value;});
      this.nodes.forEach(n=>{n.value=Math.max(n.inValue,n.outValue)||1;});
      const cols={};this.links.forEach(l=>{const s=nodeMap[l.source],t=nodeMap[l.target];if(s.col===undefined)s.col=0;t.col=Math.max(t.col||0,(s.col||0)+1);});
      this.nodes.forEach(n=>{if(n.col===undefined)n.col=0;if(!cols[n.col])cols[n.col]=[];cols[n.col].push(n);});
      const ncols=Object.keys(cols).length;
      const colW=(W-nw)/(ncols-1||1);
      const totalH=H-pad*2;
      Object.entries(cols).forEach(([col,nodes])=>{
        const totalVal=nodes.reduce((s,n)=>s+n.value,0);
        let cy=pad;
        nodes.forEach(n=>{n.x=parseInt(col)*colW;n.h=Math.max(10,n.value/totalVal*(totalH-(nodes.length-1)*pad));n.y=cy;cy+=n.h+pad;});
      });
      this.links.forEach(l=>{const s=nodeMap[l.source],t=nodeMap[l.target];if(!s._outY)s._outY=s.y;if(!t._inY)t._inY=t.y;l._sy=s._outY;l._ty=t._inY;const lh=l.value/s.value*s.h;s._outY+=lh;l._th=l.value/t.value*t.h;t._inY+=l._th;l._sh=lh;});
    }
    render(){
      const{ctx,canvas,nodeW}=this;
      this._layout();
      ctx.clearRect(0,0,canvas.width,canvas.height);
      const nodeMap={};this.nodes.forEach(n=>nodeMap[n.id]=n);
      this.links.forEach(l=>{
        const s=nodeMap[l.source],t=nodeMap[l.target];
        const x0=s.x+nodeW,y0=l._sy,x1=t.x,y1=l._ty,h0=l._sh,h1=l._th;
        const cpx=(x0+x1)/2;
        ctx.beginPath();ctx.moveTo(x0,y0);ctx.bezierCurveTo(cpx,y0,cpx,y1,x1,y1);ctx.lineTo(x1,y1+h1);ctx.bezierCurveTo(cpx,y1+h1,cpx,y0+h0,x0,y0+h0);ctx.closePath();
        const grad=ctx.createLinearGradient(x0,0,x1,0);grad.addColorStop(0,s.color+'88');grad.addColorStop(1,t.color+'88');ctx.fillStyle=grad;ctx.fill();
      });
      this.nodes.forEach(n=>{
        ctx.fillStyle=n.color;ctx.fillRect(n.x,n.y,nodeW,n.h);
        ctx.fillStyle='#fff';ctx.font='12px sans-serif';ctx.textAlign='left';
        ctx.fillText(n.label,n.x+nodeW+4,n.y+n.h/2+4);
      });
    }
  }
  return{Sankey};
});
