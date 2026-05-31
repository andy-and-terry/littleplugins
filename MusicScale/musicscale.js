/*!
 * MusicScale - Music theory engine - scales chords progressions
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.MusicScale=factory();})(typeof self!=='undefined'?self:this,function(){
  const NOTES=['C','C#','D','D#','E','F','F#','G','G#','A','A#','B'];
  const SCALES={major:[0,2,4,5,7,9,11],minor:[0,2,3,5,7,8,10],dorian:[0,2,3,5,7,9,10],mixolydian:[0,2,4,5,7,9,10],pentatonic:[0,2,4,7,9],blues:[0,3,5,6,7,10],chromatic:[0,1,2,3,4,5,6,7,8,9,10,11]};
  const CHORDS={major:[0,4,7],minor:[0,3,7],dim:[0,3,6],aug:[0,4,8],maj7:[0,4,7,11],min7:[0,3,7,10],dom7:[0,4,7,10],sus4:[0,5,7],sus2:[0,2,7]};
  const PROGRESSIONS={I_IV_V:[0,3,4],I_V_vi_IV:[0,4,5,3],ii_V_I:[1,4,0],I_vi_IV_V:[0,5,3,4],vi_IV_I_V:[5,3,0,4]};
  function noteIndex(note){return NOTES.indexOf(note);}
  function noteFreq(midi){return 440*Math.pow(2,(midi-69)/12);}
  function scale(root,type='major'){const idx=noteIndex(root);if(idx<0)return[];return(SCALES[type]||[]).map(i=>NOTES[(idx+i)%12]);}
  function chord(root,type='major'){const idx=noteIndex(root);if(idx<0)return[];return(CHORDS[type]||[]).map(i=>NOTES[(idx+i)%12]);}
  function progression(root,prog='I_IV_V',chordType='major'){const s=scale(root,'major');const patt=PROGRESSIONS[prog]||[0,3,4];return patt.map(i=>chord(s[i],chordType));}
  function playNote(ctx,midi,time,dur,vol=0.5){const osc=ctx.createOscillator();const g=ctx.createGain();osc.frequency.value=noteFreq(midi);g.gain.setValueAtTime(vol,time);g.gain.exponentialRampToValueAtTime(0.001,time+dur);osc.connect(g);g.connect(ctx.destination);osc.start(time);osc.stop(time+dur+0.05);}
  function playChord(ctx,notes,octave=4,time=0,dur=1){const _ctx=ctx||new(window.AudioContext||window.webkitAudioContext)();notes.forEach(n=>{const midi=NOTES.indexOf(n)+12*(octave+1);playNote(_ctx,midi,_ctx.currentTime+time,dur);});}
  return{scale,chord,progression,playChord,noteFreq,NOTES,SCALES,CHORDS,PROGRESSIONS};
});
