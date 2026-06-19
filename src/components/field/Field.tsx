'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Camera, Geometry, Program, Mesh } from 'ogl';

/**
 * WebGL particle dune field (the site's signature backdrop).
 * A grid of glowing points displaced by layered simplex noise into drifting
 * dunes that recede to a horizon, rendered additively over the dark page.
 * Fixed, behind all content.
 *
 * Stage 1: dunes + slow drift. Cursor reaction, scroll-camera, stars and
 * word-morph land in later iterations. Honors reduced-motion (single static
 * frame) and pauses when the tab is hidden.
 */

const vertex = /* glsl */ `
  precision highp float;

  attribute vec2 aPos;          // grid coords: x in [-9,9], z in [5,-30]

  uniform mat4 modelViewMatrix; // provided by OGL
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uScroll;
  uniform float uDpr;
  uniform float uSize;

  varying float vBright;

  // --- simplex noise 2D (Ashima / Stefan Gustavson) ---
  vec3 mod289(vec3 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
  vec2 mod289(vec2 x){ return x - floor(x * (1.0/289.0)) * 289.0; }
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

  void main(){
    float t = uTime * 0.04;
    float z = aPos.y + uScroll * 4.0;        // terrain flows toward camera on scroll

    float h  = snoise(vec2(aPos.x * 0.18, z * 0.18 - t)) * 0.60;
    h       += snoise(vec2(aPos.x * 0.45, z * 0.45 - t)) * 0.28;
    h       += snoise(vec2(aPos.x * 1.10, z * 1.10 - t)) * 0.12;

    vec3 pos = vec3(aPos.x, h * 0.9, aPos.y);

    vBright = smoothstep(-0.3, 0.7, h);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uDpr / max(-mv.z, 0.5), 1.0, 22.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  varying float vBright;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * (0.12 + vBright * 0.95);
    if (a < 0.01) discard;
    gl_FragColor = vec4(vec3(1.0), a);
  }
`;

export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const reduce = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr,
      antialias: true,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 50, near: 0.1, far: 200 });
    camera.position.set(0, 0.75, 5.5);
    camera.lookAt([0, 0.15, -12]);

    // point grid: wide in x, receding far in -z (all in front of the camera)
    const NX = 220;
    const NZ = 220;
    const data = new Float32Array(NX * NZ * 2);
    let k = 0;
    for (let j = 0; j < NZ; j++) {
      const z = 5 - (j / (NZ - 1)) * 35; // 5 (near) -> -30 (far)
      for (let i = 0; i < NX; i++) {
        const x = -9 + (i / (NX - 1)) * 18; // -9 -> 9
        data[k++] = x;
        data[k++] = z;
      }
    }

    const geometry = new Geometry(gl, { aPos: { size: 2, data } });
    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uDpr: { value: dpr },
        uSize: { value: 18 },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    program.setBlendFunc(gl.SRC_ALPHA, gl.ONE); // additive glow

    const mesh = new Mesh(gl, { geometry, program, mode: gl.POINTS });

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
      if (reduce) renderer.render({ scene: mesh, camera });
    };
    resize();
    window.addEventListener('resize', resize);

    let raf = 0;
    let running = true;
    const start = performance.now();
    const render = (now: number) => {
      program.uniforms.uTime.value = (now - start) / 1000;
      renderer.render({ scene: mesh, camera });
      if (running) raf = requestAnimationFrame(render);
    };

    if (reduce) {
      renderer.render({ scene: mesh, camera });
    } else {
      raf = requestAnimationFrame(render);
    }

    const onVisibility = () => {
      if (document.hidden) {
        running = false;
        cancelAnimationFrame(raf);
      } else if (!reduce && !running) {
        running = true;
        raf = requestAnimationFrame(render);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
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
