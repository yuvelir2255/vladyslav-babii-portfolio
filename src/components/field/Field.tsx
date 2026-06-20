'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Geometry, Program, Mesh } from 'ogl';

/**
 * FBM smoke field (the site's signature backdrop, aboutluca-style): a fullscreen
 * quad runs a domain-warped fractal-noise fragment shader, drifting like slow
 * smoke over near-black. The cursor parts the smoke — it shoves the noise domain
 * radially away and thins density into a soft "hole" with a faint rim — via the
 * uMouse* uniforms. uScroll drifts/fades the smoke down the page; scroll velocity
 * adds a touch of turbulence. Fixed, behind all content.
 *
 * Pauses when the tab is hidden. Monochrome (no color tints). Runs regardless of
 * prefers-reduced-motion (project decision: full motion for everyone, like
 * aboutluca). Fallback without WebGL/JS: the static near-black body background.
 */

const vertex = /* glsl */ `
  precision highp float;
  attribute vec2 position;
  attribute vec2 uv;
  varying vec2 vUv;
  void main(){
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;

  varying vec2 vUv;

  uniform float uTime;
  uniform vec2  uResolution;
  uniform float uScroll;       // 0..1 page scroll progress
  uniform float uVelocity;     // smoothed scroll speed (turbulence)
  uniform float uOctaves;      // fbm octaves (perf knob)
  uniform vec2  uMouse;        // [0,1], y up (smoothed JS-side)
  uniform float uMouseRadius;  // radius of influence
  uniform float uMouseStrength;// domain push strength (parting)
  uniform float uMouseHole;    // local density thinning (0..1)
  uniform float uMouseWarp;    // rim ripple strength

  // --- simplex noise 2D (Ashima / Stefan Gustavson) ---
  vec3 mod289(vec3 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec2 mod289(vec2 x){ return x - floor(x*(1.0/289.0))*289.0; }
  vec3 permute(vec3 x){ return mod289(((x*34.0)+1.0)*x); }
  float snoise(vec2 v){
    const vec4 C = vec4(0.211324865405187, 0.366025403784439,
                       -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v -   i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0))
                            + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x  = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p){
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 6; i++) {        // hard cap; uOctaves breaks early
      if (float(i) >= uOctaves) break;
      v += a * snoise(p);
      p = p * 2.02 + 19.19;
      a *= 0.5;
    }
    return v;
  }

  void main(){
    vec2 asp = vec2(uResolution.x / uResolution.y, 1.0);
    vec2 uv  = vUv;
    vec2 p   = (uv - 0.5) * asp * 2.4;     // smoke scale

    float t = uTime * 0.05;
    p.y += uScroll * 0.9;                   // smoke drifts down the page

    // --- cursor parts the smoke: shove the domain radially away from cursor ---
    vec2 mo   = (uMouse - 0.5) * asp * 2.4;
    vec2 toM  = p - mo;
    float dist = length(toM);
    float infl = smoothstep(uMouseRadius, 0.0, dist); // 1 at cursor -> 0 at edge
    p += normalize(toM + 1e-4) * infl * uMouseStrength;

    // --- domain-warped fbm smoke (iq-style q -> r -> f) ---
    float turb = 1.0 + uVelocity * 0.5;
    vec2 q = vec2(fbm(p + vec2(0.0, t)),
                  fbm(p + vec2(5.2, 1.3 - t)));
    vec2 r = vec2(fbm(p + q * 1.6 + vec2(1.7, 9.2) + t * 0.15),
                  fbm(p + q * 1.6 + vec2(8.3, 2.8) - t * 0.12));
    float f = fbm(p + r * turb);

    float density = smoothstep(-0.55, 0.85, f);

    // local thinning ("hole") + faint rim ripple under the cursor
    density *= 1.0 - infl * uMouseHole;
    density += infl * uMouseWarp * 0.10 * snoise(p * 3.0 + t);

    // grayscale smoke over near-black — dark & moody so text stays legible
    vec3 bg    = vec3(0.051);                  // ~#0d0d0d (matches --color-bg)
    vec3 smoke = vec3(0.13) + 0.17 * density;  // dark grays (max ~#4d4d4d)
    vec3 col   = mix(bg, smoke, clamp(density, 0.0, 1.0));

    // soft rim light around the parted hole
    float rim = 1.0 - smoothstep(0.0, 0.16, abs(dist - uMouseRadius * 0.55));
    col += infl * rim * 0.05;

    // vertical vignette + gentle fade as you descend the page
    float vig = smoothstep(1.2, 0.2, length((uv - 0.5) * vec2(1.0, 1.25)));
    col *= 0.55 + 0.45 * vig;
    col *= 1.0 - uScroll * 0.15;

    gl_FragColor = vec4(col, 1.0);
  }
`;

