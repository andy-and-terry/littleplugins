/*!
 * ProceduralFX - Synthesises game sound effects from parameters
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ProceduralFX=factory();})(typeof self!=='undefined'?self:this,function(){
  let _ctx=null;
  function getCtx(){if(!_ctx)_ctx=new(window.AudioContext||window.webkitAudioContext)();_ctx.resume();return _ctx;}
  function play(config){
    const ctx=getCtx(),now=ctx.currentTime;
    const osc=ctx.createOscillator(),g=ctx.createGain(),dist=ctx.createWaveShaper();
    const curve=new Float32Array(256);for(let i=0;i<256;i++)curve[i]=Math.tanh((i/128-1)*config.distortion||0);
    dist.curve=curve;
    osc.type=config.wave||'square';
    osc.frequency.setValueAtTime(config.startFreq||440,now);
    if(config.endFreq!==undefined)osc.frequency.exponentialRampToValueAtTime(Math.max(1,config.endFreq),now+config.duration);
    g.gain.setValueAtTime(config.volume||0.5,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+config.duration);
    osc.connect(dist);dist.connect(g);g.connect(ctx.destination);
    osc.start(now);osc.stop(now+config.duration+0.05);
  }
  const presets={
    shoot:()=>play({wave:'square',startFreq:880,endFreq:220,duration:0.15,volume:0.4,distortion:2}),
    jump:()=>play({wave:'sine',startFreq:300,endFreq:600,duration:0.2,volume:0.4}),
    land:()=>play({wave:'square',startFreq:150,endFreq:80,duration:0.12,volume:0.5,distortion:3}),
    explosion:()=>{for(let i=0;i<3;i++)setTimeout(()=>play({wave:'sawtooth',startFreq:200-i*30,endFreq:30,duration:0.4+i*0.1,volume:0.6,distortion:8}),i*50);},
    collect:()=>play({wave:'sine',startFreq:440,endFreq:880,duration:0.12,volume:0.3}),
    error:()=>play({wave:'square',startFreq:200,endFreq:150,duration:0.3,volume:0.4,distortion:4}),
    powerup:()=>{[440,550,660,880].forEach((f,i)=>setTimeout(()=>play({wave:'sine',startFreq:f,endFreq:f*1.05,duration:0.1,volume:0.35}),i*80));},
    hit:()=>play({wave:'sawtooth',startFreq:300,endFreq:100,duration:0.1,volume:0.5,distortion:5}),
    click:()=>play({wave:'sine',startFreq:600,endFreq:400,duration:0.05,volume:0.2}),
  };
  function custom(config){play(config);}
  return{...presets,custom};
});
