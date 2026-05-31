/*!
 * WheelDrive - Arcade vehicle physics
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.WheelDrive=factory();})(typeof self!=='undefined'?self:this,function(){
  class Vehicle {
    constructor(options={}){
      this.x=options.x||200;this.y=options.y||200;
      this.angle=options.angle||0;this.speed=0;
      this.steer=0;this.width=options.width||30;this.height=options.height||50;
      this.maxSpeed=options.maxSpeed||5;this.acceleration=options.acceleration||0.15;
      this.braking=options.braking||0.3;this.friction=options.friction||0.96;
      this.maxSteer=options.maxSteer||0.05;this.grip=options.grip||0.85;
      this.vx=0;this.vy=0;this.color=options.color||'#f84';
    }
    update(input){
      if(input.up)this.speed=Math.min(this.speed+this.acceleration,this.maxSpeed);
      else if(input.down)this.speed=Math.max(this.speed-this.braking,-this.maxSpeed*0.5);
      else this.speed*=this.friction;
      if(Math.abs(this.speed)>0.1){
        const s=input.left?-1:input.right?1:0;
        this.angle+=s*this.maxSteer*(this.speed/this.maxSpeed);
      }
      const targetVx=Math.sin(this.angle)*this.speed;
      const targetVy=-Math.cos(this.angle)*this.speed;
      this.vx=this.vx*(1-this.grip)+targetVx*this.grip;
      this.vy=this.vy*(1-this.grip)+targetVy*this.grip;
      this.x+=this.vx;this.y+=this.vy;
    }
    render(ctx){
      ctx.save();ctx.translate(this.x,this.y);ctx.rotate(this.angle);
      ctx.fillStyle=this.color;ctx.fillRect(-this.width/2,-this.height/2,this.width,this.height);
      ctx.fillStyle='#222';
      [[-this.width/2,-this.height/3],[this.width/2-6,-this.height/3],[-this.width/2,this.height/4],[this.width/2-6,this.height/4]].forEach(([wx,wy])=>{ctx.fillRect(wx,wy,6,10);});
      ctx.fillStyle='rgba(255,255,255,0.3)';ctx.fillRect(-this.width/2+4,-this.height/2+4,this.width-8,10);
      ctx.restore();
    }
    wrapBounds(w,h){if(this.x<0)this.x+=w;if(this.x>w)this.x-=w;if(this.y<0)this.y+=h;if(this.y>h)this.y-=h;}
  }
  class InputController {
    constructor(){this.up=false;this.down=false;this.left=false;this.right=false;this._bind();}
    _bind(){
      const map={ArrowUp:'up',ArrowDown:'down',ArrowLeft:'left',ArrowRight:'right',w:'up',s:'down',a:'left',d:'right'};
      document.addEventListener('keydown',e=>{if(map[e.key]){this[map[e.key]]=true;e.preventDefault();}});
      document.addEventListener('keyup',e=>{if(map[e.key])this[map[e.key]]=false;});
    }
  }
  return{Vehicle,InputController};
});
