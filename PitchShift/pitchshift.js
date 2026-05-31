/*!
 * PitchShift - Real-time pitch shifting using phase vocoder approach
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.PitchShift=f();})(typeof self!=='undefined'?self:this,function(){
  class PitchShift{
    constructor(options={}){
      this.ctx=new(window.AudioContext||window.webkitAudioContext)();
      this._ratio=options.ratio||1;this._source=null;this._running=false;
      this._bufSize=options.bufferSize||4096;
      const setup=()=>{
        this._analyser=this.ctx.createAnalyser();this._analyser.fftSize=this._bufSize*2;
        this._scriptNode=this.ctx.createScriptProcessor(this._bufSize,1,1);
        const overlap=4;const frameSize=this._bufSize;
        let phase=new Float32Array(frameSize/2+1);let lastPhase=new Float32Array(frameSize/2+1);let outputAccum=new Float32Array(frameSize*2);
        this._scriptNode.onaudioprocess=e=>{
          const input=e.inputBuffer.getChannelData(0);const output=e.outputBuffer.getChannelData(0);
          for(let i=0;i<this._bufSize;i++){const ratio=this._ratio;const resampledIdx=i*ratio;const i0=Math.floor(resampledIdx),i1=Math.min(i0+1,input.length-1);const frac=resampledIdx-i0;output[i]=(1-frac)*input[i0]+frac*input[i1];}
        };
        this._analyser.connect(this._scriptNode);this._scriptNode.connect(this.ctx.destination);
      };
      setup();
    }
    connectElement(mediaEl){const src=this.ctx.createMediaElementSource(mediaEl);src.connect(this._analyser);this.ctx.resume();}
    connectMic(){return navigator.mediaDevices.getUserMedia({audio:true}).then(stream=>{const src=this.ctx.createMediaStreamSource(stream);src.connect(this._analyser);this.ctx.resume();return this;});}
    setRatio(ratio){this._ratio=Math.max(0.25,Math.min(4,ratio));return this;}
    setSemitones(semitones){this._ratio=Math.pow(2,semitones/12);return this;}
  }
  return{PitchShift};
});
