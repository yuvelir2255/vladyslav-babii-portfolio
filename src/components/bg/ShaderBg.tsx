'use client';

import { useEffect, useRef } from 'react';
import { Renderer, Triangle, Program, Mesh } from 'ogl';

const vertex = /* glsl */ `
  attribute vec2 uv;
  attribute vec2 position;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 0.0, 1.0);
  }
`;

const fragment = /* glsl */ `
  precision highp float;
  uniform float uTime;
  uniform vec2 uRes;
  uniform vec2 uMouse;
  varying vec2 vUv;

  float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float noise(vec2 p) {
    vec2 i = floor(p), f = fract(p);
    float a = hash(i), b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0)), d = hash(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }
  float fbm(vec2 p) {
    float v = 0.0, a = 0.5;
    for (int i = 0; i < 5; i++) { v += a * noise(p); p *= 2.0; a *= 0.5; }
    return v;
  }

  void main() {
    vec2 uv = vUv;
    vec2 p = uv * vec2(uRes.x / uRes.y, 1.0);
    float c = fbm(p * 3.0 + uTime * 0.02);
    vec3 base = mix(vec3(0.063, 0.059, 0.051), vec3(0.16, 0.15, 0.13), c);

    // тёплый прожектор у курсора
    float d = distance(uv, uMouse);
    base += vec3(1.0, 0.35, 0.12) * smoothstep(0.5, 0.0, d) * 0.22;

    // лёгкие сканлайны
    base += sin(uv.y * uRes.y * 1.2 + uTime * 2.0) * 0.012;

    gl_FragColor = vec4(base, 1.0);
  }
`;

export function ShaderBg() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    // на тач-устройствах не грузим WebGL — остаётся статичный бетон (перф)
    if (window.matchMedia('(pointer: coarse)').matches) return;

    let renderer: Renderer;
    try {
      renderer = new Renderer({
        alpha: false,
        dpr: Math.min(2, window.devicePixelRatio || 1),
      });
    } catch {
      return; // нет WebGL — фолбэк на статичный фон
    }

    const gl = renderer.gl;
    host.appendChild(gl.canvas);

    const program = new Program(gl, {
      vertex,
      fragment,
      uniforms: {
        uTime: { value: 0 },
        uRes: { value: [1, 1] },
        uMouse: { value: [0.5, 0.5] },
      },
    });
    const mesh = new Mesh(gl, { geometry: new Triangle(gl), program });

    const resize = () => {
      renderer.setSize(host.clientWidth, host.clientHeight);
      program.uniforms.uRes.value = [gl.canvas.width, gl.canvas.height];
    };
    const onMouse = (e: MouseEvent) => {
      program.uniforms.uMouse.value = [
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight,
      ];
    };
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouse);
    resize();

    let raf = 0;
    const loop = (t: number) => {
      program.uniforms.uTime.value = t * 0.001;
      renderer.render({ scene: mesh });
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouse);
      gl.canvas.remove();
    };
  }, []);

  return <div ref={ref} aria-hidden="true" className="absolute inset-0" />;
}
