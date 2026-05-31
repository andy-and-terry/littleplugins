/*!
 * ColorDrift - Procedural colour palette animation engine
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ColorDrift=factory();})(typeof self!=='undefined'?self:this,function(){
  function hslToRgb(h,s,l){s/=100;l/=100;const k=n=>(n+h/30)%12;const a=s*Math.min(l,1-l);const f=n=>l-a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));return[Math.round(f(0)*255),Math.round(f(8)*255),Math.round(f(4)*255)];}
  class Palette {
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      this.ctx=this.canvas.getContext('2d');
      this.swatches=options.swatches||5;
      this.speed=options.speed||0.3;
      this.saturation=options.saturation||70;
      this.lightness=options.lightness||55;
      this.baseHue=options.baseHue||0;
      this.spread=options.spread||60;
      this.time=0; this._running=false;
      this.onUpdate=options.onUpdate||null;
    }
    getColors(){
      const colors=[];
      for(let i=0;i<this.swatches;i++){
        const hue=(this.baseHue+this.time*this.speed+i*(this.spread)+Math.sin(this.time*0.5+i)*15)%360;
        const s=this.saturation+Math.sin(this.time*0.3+i)*10;
        const l=this.lightness+Math.sin(this.time*0.4+i*0.7)*8;
        const rgb=hslToRgb(hue,s,l);
        colors.push({hue,s,l,rgb,hex:'#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('')});
      }
      return colors;
    }
    render(){
      const{ctx,canvas}=this;const W=canvas.width,H=canvas.height;
      const colors=this.getColors();const sw=W/colors.length;
      for(let i=0;i<colors.length;i++){ctx.fillStyle=colors[i].hex;ctx.fillRect(i*sw,0,sw,H);}
      if(this.onUpdate)this.onUpdate(colors);
    }
    start(){this._running=true;const loop=()=>{this.time+=0.016;this.render();if(this._running)requestAnimationFrame(loop);};requestAnimationFrame(loop);}
    stop(){this._running=false;}
  }
  return{Palette};
});
