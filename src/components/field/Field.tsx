'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Camera, Transform, Geometry, Program, Mesh } from 'ogl';

/**
 * WebGL particle field (the site's signature backdrop):
 *  - a grid of glowing points displaced by layered simplex noise into drifting
 *    dunes that recede to a horizon, and
 *  - a twinkling starfield above the horizon.
 * The whole scene parallaxes gently toward the cursor. Fixed, behind all content.
 *
 * Pauses when the tab is hidden. uScroll flows the terrain toward the camera on
 * page scroll. Runs regardless of prefers-reduced-motion (project decision: full
 * motion for everyone, like aboutluca).
 */

const duneVertex = /* glsl */ `
  precision highp float;

  attribute vec2 aPos;          // grid coords: x in [-9,9], z in [5,-30]

  uniform mat4 modelViewMatrix; // provided by OGL
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uScroll;
  uniform float uDpr;
  uniform float uSize;
  uniform float uEnergy;

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

    vec3 pos = vec3(aPos.x, h * 0.9 * (1.0 + uEnergy * 0.18), aPos.y);

    vBright = smoothstep(-0.3, 0.7, h);

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = clamp(uSize * uDpr / max(-mv.z, 0.5), 1.0, 22.0);
  }
`;

const duneFragment = /* glsl */ `
  precision highp float;
  varying float vBright;
  uniform float uEnergy;
  uniform vec3 uTint;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * (0.12 + vBright * 0.95);
    a *= 1.0 + uEnergy * 0.6;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uTint, a);
  }
`;

const starVertex = /* glsl */ `
  precision highp float;

  attribute vec3 aPos;
  attribute vec2 aSeed;         // x: twinkle phase, y: base size

  uniform mat4 modelViewMatrix;
  uniform mat4 projectionMatrix;
  uniform float uTime;
  uniform float uDpr;

  varying float vTw;

  void main(){
    float tw = 0.6 + 0.4 * sin(uTime * (0.5 + aSeed.x * 1.6) + aSeed.x * 6.2831);
    vTw = tw;
    vec4 mv = modelViewMatrix * vec4(aPos, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = max(aSeed.y * uDpr, 1.4);
  }
`;

const starFragment = /* glsl */ `
  precision highp float;
  varying float vTw;
  uniform vec3 uTint;
  void main(){
    vec2 uv = gl_PointCoord - 0.5;
    float d = length(uv);
    float a = smoothstep(0.5, 0.0, d) * vTw * 0.9;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uTint, a);
  }
`;

