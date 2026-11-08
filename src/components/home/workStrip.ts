// Draws the project screenshots as a calm row of browser windows on one wide canvas. The hero
// lays it under the liquid, which repeats it sideways and lets it show through the water.

const HEIGHT = 1000;
const FRAME_H = 360;
const FRAME_W = FRAME_H * 1.6;
const GAP = 100;
const BAR = 30;
const RADIUS = 18;
// Every other window sits a little higher, so the row has a gentle rhythm instead of a ruler line.
const OFFSET = 34;

const load = (src: string) =>
  new Promise<HTMLImageElement | null>((resolve) => {
    const img = new Image();
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = src;
  });

export async function buildWorkStrip(srcs: string[]) {
  const images = (await Promise.all(srcs.map(load))).filter(
    (img): img is HTMLImageElement => img !== null,
  );
  if (!images.length) return null;

  const period = FRAME_W + GAP;
  const canvas = document.createElement("canvas");
  canvas.width = Math.round(period * images.length);
  canvas.height = HEIGHT;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  images.forEach((img, i) => {
    const x = GAP / 2 + i * period;
    const y = (HEIGHT - FRAME_H) / 2 + (i % 2 ? OFFSET : -OFFSET);

    // Window with a soft shadow.
    ctx.save();
    ctx.shadowColor = "rgba(8, 12, 30, .35)";
    ctx.shadowBlur = 48;
    ctx.shadowOffsetY = 18;
    ctx.beginPath();
    ctx.roundRect(x, y, FRAME_W, FRAME_H, RADIUS);
    ctx.fillStyle = "#f4f5f8";
    ctx.fill();
    ctx.restore();

    // Screenshot below the title bar, cropped to fill.
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(x, y, FRAME_W, FRAME_H, RADIUS);
    ctx.clip();
    const areaH = FRAME_H - BAR;
    const scale = Math.max(FRAME_W / img.width, areaH / img.height);
    ctx.drawImage(
      img,
      x + (FRAME_W - img.width * scale) / 2,
      y + BAR,
      img.width * scale,
      img.height * scale,
    );
    ctx.restore();

    // Title bar dots and a hairline edge.
    ["#ff6159", "#ffbd2e", "#28c941"].forEach((color, d) => {
      ctx.beginPath();
      ctx.arc(x + 20 + d * 16, y + BAR / 2, 5, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();
    });
    ctx.beginPath();
    ctx.roundRect(x + 0.5, y + 0.5, FRAME_W - 1, FRAME_H - 1, RADIUS);
    ctx.strokeStyle = "rgba(255, 255, 255, .5)";
    ctx.lineWidth = 1;
    ctx.stroke();
  });

  return canvas;
}
