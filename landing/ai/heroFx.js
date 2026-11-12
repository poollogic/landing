// The /ai-integrations hero's light, from the signed-off prototype (poollogic-hero v23): smoke rising off
// the assistant window (a WebGL2 fluid simulation) and a beam of light falling onto its top edge (a
// WebGL1 shader), each on a canvas behind the hero's content. HeroFx.jsx renders the canvases and loads
// this file in the browser only, after the page has hydrated; nothing here runs on the server.
// Values, timings, colours and shaders are the prototype's, unchanged. Both canvases render at 75%
// resolution, read the window's position every frame (so they follow it through resizes, the
// hero's zoom steps and its entrance), pause while the hero is off screen, and hold one still frame
// for reduced motion. Without WebGL2 and float render targets the smoke is skipped; without WebGL,
// the beam. Styles: ai.css (.ai-hero-smoke, .ai-hero-beam).
// Below 960px (NARROW), where the window stacks under the copy: the beam fades in only between the
// copy and the window (it never crosses the text), and the smoke is a 550px band around the window's
// top edge instead of the whole ~1500px-tall hero, so its grid isn't stretched into columns. At
// 960px and up, both draw exactly as before.

const SC = 0.75; // canvases render at 75% resolution
const NARROW = '(max-width: 959.98px)'; // ai.css: the hero stacks below this

/**
 * @param {{ hero: HTMLElement, card: HTMLElement, smoke: HTMLCanvasElement, beam: HTMLCanvasElement }} els
 *   The hero section, the assistant window (figure.ai-chat) and the two canvases.
 * @returns {() => void} Stops both and releases their WebGL contexts.
 */
export default function startHeroFx({ hero, card, smoke, beam }) {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const narrow = matchMedia(NARROW);
  const copy = hero.querySelector('.ai-hero-copy');
  const cardBox = () => ({ hr: hero.getBoundingClientRect(), c: card.getBoundingClientRect() });
  const run = (start, cv) => {
    let gl = null;
    try {
      return start(cv, (g) => (gl = g), { hero, card, copy, narrow, cardBox, reduce });
    } catch {
      lose(gl); // a shader that won't compile, or a render target that won't work: skip it
      return null;
    }
  };
  // The smoke now, the beam in the browser's next idle moment: each one's set-up (compiling its shaders)
  // is its own task, so neither holds the page up for long.
  const stops = [run(startSmoke, smoke)];
  let stopped = false;
  const later = 'requestIdleCallback' in window ? requestIdleCallback : (f) => setTimeout(f, 50);
  const beamTask = later(() => { if (!stopped) stops.push(run(startBeam, beam)); });
  return () => {
    stopped = true;
    if ('cancelIdleCallback' in window) cancelIdleCallback(beamTask); else clearTimeout(beamTask);
    stops.forEach((stop) => stop?.());
  };
}

const lose = (gl) => gl?.getExtension('WEBGL_lose_context')?.loseContext();
// No effects where WebGL would run in software (no graphics hardware, or it's blocked): there every frame
// is drawn on the main thread, and the page stops responding (Lighthouse's test devices are like this). The
// contexts ask the browser to refuse in that case (failIfMajorPerformanceCaveat); this catches the rest.
const GL_OPTS = { failIfMajorPerformanceCaveat: true };
const isSoftware = (gl) => {
  const ext = gl.getExtension('WEBGL_debug_renderer_info');
  const name = String(ext ? gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER));
  return /swiftshader|llvmpipe|softpipe|software|basic render/i.test(name);
};

/* ---------- Smoke: a GPU fluid simulation, under the beam ---------- */

