/*!
 * WordCloud2 - Canvas word cloud with spiral placement and collision detection
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.WordCloud2=f();})(typeof self!=='undefined'?self:this,function(){
  class WordCloud{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.minSize=options.minSize||12;this.maxSize=options.maxSize||60;
      this.colors=options.colors||['#4af','#f84','#4f8','#f4a','#af4','#a4f'];
      this.fontFamily=options.fontFamily||'sans-serif';this.bgColor=options.bgColor||'#0d0d1a';
      this.spiralStep=options.spiralStep||2;
    }
    setData(words){this.words=words.slice().sort((a,b)=>b.weight-a.weight);return this;}
    _fits(x,y,w,h,placed){for(const p of placed)if(!(x+w<p.x||x>p.x+p.w||y+h<p.y||y>p.y+p.h))return false;return x>=0&&y>=0&&x+w<=this.canvas.width&&y+h<=this.canvas.height;}
    render(){
      const{ctx,canvas,words}=this;if(!words)return;
      const W=canvas.width,H=canvas.height;
      ctx.fillStyle=this.bgColor;ctx.fillRect(0,0,W,H);
      const maxW=Math.max(...words.map(w=>w.weight));const minW=Math.min(...words.map(w=>w.weight));
      const placed=[];
      words.forEach((word,wi)=>{
        const size=this.minSize+(word.weight-minW)/(maxW-minW||1)*(this.maxSize-this.minSize);
        ctx.font=`bold ${size}px ${this.fontFamily}`;const tw=ctx.measureText(word.text).width,th=size;
        let placed_=false;let a=0,r=0;
        for(let step=0;step<500;step++){
          r=this.spiralStep*step*0.1;a=step*0.5;
          const x=W/2-tw/2+Math.cos(a)*r,y=H/2-th/2+Math.sin(a)*r;
          if(this._fits(x,y,tw,th,placed)){ctx.fillStyle=word.color||this.colors[wi%this.colors.length];ctx.fillText(word.text,x,y+size);placed.push({x,y,w:tw,h:th});placed_=true;break;}
        }
      });
    }
  }
  return{WordCloud};
});