export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Fragment-heavy shader: keep the buffer small. Smoke is soft/low-frequency,
    // so a low dpr is imperceptible and keeps it smooth (more so on phones).
    const isSmall = window.innerWidth < 768;
    const dpr = isSmall ? 0.75 : 1.0;

    const renderer = new Renderer({
      canvas,
      dpr,
      antialias: false,
      alpha: false,
    });
    const gl = renderer.gl;

    // fullscreen triangle (covers clip space; uv 0..1 across the screen)
    const geometry = new Geometry(gl, {
      position: { size: 2, data: new Float32Array([-1, -1, 3, -1, -1, 3]) },
      uv: { size: 2, data: new Float32Array([0, 0, 2, 0, 0, 2]) },
    });

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uResolution: { value: [1, 1] },
        uScroll: { value: 0 },
        uVelocity: { value: 0 },
        uOctaves: { value: isSmall ? 2.0 : 4.0 },
        uMouse: { value: [0.5, 0.5] },
        uMouseRadius: { value: 0.55 },
        uMouseStrength: { value: 0.0 }, // eased toward target each frame
        uMouseHole: { value: 0.55 },
        uMouseWarp: { value: 1.0 },
      },
    });

    const mesh = new Mesh(gl, { geometry, program });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      program.uniforms.uResolution.value = [w, h];
    };
    resize();
    window.addEventListener('resize', resize);

    // --- mouse: smoothed position + hover boost over interactive elements ---
    let targetMX = 0.5;
    let targetMY = 0.5;
    let curMX = 0.5;
    let curMY = 0.5;
    const STRENGTH_BASE = 0.12;
    const STRENGTH_HOVER = 0.22;
    let strengthCur = 0;
    let hoverTarget = 0; // 0..1
    const INTERACTIVE = 'a, button, input, textarea, label, [data-cursor]';

    const onPointer = (e: PointerEvent) => {
      targetMX = e.clientX / window.innerWidth;
      targetMY = 1 - e.clientY / window.innerHeight; // gl_FragCoord origin = bottom-left
    };
    const onOver = (e: PointerEvent) => {
      const t = e.target as Element | null;
      if (t?.closest?.(INTERACTIVE)) hoverTarget = 1;
    };
    const onOut = (e: PointerEvent) => {
      const t = e.target as Element | null;
      const rel = e.relatedTarget as Element | null;
      if (t?.closest?.(INTERACTIVE) && !rel?.closest?.(INTERACTIVE)) {
        hoverTarget = 0;
      }
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerover', onOver, { passive: true });
    window.addEventListener('pointerout', onOut, { passive: true });

    // --- scroll: progress + velocity-driven turbulence ---
    let lastScrollY = window.scrollY;
    let targetVel = 0;
    let velCur = 0;
    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      program.uniforms.uScroll.value = max > 0 ? y / max : 0;
      targetVel = Math.min(Math.abs(y - lastScrollY) / 60, 1);
      lastScrollY = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      program.uniforms.uTime.value = t;

      curMX += (targetMX - curMX) * 0.1;
      curMY += (targetMY - curMY) * 0.1;
      program.uniforms.uMouse.value = [curMX, curMY];

      const strengthTarget =
        STRENGTH_BASE + (STRENGTH_HOVER - STRENGTH_BASE) * hoverTarget;
      strengthCur += (strengthTarget - strengthCur) * 0.08;
      program.uniforms.uMouseStrength.value = strengthCur;

      velCur += (targetVel - velCur) * 0.08;
      targetVel *= 0.9;
      program.uniforms.uVelocity.value = velCur;

      renderer.render({ scene: mesh });
      if (running) raf = requestAnimationFrame(render);
    };
    raf = requestAnimationFrame(render);

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerover', onOver);
      window.removeEventListener('pointerout', onOut);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="fixed inset-0 z-0 block h-full w-full"
    />
  );
}
