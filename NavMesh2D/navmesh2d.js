/*!
 * NavMesh2D - Polygon navmesh pathfinding
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.NavMesh2D=factory();})(typeof self!=='undefined'?self:this,function(){
  function heuristic(a,b){return Math.hypot(a.x-b.x,a.y-b.y);}
  function pointInPoly(px,py,poly){let inside=false;for(let i=0,j=poly.length-1;i<poly.length;j=i++){const xi=poly[i][0],yi=poly[i][1],xj=poly[j][0],yj=poly[j][1];if(((yi>py)!==(yj>py))&&(px<(xj-xi)*(py-yi)/(yj-yi)+xi))inside=!inside;}return inside;}
  function segIntersects(ax,ay,bx,by,cx,cy,dx,dy){const d1x=bx-ax,d1y=by-ay,d2x=dx-cx,d2y=dy-cy;const denom=d1x*d2y-d1y*d2x;if(!denom)return false;const t=((cx-ax)*d2y-(cy-ay)*d2x)/denom;const u=((cx-ax)*d1y-(cy-ay)*d1x)/denom;return t>0.001&&t<0.999&&u>0.001&&u<0.999;}
  class NavMesh {
    constructor(){this.walkable=[];this.obstacles=[];this.nodes=[];}
    setWalkable(polygon){this.walkable=polygon;return this;}
    addObstacle(polygon){this.obstacles.push(polygon);return this;}
    _isWalkable(x,y){if(!pointInPoly(x,y,this.walkable))return false;for(const o of this.obstacles)if(pointInPoly(x,y,o))return false;return true;}
    _lineOfSight(ax,ay,bx,by){
      const segs=[];
      const addPoly=p=>{for(let i=0;i<p.length;i++)segs.push([p[i][0],p[i][1],p[(i+1)%p.length][0],p[(i+1)%p.length][1]]);};
      this.obstacles.forEach(addPoly);
      for(const[cx,cy,dx,dy]of segs)if(segIntersects(ax,ay,bx,by,cx,cy,dx,dy))return false;
      return true;
    }
    build(gridSize=40){
      this.nodes=[];const bbox=this.walkable;
      const xs=bbox.map(p=>p[0]),ys=bbox.map(p=>p[1]);
      const minX=Math.min(...xs),maxX=Math.max(...xs),minY=Math.min(...ys),maxY=Math.max(...ys);
      for(let y=minY;y<=maxY;y+=gridSize)for(let x=minX;x<=maxX;x+=gridSize)if(this._isWalkable(x,y))this.nodes.push({x,y,id:`${x},${y}`});
      return this;
    }
    findPath(sx,sy,ex,ey){
      const start={x:sx,y:sy,id:'start'},end={x:ex,y:ey,id:'end'};
      const nodes=[start,...this.nodes,end];
      const open=[start],closed=new Set();
      const g={[start.id]:0},f={[start.id]:heuristic(start,end)},prev={};
      while(open.length){
        open.sort((a,b)=>f[a.id]-f[b.id]);
        const curr=open.shift();
        if(heuristic(curr,end)<30){let path=[],c=curr;while(prev[c.id]){path.unshift(c);c=prev[c.id];}path.unshift(start);path.push(end);return path;}
        closed.add(curr.id);
        for(const nb of nodes){
          if(closed.has(nb.id)||nb===curr)continue;
          const dist=heuristic(curr,nb);if(dist>150)continue;
          if(!this._lineOfSight(curr.x,curr.y,nb.x,nb.y))continue;
          const ng=g[curr.id]+dist;
          if(ng<(g[nb.id]||Infinity)){g[nb.id]=ng;f[nb.id]=ng+heuristic(nb,end);prev[nb.id]=curr;if(!open.includes(nb))open.push(nb);}
        }
      }
      return null;
    }
    renderDebug(ctx){
      ctx.strokeStyle='rgba(0,200,100,0.15)';ctx.lineWidth=1;
      ctx.beginPath();const p=this.walkable;ctx.moveTo(p[0][0],p[0][1]);p.forEach(v=>ctx.lineTo(v[0],v[1]));ctx.closePath();ctx.stroke();
      ctx.fillStyle='rgba(0,200,100,0.1)';ctx.fill();
      for(const o of this.obstacles){ctx.strokeStyle='rgba(255,80,80,0.4)';ctx.beginPath();ctx.moveTo(o[0][0],o[0][1]);o.forEach(v=>ctx.lineTo(v[0],v[1]));ctx.closePath();ctx.stroke();}
      ctx.fillStyle='rgba(255,255,100,0.3)';for(const n of this.nodes){ctx.beginPath();ctx.arc(n.x,n.y,2,0,Math.PI*2);ctx.fill();}
    }
  }
  return{NavMesh};
});
