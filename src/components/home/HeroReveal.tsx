"use client";

import { useEffect, useRef } from "react";
import { heroRevealShots } from "@/lib/data";
import { prefersReducedMotion } from "@/lib/gsap";

// Size of one simulation cell in CSS pixels. The water runs on this coarse grid and the shader
// smooths it out, which keeps the effect cheap.
const CELL = 8;
// How fast the revealed area closes up again (per frame at 60fps).
const DRY = 0.988;
// What counts as text in the hero; hovering it leaves the background alone.
const TEXT = "a, button, h1, p, .hello, .now";
// How long ripples keep moving (per step).
const DAMP = 0.97;

const VERT = `
attribute vec2 aPos;
varying vec2 vUv;
void main() {
  vUv = vec2(aPos.x * 0.5 + 0.5, 0.5 - aPos.y * 0.5);
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;

// The collage shows only where the trail is wet. The edge of the wet area wobbles like a
// puddle, ripples bend the screenshots gently, and a thin bright rim with a soft highlight
// makes it read as frosted glass rather than a hole cut in the page.
const FRAG = `
precision mediump float;
uniform sampler2D uImg;
uniform sampler2D uSim;
uniform vec3 uTint;
uniform float uDark;
uniform float uTime;
varying vec2 vUv;
void main() {
  vec4 s = texture2D(uSim, vUv);
  float wob = sin(vUv.x * 38.0 + uTime * 1.7) * sin(vUv.y * 31.0 - uTime * 1.3) * 0.05;
  float m = smoothstep(0.12, 0.6, s.g + wob);
  if (m < 0.002) { gl_FragColor = vec4(0.0); return; }
  vec2 n = (s.ba - 0.5) * 2.0;
  float rim = smoothstep(0.0, 0.45, m) * (1.0 - smoothstep(0.45, 0.95, m));
  vec2 off = n * (0.008 + rim * 0.03);
  vec4 cg = texture2D(uImg, vUv + off);
  float r = texture2D(uImg, vUv + off * 1.08).r;
  float b = texture2D(uImg, vUv + off * 0.92).b;
  vec3 img = mix(vec3(r, cg.g, b), uTint, 0.2 + uDark * 0.18);
  vec3 col = mix(uTint, img, cg.a);
  vec3 nrm = normalize(vec3(-n * 5.0, 1.0));
  float spec = pow(max(dot(nrm, normalize(vec3(-0.45, -0.5, 0.75))), 0.0), 30.0);
  col += vec3(spec * 0.22 + rim * (0.1 + uDark * 0.06));
  float alpha = m * mix(0.38, 0.86, cg.a);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

type TCollage = { canvas: HTMLCanvasElement; ready: boolean };

// A small seeded random so the collage keeps the same layout between visits.
function seeded(seed: number) {
  let t = seed;
  return () => {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

// Lays the screenshots out as a loose grid of slightly tilted cards covering the hero.
function drawCollage(
  canvas: HTMLCanvasElement,
  images: HTMLImageElement[],
  w: number,
  h: number,
  dpr: number,
) {
  canvas.width = Math.round(w * dpr);
  canvas.height = Math.round(h * dpr);
  const ctx = canvas.getContext("2d");
  if (!ctx || images.length === 0) return;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, w, h);
  const rand = seeded(7);
  const cols = Math.max(2, Math.round(w / 380));
  const rows = Math.max(2, Math.round(h / 300));
  const cw = w / cols;
  const ch = h / rows;
  let k = 0;
  for (let r = 0; r < rows; r++) {
    const shift = r % 2 ? cw * 0.5 : 0;
    for (let c = -1; c < cols; c++) {
      const img = images[k++ % images.length];
      const cardW = cw * 0.86;
      const cardH = Math.min(ch * 0.82, cardW * 0.625);
      const x = c * cw + shift + cw / 2 + (rand() - 0.5) * cw * 0.1;
      const y = r * ch + ch / 2 + (rand() - 0.5) * ch * 0.1;
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(((rand() - 0.5) * 6 * Math.PI) / 180);
      ctx.beginPath();
      ctx.roundRect(-cardW / 2, -cardH / 2, cardW, cardH, 14);
      ctx.save();
      ctx.clip();
      const scale = Math.max(cardW / img.width, cardH / img.height);
      const iw = img.width * scale;
      ctx.drawImage(img, -iw / 2, -cardH / 2, iw, img.height * scale);
      ctx.restore();
      ctx.lineWidth = 1;
      ctx.strokeStyle = "rgba(255,255,255,.35)";
      ctx.stroke();
      ctx.restore();
    }
  }
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type);
  if (!sh) return null;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  return gl.getShaderParameter(sh, gl.COMPILE_STATUS) ? sh : null;
}

function texture(gl: WebGLRenderingContext) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

// Hover the hero and a watery trail opens in the starfield, showing project screenshots
// underneath through rippling glass, then slowly closes again. Mouse and trackpad only; it is
// skipped on touch screens, under reduced motion and when WebGL is missing.
export default function HeroReveal() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    const hero = cv?.parentElement;
    if (!cv || !hero || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches)
      return;
    const gl = cv.getContext("webgl", {
      premultipliedAlpha: true,
      antialias: false,
    });
    if (!gl) return;

    const vs = compile(gl, gl.VERTEX_SHADER, VERT);
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    const prog = gl.createProgram();
    if (!vs || !fs || !prog) return;
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return;
    gl.useProgram(prog);

    const quad = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quad);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]),
      gl.STATIC_DRAW,
    );
    const aPos = gl.getAttribLocation(prog, "aPos");
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    const imgTex = texture(gl);
    gl.activeTexture(gl.TEXTURE1);
    const simTex = texture(gl);
    gl.uniform1i(gl.getUniformLocation(prog, "uImg"), 0);
    gl.uniform1i(gl.getUniformLocation(prog, "uSim"), 1);
    const uTint = gl.getUniformLocation(prog, "uTint");
    const uDark = gl.getUniformLocation(prog, "uDark");
    const uTime = gl.getUniformLocation(prog, "uTime");
    gl.clearColor(0, 0, 0, 0);

    const collage: TCollage = {
      canvas: document.createElement("canvas"),
      ready: false,
    };
    let images: HTMLImageElement[] = [];
    let w = 0;
    let h = 0;
    let gw = 0;
    let gh = 0;
    let sx = CELL;
    let sy = CELL;
    let cur = new Float32Array(0);
    let prev = new Float32Array(0);
    let wet = new Float32Array(0);
    let pixels = new Uint8Array(0);
    let frame = 0;
    let running = false;
    let visible = true;
    let last = 0;
    let lastPt: { x: number; y: number } | null = null;

    const readTheme = () => {
      const css = getComputedStyle(document.documentElement);
      const probe = document.createElement("canvas").getContext("2d");
      if (!probe) return;
      probe.fillStyle = css.getPropertyValue("--paper").trim() || "#fff";
      const hex = probe.fillStyle;
      const v = parseInt(hex.slice(1), 16);
      const rgb = [(v >> 16) & 255, (v >> 8) & 255, v & 255];
      gl.uniform3f(uTint, rgb[0] / 255, rgb[1] / 255, rgb[2] / 255);
      const lum = (rgb[0] * 0.3 + rgb[1] * 0.59 + rgb[2] * 0.11) / 255;
      gl.uniform1f(uDark, lum < 0.5 ? 1 : 0);
    };

    const uploadCollage = () => {
      if (!images.length || !w) return;
      drawCollage(
        collage.canvas,
        images,
        w,
        h,
        Math.min(1.5, devicePixelRatio),
      );
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, imgTex);
      gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        collage.canvas,
      );
      collage.ready = true;
    };

    const size = () => {
      w = hero.clientWidth;
      h = hero.clientHeight;
      const dpr = Math.min(1.5, devicePixelRatio);
      cv.width = Math.round(w * dpr);
      cv.height = Math.round(h * dpr);
      gl.viewport(0, 0, cv.width, cv.height);
      gw = Math.max(3, Math.ceil(w / CELL));
      gh = Math.max(3, Math.ceil(h / CELL));
      sx = w / gw;
      sy = h / gh;
      cur = new Float32Array(gw * gh);
      prev = new Float32Array(gw * gh);
      wet = new Float32Array(gw * gh);
      pixels = new Uint8Array(gw * gh * 4);
      uploadCollage();
    };

    // Each stamp makes the spot wet (so it shows the collage) and drops a little water in.
    const stamp = (x: number, y: number, strength: number) => {
      const radius = Math.min(16, Math.max(9, w / 100));
      const cx = x / sx - 0.5;
      const cy = y / sy - 0.5;
      const r0 = Math.ceil(radius);
      for (let j = -r0; j <= r0; j++) {
        for (let i = -r0; i <= r0; i++) {
          const gx = Math.round(cx) + i;
          const gy = Math.round(cy) + j;
          if (gx < 1 || gy < 1 || gx >= gw - 1 || gy >= gh - 1) continue;
          const d = Math.hypot(gx - cx, gy - cy) / radius;
          if (d > 1) continue;
          const f = (1 - d * d) * (1 - d * d);
          const idx = gy * gw + gx;
          wet[idx] = Math.min(1, Math.max(wet[idx], f) + f * 0.04);
          prev[idx] -= f * strength;
        }
      }
    };

    const step = (dt: number) => {
      const dry = DRY ** (dt * 60);
      let energy = 0;
      for (let y = 1; y < gh - 1; y++) {
        for (let x = 1; x < gw - 1; x++) {
          const i = y * gw + x;
          const v =
            ((cur[i - 1] + cur[i + 1] + cur[i - gw] + cur[i + gw]) / 2 -
              prev[i]) *
            DAMP;
          prev[i] = v;
          wet[i] *= dry;
          energy = Math.max(energy, wet[i], Math.abs(v));
        }
      }
      const t = cur;
      cur = prev;
      prev = t;
      // Pack wetness and the water's slope into a texture for the shader.
      for (let y = 0; y < gh; y++) {
        for (let x = 0; x < gw; x++) {
          const i = y * gw + x;
          const l = cur[x > 0 ? i - 1 : i];
          const r = cur[x < gw - 1 ? i + 1 : i];
          const u = cur[y > 0 ? i - gw : i];
          const d = cur[y < gh - 1 ? i + gw : i];
          const o = i * 4;
          pixels[o] = 0;
          pixels[o + 1] = Math.min(255, wet[i] * 255);
          pixels[o + 2] = Math.max(0, Math.min(255, 128 + (r - l) * 140));
          pixels[o + 3] = Math.max(0, Math.min(255, 128 + (d - u) * 140));
        }
      }
      return energy;
    };

    const render = (now: number) => {
      const dt = Math.min(0.05, last ? (now - last) / 1000 : 1 / 60);
      last = now;
      const energy = step(dt);
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, simTex);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gw,
        gh,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        pixels,
      );
      gl.uniform1f(uTime, now / 1000);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (collage.ready) gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
      // Rest when the water is calm and dry, so an idle hero costs nothing.
      if (energy < 0.01 || !visible) {
        running = false;
        last = 0;
        gl.clear(gl.COLOR_BUFFER_BIT);
        return;
      }
      frame = requestAnimationFrame(render);
    };

    const wake = () => {
      if (running || !visible) return;
      running = true;
      frame = requestAnimationFrame(render);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse" && e.pointerType !== "pen") return;
      // Only the empty background reacts, so text and buttons stay easy to read.
      if ((e.target as Element | null)?.closest(TEXT)) {
        lastPt = null;
        return;
      }
      const rect = hero.getBoundingClientRect();
      const pt = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      // Fill in the gap since the last event so fast moves leave an unbroken trail.
      const from = lastPt ?? pt;
      const dist = Math.hypot(pt.x - from.x, pt.y - from.y);
      const steps = Math.max(1, Math.ceil(dist / (sx * 2)));
      // Faster moves stir the water more.
      const push = Math.min(0.4, dist * 0.003) / steps;
      for (let s = 1; s <= steps; s++) {
        const t = s / steps;
        stamp(from.x + (pt.x - from.x) * t, from.y + (pt.y - from.y) * t, push);
      }
      lastPt = pt;
      wake();
    };
    const onLeave = () => {
      lastPt = null;
    };

    readTheme();
    size();
    let cancelled = false;
    Promise.all(
      heroRevealShots.map(
        (src) =>
          new Promise<HTMLImageElement | null>((resolve) => {
            const img = new Image();
            img.decoding = "async";
            img.onload = () => resolve(img);
            img.onerror = () => resolve(null);
            img.src = src;
          }),
      ),
    ).then((list) => {
      if (cancelled) return;
      images = list.filter((img): img is HTMLImageElement => img !== null);
      uploadCollage();
    });

    const ro = new ResizeObserver(size);
    ro.observe(hero);
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
    });
    io.observe(hero);
    const themeWatch = new MutationObserver(readTheme);
    themeWatch.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    hero.addEventListener("pointermove", onMove, { passive: true });
    hero.addEventListener("pointerleave", onLeave);

    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      ro.disconnect();
      io.disconnect();
      themeWatch.disconnect();
      hero.removeEventListener("pointermove", onMove);
      hero.removeEventListener("pointerleave", onLeave);
      gl.getExtension("WEBGL_lose_context")?.loseContext();
    };
  }, []);

  return <canvas ref={ref} className="hero-reveal" aria-hidden="true" />;
}