function startSmoke(cv, keep, { hero, card, narrow, reduce }) {
  // Narrow: the canvas is a 550px band (ai.css), moved to start 400px above the window's top edge. With
  // a transform, not top: moving it isn't a layout shift. Wide: no transform, the whole hero.
  const place = () => {
    let tf = '';
    if (narrow.matches) tf = `translateY(${Math.round(card.getBoundingClientRect().top - hero.getBoundingClientRect().top - 400)}px)`;
    if (cv.style.transform !== tf) cv.style.transform = tf;
  };
  // The window, against this canvas's own box (the same box as the hero's when wide).
  const box = () => { place(); return { cr: cv.getBoundingClientRect(), c: card.getBoundingClientRect() }; };
  // Only above the window: a radial mask centred on its top edge (redrawn whenever the window moves).
  let mask = '';
  const setMask = () => {
    const { cr, c } = box();
    const cx = ((c.left + c.right) / 2 - cr.left) / cr.width * 100, cy = (c.top - cr.top) / cr.height * 100;
    const m = `radial-gradient(${c.width * .85}px ${(c.top - cr.top) * 1.15}px at ${cx}% ${cy}%, #000 35%, rgba(0,0,0,.5) 65%, transparent 100%)`;
    if (m === mask) return;
    mask = m;
    cv.style.maskImage = m;
    cv.style.webkitMaskImage = m;
  };

  const gl = cv.getContext('webgl2', { alpha: true, premultipliedAlpha: true, antialias: false, depth: false, ...GL_OPTS });
  if (!gl || gl.isContextLost()) return null;
  keep(gl);
  if (isSoftware(gl)) { lose(gl); return null; }
  if (!gl.getExtension('EXT_color_buffer_float')) { lose(gl); return null; }
  gl.getExtension('OES_texture_float_linear');
  setMask();

  const CFG = { SIM: 128, DYE: 384, PRESSURE_IT: 20, VEL_DISS: 1, DYE_DISS: 1.5, CURL: 14, BUOY: .8, SPLAT_R: .0016, MOUSE_FORCE: 3, GAIN: .6, TIME: .065, WIND: 1.3, // steady sideways drift, less curl = no round blobs
    CARD_RADIUS: 20 };
  const PUFFS = [];
  const VS = `#version 300 es
in vec2 p;out vec2 vUv,vL,vR,vT,vB;uniform vec2 tx;void main(){vUv=p*.5+.5;vL=vUv-vec2(tx.x,0.);vR=vUv+vec2(tx.x,0.);vT=vUv+vec2(0.,tx.y);vB=vUv-vec2(0.,tx.y);gl_Position=vec4(p,0.,1.);}`;
  const H = `#version 300 es
precision highp float;precision highp sampler2D;in vec2 vUv,vL,vR,vT,vB;out vec4 o;`;
  const FS = {
    splat: H + `uniform sampler2D uT;uniform vec2 pt;uniform vec3 col;uniform float rad,asp;void main(){vec2 d=vUv-pt;d.x*=asp;o=vec4(texture(uT,vUv).xyz+col*exp(-dot(d,d)/rad),1.);}`,
    advect: H + `uniform sampler2D uV,uS;uniform float dt,diss;void main(){vec2 c=vUv-dt*texture(uV,vUv).xy;o=texture(uS,c)/(1.+diss*dt);}`,
    curl: H + `uniform sampler2D uV;void main(){float L=texture(uV,vL).y,R=texture(uV,vR).y,T=texture(uV,vT).x,B=texture(uV,vB).x;o=vec4(.5*(R-L-T+B),0.,0.,1.);}`,
    vort: H + `uniform sampler2D uV,uC;uniform float cs,dt;void main(){float L=texture(uC,vL).x,R=texture(uC,vR).x,T=texture(uC,vT).x,B=texture(uC,vB).x,C=texture(uC,vUv).x;vec2 f=.5*vec2(abs(T)-abs(B),abs(R)-abs(L));f/=length(f)+1e-4;f*=cs*C;f.y*=-1.;vec2 v=texture(uV,vUv).xy+f*dt;o=vec4(clamp(v,-1.5,1.5),0.,1.);}`,
    div: H + `uniform sampler2D uV;void main(){float L=texture(uV,vL).x,R=texture(uV,vR).x,T=texture(uV,vT).y,B=texture(uV,vB).y;vec2 C=texture(uV,vUv).xy;if(vL.x<0.)L=-C.x;if(vR.x>1.)R=-C.x;if(vT.y>1.)T=-C.y;if(vB.y<0.)B=-C.y;o=vec4(.5*(R-L+T-B),0.,0.,1.);}`,
    pres: H + `uniform sampler2D uP,uD;void main(){float L=texture(uP,vL).x,R=texture(uP,vR).x,T=texture(uP,vT).x,B=texture(uP,vB).x,d=texture(uD,vUv).x;o=vec4((L+R+B+T-d)*.25,0.,0.,1.);}`,
    grad: H + `uniform sampler2D uP,uV;void main(){float L=texture(uP,vL).x,R=texture(uP,vR).x,T=texture(uP,vT).x,B=texture(uP,vB).x;vec2 v=texture(uV,vUv).xy-vec2(R-L,T-B);o=vec4(v,0.,1.);}`,
    mul: H + `uniform sampler2D uT;uniform float v;void main(){o=texture(uT,vUv)*v;}`,
    buoy: H + `uniform sampler2D uV,uD;uniform float b,dt,t,wind,cx;void main(){vec2 v=texture(uV,vUv).xy;float d=texture(uD,vUv).x;v.y+=d*b*dt;v.x+=sign(vUv.x-cx)*wind*min(d,1.)*dt*smoothstep(0.,.04,abs(vUv.x-cx));v.x+=sin(vUv.y*9.+t*.7)*.012*d*dt*10.;o=vec4(v,0.,1.);}`,
    show: H + `uniform sampler2D uD;uniform vec4 card;uniform float gain,t,crad;uniform vec2 res;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
void main(){float d=texture(uD,vUv).x;vec2 px=vUv*res;
float det=.7+.6*n(px/22.+vec2(0.,-t*.4))*n(px/9.+vec2(t*.2,-t*.9));
float a=1.-exp(-d*gain*det);float s_=smoothstep(.0,.42,a);a=s_/(1.+1.2*s_)*.34*1.6; // v20: thick spots capped, thin wisps unchanged
vec2 lo=card.xy*res,hi=card.zw*res;vec2 c=(lo+hi)*.5,hb=(hi-lo)*.5;vec2 q=abs(px-c)-hb+crad;float sd=length(max(q,0.))+min(max(q.x,q.y),0.)-crad;
a*=smoothstep(-.5,1.5,sd);a=min(a,.5);
vec3 col=mix(vec3(.13,.36,.9),vec3(.62,.8,1.),clamp(d*.6,0.,1.));
o=vec4(col*a,a);}`,
  };
  // The programs compile and link in the background where the browser can (KHR_parallel_shader_compile):
  // nothing asks for a result until they're done (boot, below), so no single task waits on all ten.
  const sh = (t, s) => { const o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; };
  const vsh = sh(gl.VERTEX_SHADER, VS), P = {}, links = {};
  for (const k in FS) {
    const f = sh(gl.FRAGMENT_SHADER, FS[k]); const p = gl.createProgram(); gl.attachShader(p, vsh); gl.attachShader(p, f); gl.bindAttribLocation(p, 0, 'p'); gl.linkProgram(p); links[k] = { p, f };
  }
  const par = gl.getExtension('KHR_parallel_shader_compile');
  const linked = () => !par || Object.values(links).every(({ p }) => gl.getProgramParameter(p, par.COMPLETION_STATUS_KHR));
  const finishPrograms = () => {
    for (const k in links) {
      const { p, f } = links[k];
      if (!gl.getProgramParameter(p, gl.LINK_STATUS)) throw new Error(gl.getShaderInfoLog(vsh) || gl.getShaderInfoLog(f) || gl.getProgramInfoLog(p));
      const u = {}; const n = gl.getProgramParameter(p, gl.ACTIVE_UNIFORMS); for (let i = 0; i < n; i++) { const nm = gl.getActiveUniform(p, i).name; u[nm] = gl.getUniformLocation(p, nm); } P[k] = { p, u };
    }
  };
  const vb = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, vb); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW); gl.enableVertexAttribArray(0); gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

  // Render targets: half-float textures, each with its framebuffer. Remade (and the old ones freed) when the width changes.
  let targets = [];
  const fbo = (w, h, ifmt, fmt) => {
    const tx = gl.createTexture(); gl.bindTexture(gl.TEXTURE_2D, tx);
    [[gl.TEXTURE_MIN_FILTER, gl.LINEAR], [gl.TEXTURE_MAG_FILTER, gl.LINEAR], [gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE], [gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE]].forEach(([a, b]) => gl.texParameteri(gl.TEXTURE_2D, a, b));
    gl.texImage2D(gl.TEXTURE_2D, 0, ifmt, w, h, 0, fmt, gl.HALF_FLOAT, null); const f = gl.createFramebuffer(); gl.bindFramebuffer(gl.FRAMEBUFFER, f);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, tx, 0);
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) throw new Error('smoke: float render targets unavailable');
    gl.viewport(0, 0, w, h); gl.clearColor(0, 0, 0, 1); gl.clear(gl.COLOR_BUFFER_BIT);
    const target = { tx, f, w, h }; targets.push(target); return target;
  };
  const dbl = (w, h, i, f) => { let a = fbo(w, h, i, f), b = fbo(w, h, i, f); return { get r() { return a; }, get w_() { return b; }, swap() { [a, b] = [b, a]; } }; };
  let vel, dye, curl, divg, pres, simW, simH, dyeW, dyeH, asp = 1;
  const init = () => {
    targets.forEach(({ tx, f }) => { gl.deleteFramebuffer(f); gl.deleteTexture(tx); }); targets = [];
    const w = cv.clientWidth, h = cv.clientHeight; asp = w / h; cv.width = Math.round(w * SC); cv.height = Math.round(h * SC);
    simH = CFG.SIM; simW = Math.round(CFG.SIM * asp); dyeH = CFG.DYE; dyeW = Math.round(CFG.DYE * asp);
    vel = dbl(simW, simH, gl.RG16F, gl.RG); dye = dbl(dyeW, dyeH, gl.R16F, gl.RED); curl = fbo(simW, simH, gl.R16F, gl.RED); divg = fbo(simW, simH, gl.R16F, gl.RED); pres = dbl(simW, simH, gl.R16F, gl.RED);
  };
  const run = (prog, target, w, h, set) => {
    gl.useProgram(prog.p); gl.uniform2f(prog.u.tx, 1 / w, 1 / h); let unit = 0;
    set((name, tex) => { gl.activeTexture(gl.TEXTURE0 + unit); gl.bindTexture(gl.TEXTURE_2D, tex); gl.uniform1i(prog.u[name], unit++); }, prog.u);
    gl.bindFramebuffer(gl.FRAMEBUFFER, target ? target.f : null); gl.viewport(0, 0, target ? target.w : cv.width, target ? target.h : cv.height); gl.drawArrays(gl.TRIANGLES, 0, 3);
  };
  const splat = (x, y, dx, dy, amt, rad) => {
    run(P.splat, vel.w_, simW, simH, (b, u) => { b('uT', vel.r.tx); gl.uniform2f(u.pt, x, y); gl.uniform3f(u.col, dx, dy, 0); gl.uniform1f(u.rad, rad); gl.uniform1f(u.asp, asp); }); vel.swap();
    if (amt > 0) { run(P.splat, dye.w_, dyeW, dyeH, (b, u) => { b('uT', dye.r.tx); gl.uniform2f(u.pt, x, y); gl.uniform3f(u.col, amt, 0, 0); gl.uniform1f(u.rad, rad); gl.uniform1f(u.asp, asp); }); dye.swap(); }
  };
  const cardUV = () => { const { cr, c } = box(); return [(c.left - cr.left) / cr.width, 1 - (c.bottom - cr.top) / cr.height, (c.right - cr.left) / cr.width, 1 - (c.top - cr.top) / cr.height]; };

  // The pointer only stirs: it adds velocity, never smoke. On window, so moving over the header counts.
  const M = { x: 0, y: 0, dx: 0, dy: 0, moved: false, init: false };
  const onMove = (e) => {
    const cr = cv.getBoundingClientRect(); if (e.clientY > cr.bottom || e.clientY < cr.top - 10) return;
    const x = (e.clientX - cr.left) / cr.width, y = 1 - (e.clientY - cr.top) / cr.height;
    if (!M.init) { M.x = x; M.y = y; M.init = true; return; } M.dx += x - M.x; M.dy += y - M.y; M.x = x; M.y = y; M.moved = true;
  };

  let t = 0, last = performance.now(), raf = 0, vis = true;
  const sim = (dtReal) => {
    const dt = dtReal * CFG.TIME; t += dt; const cu = cardUV();
    { const w = cu[2] - cu[0], cx = (cu[0] + cu[2]) / 2; // separate puffs that roll off the edge and curl up
      if (Math.random() < .04) PUFFS.push({ u: Math.random() * 2 - 1, life: 14 });
      for (let i = PUFFS.length - 1; i >= 0; i--) { const p = PUFFS[i]; if (--p.life < 0) { PUFFS.splice(i, 1); continue; }
        splat(cx + p.u * w * .48, cu[3] + .003, p.u * .22 + (Math.random() - .5) * .02, .1, .07, .0005); } }
    if (M.moved) { const f = CFG.MOUSE_FORCE / Math.max(dtReal, .008); splat(M.x, M.y, M.dx * f, M.dy * f, 0, CFG.SPLAT_R); M.dx = M.dy = 0; M.moved = false; }
    run(P.curl, curl, simW, simH, (b) => b('uV', vel.r.tx));
    run(P.vort, vel.w_, simW, simH, (b, u) => { b('uV', vel.r.tx); b('uC', curl.tx); gl.uniform1f(u.cs, CFG.CURL); gl.uniform1f(u.dt, dt); }); vel.swap();
    run(P.buoy, vel.w_, simW, simH, (b, u) => { b('uV', vel.r.tx); b('uD', dye.r.tx); gl.uniform1f(u.b, CFG.BUOY); gl.uniform1f(u.dt, dt); gl.uniform1f(u.t, t); gl.uniform1f(u.wind, CFG.WIND); gl.uniform1f(u.cx, (cu[0] + cu[2]) / 2); }); vel.swap();
    run(P.div, divg, simW, simH, (b) => b('uV', vel.r.tx));
    run(P.mul, pres.w_, simW, simH, (b, u) => { b('uT', pres.r.tx); gl.uniform1f(u.v, .8); }); pres.swap();
    for (let i = 0; i < CFG.PRESSURE_IT; i++) { run(P.pres, pres.w_, simW, simH, (b) => { b('uP', pres.r.tx); b('uD', divg.tx); }); pres.swap(); }
    run(P.grad, vel.w_, simW, simH, (b) => { b('uP', pres.r.tx); b('uV', vel.r.tx); }); vel.swap();
    run(P.advect, vel.w_, simW, simH, (b, u) => { b('uV', vel.r.tx); b('uS', vel.r.tx); gl.uniform1f(u.dt, dt); gl.uniform1f(u.diss, CFG.VEL_DISS); }); vel.swap();
    run(P.advect, dye.w_, dyeW, dyeH, (b, u) => { b('uV', vel.r.tx); b('uS', dye.r.tx); gl.uniform1f(u.dt, dt); gl.uniform1f(u.diss, CFG.DYE_DISS); }); dye.swap();
  };
  const draw = () => {
    gl.enable(gl.BLEND); gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA); gl.bindFramebuffer(gl.FRAMEBUFFER, null); gl.viewport(0, 0, cv.width, cv.height);
    gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT);
    run(P.show, null, cv.width, cv.height, (b, u) => { b('uD', dye.r.tx); gl.uniform4f(u.card, ...cardUV()); gl.uniform1f(u.gain, CFG.GAIN); gl.uniform1f(u.t, t);
      gl.uniform1f(u.crad, CFG.CARD_RADIUS * cv.width / cv.clientWidth); gl.uniform2f(u.res, cv.width, cv.height); }); gl.disable(gl.BLEND);
  };
  // Pre-fill so the smoke is already there: 250 steps, 10 a frame, so no single frame stalls.
  let pre = 250;
  const prefill = (all) => { const n = all ? pre : Math.min(10, pre); for (let i = 0; i < n; i++) sim(.033); pre -= n; };
  const step = (now) => {
    if (pre > 0) prefill(false);
    const dtReal = Math.min(.033, (now - last) / 1000); last = now;
    if (cv.width !== Math.round(cv.clientWidth * SC)) init();
    setMask(); sim(dtReal); draw(); if (vis && !reduce) raf = requestAnimationFrame(step);
  };
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) { last = performance.now(); raf = requestAnimationFrame(step); } });
  // Starts once its programs are ready: a frame to check, a frame for the render targets, then the
  // pre-fill a little per frame (step).
  const boot = () => {
    if (!linked()) { raf = requestAnimationFrame(boot); return; }
    try { finishPrograms(); init(); } catch { lose(gl); return; } // a shader that won't compile, or a target that won't work: skip it
    io.observe(hero);
    addEventListener('pointermove', onMove, { passive: true });
    addEventListener('resize', setMask);
    if (reduce) { prefill(true); draw(); } else raf = requestAnimationFrame(step);
  };
  raf = requestAnimationFrame(boot);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    removeEventListener('pointermove', onMove);
    removeEventListener('resize', setMask);
    lose(gl);
  };
}

