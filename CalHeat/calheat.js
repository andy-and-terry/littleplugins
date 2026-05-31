/*!
 * CalHeat - GitHub-style contribution calendar heatmap
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CalHeat=factory();})(typeof self!=='undefined'?self:this,function(){
  class CalHeat{
    constructor(container,options={}){
      this.el=typeof container==='string'?document.querySelector(container):container;
      this.data={};this.colors=options.colors||['#1a1a2e','#1f4068','#1b6ca8','#1e90ff','#4fc3f7'];
      this.cellSize=options.cellSize||13;this.gap=options.gap||2;this.weeks=options.weeks||52;
      this.tooltips=options.tooltips!==false;this.onDayClick=options.onDayClick||null;
    }
    setData(data){this.data=data;return this;}
    setDay(date,value){this.data[date]=value;return this;}
    _dateStr(d){return d.toISOString().split('T')[0];}
    _getColor(val,max){if(!val)return this.colors[0];const idx=Math.ceil(val/max*(this.colors.length-1));return this.colors[Math.min(idx,this.colors.length-1)];}
    render(){
      const{cellSize:cs,gap,weeks}=this;
      const max=Math.max(1,...Object.values(this.data));
      const today=new Date();const startDate=new Date(today);startDate.setDate(startDate.getDate()-weeks*7);
      const w=weeks*(cs+gap),h=7*(cs+gap)+20;
      this.el.innerHTML='';const svg=document.createElementNS('http://www.w3.org/2000/svg','svg');svg.setAttribute('width',w);svg.setAttribute('height',h);svg.style.fontFamily='monospace';
      const days=['S','M','T','W','T','F','S'];days.forEach((d,i)=>{if(i%2===1){const t=document.createElementNS('http://www.w3.org/2000/svg','text');t.setAttribute('x',-2);t.setAttribute('y',i*(cs+gap)+cs);t.setAttribute('font-size','9');t.setAttribute('fill','#666');t.textContent=d;svg.appendChild(t);}});
      let d=new Date(startDate);let col=0;
      while(d<=today){const dow=d.getDay();const dateStr=this._dateStr(d);const val=this.data[dateStr]||0;const rect=document.createElementNS('http://www.w3.org/2000/svg','rect');rect.setAttribute('x',col*(cs+gap)+20);rect.setAttribute('y',dow*(cs+gap));rect.setAttribute('width',cs);rect.setAttribute('height',cs);rect.setAttribute('rx','2');rect.setAttribute('fill',this._getColor(val,max));rect.style.cursor='pointer';if(this.tooltips){rect.setAttribute('title',`${dateStr}: ${val}`);}if(this.onDayClick)rect.addEventListener('click',()=>this.onDayClick(dateStr,val));svg.appendChild(rect);d.setDate(d.getDate()+1);if(dow===6)col++;}
      this.el.appendChild(svg);
    }
  }
  return{CalHeat};
});
