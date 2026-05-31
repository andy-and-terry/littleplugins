/*!
 * FractalKit - Real-time fractal renderer (Mandelbrot, Julia) on WebGL
 * MIT License
 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.FractalKit=factory();})(typeof self!=='undefined'?self:this,function(){
  const VS=`attribute vec2 a_pos;void main(){gl_Position=vec4(a_pos,0,1);}`;
  const FS=`precision highp float;uniform vec2 u_res,u_center;uniform float u_zoom,u_iter;uniform int u_type;uniform vec2 u_julia;
  vec3 hsv2rgb(float h,float s,float v){vec4 K=vec4(1.,2./3.,1./3.,3.);vec3 p=abs(fract(vec3(h)+K.xyz)*6.-K.www);return v*mix(K.xxx,clamp(p-K.xxx,0.,1.),s);}
  void main(){vec2 uv=(gl_FragCoord.xy-u_res*.5)/min(u_res.x,u_res.y)*4./u_zoom+u_center;vec2 c=u_type==0?uv:u_julia,z=u_type==0?vec2(0):uv;float i=0.;for(float n=0.;n<512.;n++){if(n>=u_iter)break;z=vec2(z.x*z.x-z.y*z.y,2.*z.x*z.y)+c;if(dot(z,z)>4.){i=n-log2(log2(dot(z,z)))+4.;break;}}float t=i/u_iter;gl_FragColor=t==0.?vec4(0,0,0,1):vec4(hsv2rgb(t*.7+.5,1.,1.),1.);}`;
  function compile(gl,type,src){const s=gl.createShader(type);gl.shaderSource(s,src);gl.compileShader(s);return s;}
  class Renderer{
    constructor(canvas,options={}){
      this.canvas=typeof canvas==='string'?document.querySelector(canvas):canvas;
      const gl=this.gl=this.canvas.getContext('webgl');
      const prog=gl.createProgram();[compile(gl,gl.VERTEX_SHADER,VS),compile(gl,gl.FRAGMENT_SHADER,FS)].forEach(s=>gl.attachShader(prog,s));gl.linkProgram(prog);gl.useProgram(prog);this.prog=prog;
      const buf=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.bufferData(gl.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),gl.STATIC_DRAW);
      const loc=gl.getAttribLocation(prog,'a_pos');gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,2,gl.FLOAT,false,0,0);
      this.u={res:gl.getUniformLocation(prog,'u_res'),center:gl.getUniformLocation(prog,'u_center'),zoom:gl.getUniformLocation(prog,'u_zoom'),iter:gl.getUniformLocation(prog,'u_iter'),type:gl.getUniformLocation(prog,'u_type'),julia:gl.getUniformLocation(prog,'u_julia')};
      this.center=[options.cx||-0.5,options.cy||0];this.zoom=options.zoom||1;this.iter=options.iter||100;this.type=options.type||0;this.julia=options.julia||[-0.7,0.27];
      this._bindEvents();
    }
    render(){
      const{gl,canvas}=this;gl.viewport(0,0,canvas.width,canvas.height);
      gl.uniform2f(this.u.res,canvas.width,canvas.height);gl.uniform2fv(this.u.center,this.center);gl.uniform1f(this.u.zoom,this.zoom);gl.uniform1f(this.u.iter,this.iter);gl.uniform1i(this.u.type,this.type);gl.uniform2fv(this.u.julia,this.julia);
      gl.drawArrays(gl.TRIANGLE_STRIP,0,4);
    }
    _bindEvents(){
      const c=this.canvas;
      c.addEventListener('wheel',e=>{const f=e.deltaY<0?1.2:1/1.2;const r=c.getBoundingClientRect();const mx=(e.clientX-r.left-c.width/2)/Math.min(c.width,c.height)*4/this.zoom;const my=(e.clientY-r.top-c.height/2)/Math.min(c.width,c.height)*4/this.zoom;this.center[0]+=mx*(1-1/f);this.center[1]+=my*(1-1/f);this.zoom*=f;this.render();e.preventDefault();},{passive:false});
      let drag=false,lx=0,ly=0;c.addEventListener('mousedown',e=>{drag=true;lx=e.clientX;ly=e.clientY;});document.addEventListener('mousemove',e=>{if(!drag)return;const dx=(e.clientX-lx)/Math.min(c.width,c.height)*4/this.zoom;const dy=(e.clientY-ly)/Math.min(c.width,c.height)*4/this.zoom;this.center[0]-=dx;this.center[1]-=dy;lx=e.clientX;ly=e.clientY;this.render();});document.addEventListener('mouseup',()=>drag=false);
    }
    setJulia(cx,cy){this.julia=[cx,cy];this.type=1;this.render();}
    setMandelbrot(){this.type=0;this.render();}
  }
  return{Renderer};
});
