/*!
 * TimelineViz - Zoomable pannable timeline renderer
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.TimelineViz=factory();})(typeof self!=='undefined'?self:this,function(){
  class Timeline {
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.events=[]; this.groups=[];
      this.zoom=options.zoom||1; this.pan=options.pan||0;
      this.rowH=options.rowH||36; this.headerH=options.headerH||40;
      this.minZoom=0.1; this.maxZoom=20;
      this._dragging=false; this._lastX=0;
      this._bind();
    }
    addEvent(e){this.events.push({...e,row:e.row||0});return this;}
    addGroup(name,row){this.groups[row]=name;return this;}
    _timeToX(t){return(t-this.pan)*this.zoom*100;}
    _xToTime(x){return x/(this.zoom*100)+this.pan;}
    _bind(){
      const c=this.canvas;
      c.addEventListener('wheel',e=>{
        const rect=c.getBoundingClientRect();
        const mx=e.clientX-rect.left;
        const tAtMouse=this._xToTime(mx);
        this.zoom*=e.deltaY<0?1.15:1/1.15;
        this.zoom=Math.max(this.minZoom,Math.min(this.maxZoom,this.zoom));
        this.pan=tAtMouse-mx/(this.zoom*100);
        this.render(); e.preventDefault();
      },{passive:false});
      c.addEventListener('mousedown',e=>{this._dragging=true;this._lastX=e.clientX;});
      document.addEventListener('mousemove',e=>{if(!this._dragging)return;const dx=e.clientX-this._lastX;this.pan-=dx/(this.zoom*100);this._lastX=e.clientX;this.render();});
      document.addEventListener('mouseup',()=>this._dragging=false);
    }
    render(){
      const{ctx,canvas,headerH,rowH,events,groups}=this;
      const W=canvas.width,H=canvas.height;
      ctx.clearRect(0,0,W,H);
      ctx.fillStyle='#1a1a2e'; ctx.fillRect(0,0,W,H);
      // header
      ctx.fillStyle='#111'; ctx.fillRect(0,0,W,headerH);
      ctx.strokeStyle='#333'; ctx.beginPath(); ctx.moveTo(0,headerH); ctx.lineTo(W,headerH); ctx.stroke();
      // grid lines & labels
      const step=this._niceStep();
      const start=Math.floor(this.pan/step)*step;
      ctx.strokeStyle='#2a2a4a'; ctx.fillStyle='#666'; ctx.font='11px monospace'; ctx.textAlign='center';
      for(let t=start;this._timeToX(t)<W;t+=step){
        const x=this._timeToX(t);
        if(x<0)continue;
        ctx.beginPath(); ctx.moveTo(x,headerH); ctx.lineTo(x,H); ctx.stroke();
        ctx.fillText(this._formatTime(t),x,headerH-6);
      }
      // row labels
      const rows=Math.max(...events.map(e=>e.row||0))+1;
      ctx.textAlign='left';
      for(let r=0;r<rows;r++){
        const y=headerH+r*rowH;
        ctx.fillStyle='#222'; ctx.fillRect(0,y,100,rowH);
        ctx.fillStyle='#888'; ctx.font='12px sans-serif';
        ctx.fillText(groups[r]||`Row ${r}`,4,y+rowH/2+4);
      }
      // events
      for(const e of events){
        const x=this._timeToX(e.start);
        const w=(e.end-e.start)*this.zoom*100;
        const y=headerH+(e.row||0)*rowH+4;
        if(x+w<0||x>W)continue;
        ctx.fillStyle=e.color||'#4af';
        ctx.beginPath();
        const rx=Math.max(x,0),rw=Math.min(w,W-rx);
        ctx.roundRect?ctx.roundRect(rx,y,rw,rowH-8,4):ctx.rect(rx,y,rw,rowH-8);
        ctx.fill();
        ctx.fillStyle='#fff'; ctx.font='12px sans-serif'; ctx.textAlign='left';
        ctx.fillText(e.label||'',Math.max(x,0)+6,y+rowH-14);
      }
      ctx.textAlign='left';
    }
    _niceStep(){const v=1/this.zoom;const mag=Math.pow(10,Math.floor(Math.log10(v)));const n=v/mag;return n<2?mag:n<5?2*mag:5*mag;}
    _formatTime(t){if(Math.abs(t)>=3600)return Math.floor(t/3600)+'h'+String(Math.floor((t%3600)/60)).padStart(2,'0')+'m';if(Math.abs(t)>=60)return Math.floor(t/60)+'m'+String(Math.floor(t%60)).padStart(2,'0')+'s';return t.toFixed(1)+'s';}
  }
  return{Timeline};
});
