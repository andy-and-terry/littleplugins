/*!
 * KeyCombo - Keyboard shortcut manager
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.KeyCombo=factory();})(typeof self!=='undefined'?self:this,function(){
  class Manager {
    constructor(){this._bindings={};this._sequence=[];this._sequenceTimer=null;this._seqTimeout=800;this._enabled=true;this._bind();}
    _normalise(combo){return combo.toLowerCase().split('+').map(k=>k.trim()).sort((a,b)=>['ctrl','alt','shift','meta'].includes(a)?-1:1).join('+');}
    register(combo,handler,options={}){const key=this._normalise(combo);if(!this._bindings[key])this._bindings[key]=[];if(this._bindings[key].some(b=>b.handler===handler))return this;this._bindings[key].push({handler,description:options.description||'',group:options.group||'General'});return this;}
    unregister(combo,handler){const key=this._normalise(combo);if(!this._bindings[key])return;this._bindings[key]=this._bindings[key].filter(b=>b.handler!==handler);return this;}
    enable(){this._enabled=true;return this;}
    disable(){this._enabled=false;return this;}
    _getKey(e){const parts=[];if(e.ctrlKey)parts.push('ctrl');if(e.altKey)parts.push('alt');if(e.shiftKey)parts.push('shift');if(e.metaKey)parts.push('meta');const k=e.key.toLowerCase();if(!['control','alt','shift','meta'].includes(k))parts.push(k);return parts.join('+');}
    _bind(){document.addEventListener('keydown',e=>{if(!this._enabled)return;const key=this._getKey(e);const bindings=this._bindings[key];if(bindings&&bindings.length){bindings.forEach(b=>{const res=b.handler(e);if(res!==false)e.preventDefault();});}});}
    getCheatSheet(){const groups={};for(const[combo,bindings]of Object.entries(this._bindings)){for(const b of bindings){if(!groups[b.group])groups[b.group]=[];if(b.description)groups[b.group].push({combo,description:b.description});}}return groups;}
    showCheatSheet(){const sheet=this.getCheatSheet();const el=document.createElement('div');el.style.cssText='position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);background:#1a1a2e;color:#eee;padding:2rem;border-radius:12px;z-index:9999;min-width:300px;font-family:monospace;box-shadow:0 20px 60px rgba(0,0,0,0.5)';let html='<h3 style="margin:0 0 1rem;color:#4af">Keyboard Shortcuts</h3>';for(const[group,items]of Object.entries(sheet)){html+=`<div style="margin-bottom:1rem"><strong style="color:#aaa">${group}</strong>`;for(const{combo,description}of items)html+=`<div style="display:flex;justify-content:space-between;gap:2rem;padding:3px 0"><span>${description}</span><kbd style="background:#333;padding:2px 6px;border-radius:4px">${combo}</kbd></div>`;html+='</div>';}html+='<button onclick="this.parentNode.remove()" style="margin-top:1rem;background:#4af;border:none;padding:6px 16px;border-radius:6px;cursor:pointer">Close</button>';el.innerHTML=html;document.body.appendChild(el);}
  }
  return{Manager};
});
