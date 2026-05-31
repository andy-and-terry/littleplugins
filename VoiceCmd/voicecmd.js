/*!
 * VoiceCmd - Web Speech API command binder with fuzzy matching
 * MIT License
 */
(function(r,f){if(typeof module==='object'&&module.exports)module.exports=f();else r.VoiceCmd=f();})(typeof self!=='undefined'?self:this,function(){
  function similarity(a,b){a=a.toLowerCase();b=b.toLowerCase();if(a===b)return 1;let matches=0;const shorter=a.length<b.length?a:b;for(let i=0;i<shorter.length;i++)if(a[i]===b[i])matches++;return matches/Math.max(a.length,b.length);}
  class VoiceCmd{
    constructor(options={}){
      this.threshold=options.threshold||0.7;this.lang=options.lang||'en-US';this.continuous=options.continuous!==false;
      this._cmds=[];this._running=false;this._recognition=null;
      this.onResult=options.onResult||null;this.onError=options.onError||null;
    }
    add(phrase,handler,options={}){this._cmds.push({phrase,handler,description:options.description||phrase});return this;}
    remove(phrase){this._cmds=this._cmds.filter(c=>c.phrase!==phrase);return this;}
    start(){
      const SR=window.SpeechRecognition||window.webkitSpeechRecognition;
      if(!SR){if(this.onError)this.onError('SpeechRecognition not supported');return this;}
      const r=this._recognition=new SR();r.lang=this.lang;r.continuous=this.continuous;r.interimResults=false;
      r.onresult=e=>{
        const transcript=e.results[e.results.length-1][0].transcript.trim();
        if(this.onResult)this.onResult(transcript);
        let best=null,bestScore=0;
        for(const cmd of this._cmds){const score=similarity(transcript,cmd.phrase);if(score>bestScore&&score>=this.threshold){bestScore=score;best=cmd;}}
        if(best)best.handler({transcript,score:bestScore,command:best.phrase});
      };
      r.onerror=e=>{if(this.onError)this.onError(e.error);};
      r.onend=()=>{if(this._running)r.start();};
      this._running=true;r.start();return this;
    }
    stop(){this._running=false;if(this._recognition)this._recognition.stop();}
    get commands(){return this._cmds.map(c=>c.description);}
  }
  return{VoiceCmd};
});