/* ---------- Beam: light falling onto the window's top edge, over the smoke ---------- */

function startBeam(cv, keep, { hero, copy, narrow, cardBox, reduce }) {
  const gl = cv.getContext('webgl', { premultipliedAlpha: true, alpha: true, ...GL_OPTS });
  if (!gl || gl.isContextLost()) return null;
  keep(gl);
  if (isSoftware(gl)) { lose(gl); return null; }
  const vs = 'attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}';
  const fs = `precision highp float;uniform vec2 r;uniform float t;uniform vec4 cb;uniform float bx;uniform float k;uniform float m;uniform float fe,fs,top0;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float sdr(vec2 p,vec2 b,float rr){vec2 q=abs(p)-b+rr;return length(max(q,0.))+min(max(q.x,q.y),0.)-rr;}
float g(float x,float s){return exp(-(x*x)/(s*s));}
void main(){vec2 f=gl_FragCoord.xy;
float L=cb.x,R=cb.y,T=cb.z,B=cb.w;float W=R-L;vec2 c=vec2((L+R)*.5,(T+B)*.5);vec2 hb=vec2(W*.5,(T-B)*.5);
float d=sdr(f-c,hb,20.*k);float dd=max(d,0.);float out_=smoothstep(-1.,1.5,d);
float x0=bx+sin(t*.23)*1.5*k;
// v21: the beam waves gently like a wavy bolt, pinned at the top and at the landing point
float wig=(sin(f.y/(55.*k)+t*1.6)+.4*sin(f.y/(23.*k)-t*2.3+1.3))*1.7*k*m*sin(3.14159*clamp((f.y-T)/(r.y-T),0.,1.));
float dx=f.x-x0-wig;float dy=f.y-T;float dyp=max(dy,0.);
float breathe=.9+.06*sin(t*.9)+.03*sin(t*2.3+1.);
float flow=.86+.14*(.5+.5*sin((f.y+t*220.*k)/(13.*k)))*(.5+.5*sin((f.y+t*140.*k)/(41.*k)))*2.;
// Narrow: the beam's column, halo and specks fade in from fs (just under the copy) to fe (just above the
// window); wide, fade is 1 everywhere. top0 is where the pulses start: the canvas top when wide.
float fade=1.-smoothstep(fe,fs,f.y);
float P=3.4;float ph=fract(t/P);float hit=.45;
float fall=clamp(ph/hit,0.,1.);float yp=mix(top0+60.*k,T,fall*fall);
float pulse=g(f.y-yp,(16.+40.*fall)*k)*step(ph,hit)*m;
float since=max(ph-hit,0.)*P;float flash=exp(-since/.35)*step(hit,ph)*m;
float ph2=fract(t/1.6+.37);float yp2=mix(top0,T,ph2*ph2);float pk=g(f.y-yp2,9.*k)*.12*m;
float w=1.1*k+(55.+12.*flash)*k*exp(-dyp/(55.*k))+5.*k*exp(-dyp/(300.*k));
float beamMask=smoothstep(-6.*k,2.*k,dy);float below=dy>=0.?1.:exp(dy/(40.*k));
float core=exp(-abs(dx)/(w*.3));float bg=exp(-abs(dx)/(w*1.6+34.*k))*.32+exp(-abs(dx)/(170.*k))*.09;
float energy=flow*(1.+pulse*.28+pk);
float beam=(core*.8*energy*beamMask+bg*below*(1.+pulse*.14+pk*.08))*breathe*(.45+.55*smoothstep(r.y,T,f.y));
float along=exp(-abs(dx)/(W*.36));float ox=max(max(L-f.x,f.x-R),0.);
float spill=exp(-abs(dy)/(20.*k))*along*exp(-ox/(24.*k))*(.5+.25*flash)*breathe;
float rim=exp(-abs(d)/(1.6*k))*((along*.85+.06)*breathe+.25*flash*along);
float side=exp(-dd/(14.*k))*exp(-max(T-f.y,0.)/(hb.y*.45))*.26*breathe;
float halo=exp(-abs(dx)/(260.*k))*exp(-dyp/(300.*k))*below*(.12+.03*flash);
vec2 cs=vec2(48.)*k;vec2 mp=f+vec2(sin(t*.4+f.y*.012)*5.*k,t*45.*k);vec2 id=floor(mp/cs);vec2 lp=fract(mp/cs);
vec2 pp=vec2(h(id),h(id+7.3))*.8+.1;float rnd=h(id+3.1);
float mote=smoothstep(1.5*k,0.,length((lp-pp)*cs))*step(.76,rnd)*(.55+.45*sin(t*(1.+rnd*2.)+rnd*40.));
float moteLit=exp(-abs(dx)/(100.*k))*smoothstep(0.,30.*k,dy)*exp(-dyp/(380.*k))*m;
float I=(beam*fade+spill+side+halo*fade+mote*moteLit*.35*fade)*out_+rim;
I+=(h(f+fract(t))-.5)*.02*min(I,1.);
vec3 deep=vec3(.09,.30,.86),mid=vec3(.38,.64,.98),hot=vec3(.90,.95,1.);
vec3 col=mix(deep,mid,clamp(bg*1.5+halo*3.,0.,1.));col=mix(col,hot,clamp(core*1.1*beamMask+rim*.85+spill*.5+mote*moteLit*.6+pulse*.08,0.,1.));
float a=clamp(I,0.,.92);gl_FragColor=vec4(col*a,a);}`;
  const sh = (ty, s) => { const o = gl.createShader(ty); gl.shaderSource(o, s); gl.compileShader(o); if (!gl.getShaderParameter(o, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(o)); return o; };
  const pr = gl.createProgram(); gl.attachShader(pr, sh(gl.VERTEX_SHADER, vs)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, fs)); gl.linkProgram(pr); gl.useProgram(pr);
  const bf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, bf); gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const Lc = gl.getAttribLocation(pr, 'p'); gl.enableVertexAttribArray(Lc); gl.vertexAttribPointer(Lc, 2, gl.FLOAT, false, 0, 0);
  const U = {}; ['r', 't', 'cb', 'bx', 'k', 'm', 'fe', 'fs', 'top0'].forEach((n) => (U[n] = gl.getUniformLocation(pr, n)));
  // Every frame: the canvas at the hero's size, and the window's box, in canvas pixels from the bottom.
  const size = () => {
    const { hr, c } = cardBox(); const w = Math.round(hr.width * SC), hh = Math.round(hr.height * SC);
    if (cv.width !== w || cv.height !== hh) { cv.width = w; cv.height = hh; gl.viewport(0, 0, w, hh); }
    const L = (c.left - hr.left) * SC, R = (c.right - hr.left) * SC, T = hh - (c.top - hr.top) * SC, B = hh - (c.bottom - hr.top) * SC;
    gl.uniform2f(U.r, w, hh); gl.uniform4f(U.cb, L, R, T, B); gl.uniform1f(U.bx, L + (R - L) * .4); gl.uniform1f(U.k, SC);
    // Narrow: invisible above 12px under the copy, full strength from 24px above the window; the pulse
    // falls from where it fades in. Wide: the fade's edges far above the canvas (fade = 1), pulses from the top.
    if (narrow.matches && copy) {
      const fsY = hh - (copy.getBoundingClientRect().bottom - hr.top + 12) * SC;
      const feY = Math.min(fsY - 1, hh - (c.top - hr.top - 24) * SC);
      gl.uniform1f(U.fs, fsY); gl.uniform1f(U.fe, feY); gl.uniform1f(U.top0, fsY - 60 * SC);
    } else {
      gl.uniform1f(U.fs, hh + 2e4); gl.uniform1f(U.fe, hh + 1e4); gl.uniform1f(U.top0, hh);
    }
  };
  gl.uniform1f(U.m, reduce ? 0 : 1); // reduced motion: no pulses, wave or specks, one still frame
  let vis = true, raf = 0; const t0 = performance.now();
  const fr = (now) => {
    size(); gl.clearColor(0, 0, 0, 0); gl.clear(gl.COLOR_BUFFER_BIT); gl.uniform1f(U.t, (now - t0) / 1000 + 20); gl.drawArrays(gl.TRIANGLES, 0, 3);
    if (vis && !reduce) raf = requestAnimationFrame(fr);
  };
  const io = new IntersectionObserver(([e]) => { vis = e.isIntersecting; cancelAnimationFrame(raf); if (vis) raf = requestAnimationFrame(fr); });
  io.observe(hero); raf = requestAnimationFrame(fr);

  return () => {
    cancelAnimationFrame(raf);
    io.disconnect();
    lose(gl);
  };
}
