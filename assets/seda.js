/* SEDA — hilos de luz en grises, un solo fragment shader.

   Cada fotograma es funcion pura del tiempo (`t`), sin estado acumulado: por
   eso sirve igual para la web (t = reloj) que para renderizar video (t =
   fotograma / fps). No usa librerias.

   crearSeda(canvas, opciones) -> { pintar(t, intensidad, desp), tam(), borrar() }
     desp    : desplazamiento vertical de la vena luminosa (en unidades del lado corto)
     claro   : hilos oscuros sobre fondo claro (modo claro del sitio)
     escala  : resolucion interna respecto al tamaño CSS (1 = nitido, .6 = ligero)
     fase    : desplaza el dibujo; dos instancias con fases distintas no se repiten
*/
(function (g) {
  const VS = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const FS = `precision highp float;
uniform vec2 uR;uniform float uT;uniform float uI;uniform float uF;uniform float uC;uniform float uP;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float a=.5,s=0.;for(int i=0;i<4;i++){s+=a*n(p);p=p*2.03+vec2(7.1,3.3);a*=.5;}return s;}
// Una estela: curva que respira, hilos paralelos y una vena luminosa en el centro.
//   off   : posicion vertical de la vena     slope : inclinacion
//   ph    : fase propia                       k     : hacia que lado se abre el abanico (+1 / -1)
float estela(vec2 uv,float t,float off,float slope,float ph,float k){
 float w=fbm(uv*.9+vec2(t+ph,-t*.5));
 float c=.30*sin(uv.x*1.5+t*2.+ph+w*.9)+slope*uv.x+.05*sin(uv.x*3.2-t*3.+ph);
 float d=uv.y-c-off;
 float fan=.55+1.25*smoothstep(-1.,1.,uv.x*k);
 float u=d/fan;
 float p=u*46.+w*2.2+t*2.;
 float hil=pow(.5+.5*sin(p),26.);
 float fino=pow(.5+.5*sin(p*2.3+1.7),40.)*.6;
 float env=exp(-pow(u/.24,2.));
 float nucleo=exp(-pow(u/.05,2.))*.45;
 float vel=exp(-pow(u/.9,2.))*.26*(.6+fbm(uv*2.2+t));
 return (hil*.75+fino)*env+nucleo*env+vel;
}
vec2 rot(vec2 p,float a){float c=cos(a),s=sin(a);return vec2(c*p.x-s*p.y,s*p.x+c*p.y);}
void main(){
 vec2 uv=(gl_FragCoord.xy-.5*uR)/min(uR.x,uR.y);
 float t=uT*.12+uF;
 float E=.5*uR.y/min(uR.x,uR.y);          // mitad del alto visible
 float X=.5*uR.x/min(uR.x,uR.y);          // mitad del ancho visible
 // UNA estela que barre toda la pantalla, como en la referencia: un manojo
 // grueso de hilos con resplandor que cruza de lado a lado. Su orientacion
 // gira despacio entre horizontal, diagonal y vertical, y su recorrido va de un
 // borde al otro. uP la empuja en vertical para acompanar al titulo de la seccion.
 float th=.6+.95*sin(uT*.1+uF);
 float off=1.05*max(X,E)*sin(uT*.2+uF);
 float L=estela(rot(uv-vec2(0.,uP),th),t,off,.16*sin(uT*.13),0.,1.);
 L=min(L,1.7);
 float v=1.-dot(uv*.55,uv*.55);
 L=L*uI*v;
 vec3 luz=vec3(.80,.82,.86);
 vec3 col;
 if(uC>.5){ col=vec3(.92,.93,.95)-vec3(.78,.78,.76)*clamp(L,0.,1.); }   // claro: tinta sobre papel
 else     { col=luz*L+vec3(.012,.012,.014); }
 col+=(h(gl_FragCoord.xy+uT)-.5)*.012;
 gl_FragColor=vec4(col,1.);}`;

  g.crearSeda = function (canvas, op) {
    op = op || {};
    const gl = canvas.getContext('webgl', { antialias: false, alpha: false, powerPreserveDrawingBuffer: true });
    if (!gl) return null;
    const sh = (t, s) => {
      const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o);
      if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o));
      return o;
    };
    const pr = gl.createProgram();
    gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
    gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
    gl.linkProgram(pr); gl.useProgram(pr);
    const b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const lp = gl.getAttribLocation(pr, 'p');
    gl.enableVertexAttribArray(lp); gl.vertexAttribPointer(lp, 2, gl.FLOAT, false, 0, 0);
    const U = k => gl.getUniformLocation(pr, k);
    const uR = U('uR'), uT = U('uT'), uI = U('uI'), uF = U('uF'), uC = U('uC'), uP = U('uP');
    const escala = op.escala || 1;

    function tam() {
      const r = Math.min(devicePixelRatio || 1, 1.5) * escala;
      const w = Math.max(2, Math.round(canvas.clientWidth * r));
      const h = Math.max(2, Math.round(canvas.clientHeight * r));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    function pintar(t, intensidad, desp) {
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, t);
      gl.uniform1f(uI, intensidad == null ? 1 : intensidad);
      gl.uniform1f(uF, op.fase || 0);
      gl.uniform1f(uC, op.claro ? 1 : 0);
      gl.uniform1f(uP, desp || 0);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    }
    function borrar() { const e = gl.getExtension('WEBGL_lose_context'); if (e) e.loseContext(); }
    tam();
    return { pintar, tam, borrar, set claro(v) { op.claro = !!v; } };
  };
})(window);
