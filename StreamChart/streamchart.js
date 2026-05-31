/*!
 * StreamChart - Real-time streaming data chart
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StreamChart=factory();})(typeof self!=='undefined'?self:this,function(){
  class Chart {
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.series={};this.window=options.window||100;
      this.padding=options.padding||{top:20,right:10,bottom:30,left:50};
      this.gridColor=options.gridColor||'#2a2a4a';
      this.bgColor=options.bgColor||'#0d0d1a';
      this.labelColor=options.labelColor||'#666';
      this.colors=options.colors||['#4af','#f84','#4f8','#f4a'];
      this._autoScale=options.autoScale!==false;
      this._minY=options.minY||0;this._maxY=options.maxY||100;
      this._colorIdx=0;
    }
    addSeries(name,options={}){
      this.series[name]={data:[],color:options.color||this.colors[this._colorIdx++%this.colors.length],lineWidth:options.lineWidth||2,fill:options.fill||false};
      return this;
    }
    push(name,value){
      if(!this.series[name])this.addSeries(name);
      const s=this.series[name];s.data.push(value);
      if(s.data.length>this.window)s.data.shift();
      return this;
    }
    render(){
      const{ctx,canvas,padding:p}=this;
      const W=canvas.width,H=canvas.height;
      const cW=W-p.left-p.right,cH=H-p.top-p.bottom;
      ctx.fillStyle=this.bgColor;ctx.fillRect(0,0,W,H);
      let minY=this._minY,maxY=this._maxY;
      if(this._autoScale){const allVals=Object.values(this.series).flatMap(s=>s.data);if(allVals.length){minY=Math.min(...allVals)*0.9;maxY=Math.max(...allVals)*1.1;}}
      const yRange=maxY-minY||1;
      const toX=i=>p.left+i/(this.window-1)*cW;
      const toY=v=>p.top+cH-(v-minY)/yRange*cH;
      // grid
      ctx.strokeStyle=this.gridColor;ctx.lineWidth=1;
      for(let i=0;i<=4;i++){const y=p.top+i*cH/4;ctx.beginPath();ctx.moveTo(p.left,y);ctx.lineTo(p.left+cW,y);ctx.stroke();ctx.fillStyle=this.labelColor;ctx.font='10px monospace';ctx.textAlign='right';ctx.fillText((maxY-i*(yRange/4)).toFixed(1),p.left-4,y+4);}
      ctx.strokeStyle=this.gridColor;for(let i=0;i<=5;i++){const x=p.left+i*cW/5;ctx.beginPath();ctx.moveTo(x,p.top);ctx.lineTo(x,p.top+cH);ctx.stroke();}
      // series
      for(const[,s]of Object.entries(this.series)){
        if(!s.data.length)continue;
        ctx.beginPath();
        const offset=Math.max(0,this.window-s.data.length);
        s.data.forEach((v,i)=>{const x=toX(i+offset),y=toY(v);i===0?ctx.moveTo(x,y):ctx.lineTo(x,y);});
        if(s.fill){ctx.lineTo(toX(s.data.length-1+offset),p.top+cH);ctx.lineTo(toX(offset),p.top+cH);ctx.closePath();ctx.fillStyle=s.color+'33';ctx.fill();}
        ctx.strokeStyle=s.color;ctx.lineWidth=s.lineWidth;ctx.stroke();
      }
      // axes
      ctx.strokeStyle='#444';ctx.lineWidth=1;
      ctx.beginPath();ctx.moveTo(p.left,p.top);ctx.lineTo(p.left,p.top+cH);ctx.lineTo(p.left+cW,p.top+cH);ctx.stroke();
    }
    start(interval=100){this._interval=setInterval(()=>this.render(),interval);return this;}
    stop(){clearInterval(this._interval);}
  }
  return{Chart};
});
