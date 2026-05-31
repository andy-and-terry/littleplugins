/*!
 * SelectionBox - Rubber-band multi-select for canvas or DOM elements
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.SelectionBox=f();})(typeof self!=='undefined'?self:this,function(){
  class SelectionBox{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.items=[];this.selected=new Set();
      this.color=options.color||'rgba(74,170,255,0.3)';this.borderColor=options.borderColor||'#4af';
      this.multiKey=options.multiKey||'shift';this.onSelect=options.onSelect||null;
      this._active=false;this._sx=0;this._sy=0;this._ex=0;this._ey=0;this._bind();
    }
    setItems(items){this.items=items;return this;}
    addItem(item){this.items.push(item);return this;}
    _inRect(item,x1,y1,x2,y2){const rx=Math.min(x1,x2),ry=Math.min(y1,y2),rw=Math.abs(x2-x1),rh=Math.abs(y2-y1);return item.x>=rx&&item.x+item.w<=rx+rw&&item.y>=ry&&item.y+item.h<=ry+rh;}
    _bind(){
      const c=this.canvas;
      c.addEventListener('mousedown',e=>{
        if(!e.shiftKey)this.selected.clear();
        const r=c.getBoundingClientRect();this._sx=e.clientX-r.left;this._sy=e.clientY-r.top;this._ex=this._sx;this._ey=this._sy;this._active=true;
      });
      document.addEventListener('mousemove',e=>{
        if(!this._active)return;const r=c.getBoundingClientRect();this._ex=e.clientX-r.left;this._ey=e.clientY-r.top;this.render();
      });
      document.addEventListener('mouseup',e=>{
        if(!this._active)return;this._active=false;
        for(const item of this.items){if(this._inRect(item,this._sx,this._sy,this._ex,this._ey))this.selected.add(item);}
        if(this.onSelect)this.onSelect(Array.from(this.selected));this.render();
      });
    }
    render(){
      const{ctx,canvas}=this;ctx.clearRect(0,0,canvas.width,canvas.height);
      for(const item of this.items){
        const isSel=this.selected.has(item);ctx.fillStyle=isSel?'rgba(74,170,255,0.2)':item.color||'#333';ctx.fillRect(item.x,item.y,item.w,item.h);ctx.strokeStyle=isSel?this.borderColor:'#555';ctx.lineWidth=isSel?2:1;ctx.strokeRect(item.x,item.y,item.w,item.h);if(item.label){ctx.fillStyle='#fff';ctx.font='12px sans-serif';ctx.textAlign='center';ctx.fillText(item.label,item.x+item.w/2,item.y+item.h/2+4);}
      }
      if(this._active){const x=Math.min(this._sx,this._ex),y=Math.min(this._sy,this._ey),w=Math.abs(this._ex-this._sx),h=Math.abs(this._ey-this._sy);ctx.fillStyle=this.color;ctx.fillRect(x,y,w,h);ctx.strokeStyle=this.borderColor;ctx.lineWidth=1;ctx.strokeRect(x,y,w,h);}
    }
    clearSelection(){this.selected.clear();if(this.onSelect)this.onSelect([]);this.render();}
    getSelected(){return Array.from(this.selected);}
  }
  return{SelectionBox};
});
