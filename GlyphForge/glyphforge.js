/*!
 * GlyphForge - Procedural glyph and symbol renderer on canvas
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.GlyphForge=f();})(typeof self!=='undefined'?self:this,function(){
  const GLYPHS={
    rune_A:[[0.5,0,0.1,1],[0.5,0,0.9,1],[0.25,0.5,0.75,0.5]],
    rune_E:[[0.1,0,0.1,1],[0.1,0,0.9,0],[0.1,0.5,0.7,0.5],[0.1,1,0.9,1]],
    rune_star:[[0.5,0,0.5,1],[0,0.5,1,0.5],[0.15,0.15,0.85,0.85],[0.85,0.15,0.15,0.85]],
    rune_cross:[[0.5,0.1,0.5,0.9],[0.1,0.5,0.9,0.5]],
    rune_arrow:[[0,0.5,1,0.5],[0.6,0.1,1,0.5],[0.6,0.9,1,0.5]],
    sigil_eye:null,sigil_spiral:null,
  };
  function drawGlyph(ctx,name,x,y,size,options={}){
    const segs=GLYPHS[name];const color=options.color||'#4af';const lw=options.lineWidth||2;
    ctx.save();ctx.translate(x,y);ctx.strokeStyle=color;ctx.lineWidth=lw;ctx.lineCap='round';ctx.lineJoin='round';
    if(options.glow){ctx.shadowColor=color;ctx.shadowBlur=options.glow;}
    if(segs){for(let i=0;i<segs.length;i+=1){const[x1,y1,x2,y2]=segs[i];ctx.beginPath();ctx.moveTo((x1-0.5)*size,(y1-0.5)*size);ctx.lineTo((x2-0.5)*size,(y2-0.5)*size);ctx.stroke();}}
    else if(name==='sigil_eye'){ctx.beginPath();ctx.ellipse(0,0,size*0.5,size*0.2,0,0,Math.PI*2);ctx.stroke();ctx.beginPath();ctx.arc(0,0,size*0.1,0,Math.PI*2);ctx.fillStyle=color;ctx.fill();}
    else if(name==='sigil_spiral'){ctx.beginPath();for(let t=0;t<Math.PI*4;t+=0.1){const r=t/(Math.PI*4)*size*0.45;if(t===0)ctx.moveTo(r,0);else ctx.lineTo(Math.cos(t)*r,Math.sin(t)*r);}ctx.stroke();}
    if(options.circle){ctx.beginPath();ctx.arc(0,0,size*0.55,0,Math.PI*2);ctx.stroke();}
    ctx.restore();
  }
  function register(name,segments){GLYPHS[name]=segments;}
  function compose(ctx,glyphNames,x,y,size,options={}){
    glyphNames.forEach((name,i)=>{const angle=i/glyphNames.length*Math.PI*2;const r=options.radius||size*0.6;drawGlyph(ctx,name,x+Math.cos(angle)*r,y+Math.sin(angle)*r,size*0.3,options);});
    if(options.outerCircle){ctx.beginPath();ctx.arc(x,y,options.radius||size*0.6,0,Math.PI*2);ctx.strokeStyle=options.color||'#4af';ctx.lineWidth=options.lineWidth||1;ctx.stroke();}
  }
  return{drawGlyph,register,compose,GLYPHS};
});