export default function Field() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Scale the work down on phones (fewer points, lower dpr, no MSAA) so the
    // field stays smooth on mobile GPUs.
    const isSmall = window.innerWidth < 768;
    const dpr = Math.min(window.devicePixelRatio || 1, isSmall ? 1.5 : 2);

    const renderer = new Renderer({
      canvas,
      alpha: true,
      dpr,
      antialias: !isSmall,
    });
    const gl = renderer.gl;
    gl.clearColor(0, 0, 0, 0);

    const camera = new Camera(gl, { fov: 50, near: 0.1, far: 200 });
    const baseY = 0.75;
    camera.position.set(0, baseY, 5.5);
    camera.lookAt([0, 0.15, -12]);

    const scene = new Transform();

    // --- dunes: point grid, wide in x, receding far in -z (all in front) ---
    const NX = isSmall ? 140 : 220;
    const NZ = isSmall ? 140 : 220;
    const dunes = new Float32Array(NX * NZ * 2);
    let k = 0;
    for (let j = 0; j < NZ; j++) {
      const z = 5 - (j / (NZ - 1)) * 35; // 5 (near) -> -30 (far)
      for (let i = 0; i < NX; i++) {
        const x = -9 + (i / (NX - 1)) * 18; // -9 -> 9
        dunes[k++] = x;
        dunes[k++] = z;
      }
    }
    const duneGeometry = new Geometry(gl, { aPos: { size: 2, data: dunes } });
    const duneProgram = new Program(gl, {
      vertex: duneVertex,
      fragment: duneFragment,
      uniforms: {
        uTime: { value: 0 },
        uScroll: { value: 0 },
        uDpr: { value: dpr },
        uSize: { value: 18 },
        uEnergy: { value: 0 },
        uTint: { value: [1, 1, 1] },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    duneProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE); // additive glow
    const duneMesh = new Mesh(gl, {
      geometry: duneGeometry,
      program: duneProgram,
      mode: gl.POINTS,
    });
    duneMesh.setParent(scene);

    // --- stars: scattered above the horizon, far back, gently twinkling ---
    const NSTARS = isSmall ? 520 : 900;
    const starPos = new Float32Array(NSTARS * 3);
    const starSeed = new Float32Array(NSTARS * 2);
    for (let i = 0; i < NSTARS; i++) {
      starPos[i * 3] = (Math.random() - 0.5) * 64; // x: -32 -> 32
      starPos[i * 3 + 1] = 2.5 + Math.random() * 13; // y: sky above the horizon
      starPos[i * 3 + 2] = -8 - Math.random() * 32; // z: far back
      starSeed[i * 2] = Math.random(); // phase
      starSeed[i * 2 + 1] = 1.4 + Math.random() * 2.4; // size
    }
    const starGeometry = new Geometry(gl, {
      aPos: { size: 3, data: starPos },
      aSeed: { size: 2, data: starSeed },
    });
    const starProgram = new Program(gl, {
      vertex: starVertex,
      fragment: starFragment,
      uniforms: {
        uTime: { value: 0 },
        uDpr: { value: dpr },
        uTint: { value: [1, 1, 1] },
      },
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    starProgram.setBlendFunc(gl.SRC_ALPHA, gl.ONE);
    const starMesh = new Mesh(gl, {
      geometry: starGeometry,
      program: starProgram,
      mode: gl.POINTS,
    });
    starMesh.setParent(scene);

    // --- cursor parallax (smoothed) ---
    let targetX = 0;
    let targetY = 0;
    let curX = 0;
    let curY = 0;
    let energy = 0;
    let targetEnergy = 0;
    let lastScrollY = window.scrollY;
    const onPointer = (e: PointerEvent) => {
      targetX = (e.clientX / window.innerWidth) * 2 - 1;
      targetY = (e.clientY / window.innerHeight) * 2 - 1;
    };

    const applyCamera = () => {
      camera.position.x = curX * 0.6;
      camera.position.y = baseY - curY * 0.25;
      camera.lookAt([0, 0.15, -12]);
    };

    const resize = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      renderer.setSize(w, h);
      camera.perspective({ aspect: w / h });
    };
    resize();
    window.addEventListener('resize', resize);

    const onScroll = () => {
      const y = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const sp = max > 0 ? y / max : 0;
      duneProgram.uniforms.uScroll.value = sp;
      // mood: the field drifts gently cooler as you descend the page
      const tint = [1 - sp * 0.3, 1 - sp * 0.18, 1];
      duneProgram.uniforms.uTint.value = tint;
      starProgram.uniforms.uTint.value = tint;
      // scroll velocity feeds the field's energy (brighter/taller dunes)
      targetEnergy = Math.min(Math.abs(y - lastScrollY) / 50, 1);
      lastScrollY = y;
    };
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('scroll', onScroll, { passive: true });

    let raf = 0;
    let running = true;
    const start = performance.now();

    const render = (now: number) => {
      const t = (now - start) / 1000;
      duneProgram.uniforms.uTime.value = t;
      starProgram.uniforms.uTime.value = t;
      curX += (targetX - curX) * 0.04;
      curY += (targetY - curY) * 0.04;
      energy += (targetEnergy - energy) * 0.08;
      targetEnergy *= 0.9;
      duneProgram.uniforms.uEnergy.value = energy;
      applyCamera();
      renderer.render({ scene, camera });
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
