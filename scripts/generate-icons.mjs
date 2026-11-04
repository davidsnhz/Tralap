// Genera los PNG de la PWA a partir de la foto original del logo.
// Uso: npm run icons
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = (f) => path.join(root, "public", f);

// La foto trae la placa redondeada sobre fondo blanco con sombra: se recorta la placa.
const CROP = { left: 184, top: 197, width: 881, height: 881 };
const RADIUS = 0.255; // radio de las esquinas de la placa, en proporción al lado (cubre su curva sin dejar halo blanco)
const CREAM = "#F6F0E9"; // color de la placa

const plate = await sharp(path.join(root, "assets", "logo-original.webp"))
  .removeAlpha()
  .extract(CROP)
  .png()
  .toBuffer();

const size = CROP.width;
const r = Math.round(size * RADIUS);
const mask = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><rect width="${size}" height="${size}" rx="${r}" ry="${r}"/></svg>`,
);

// Esquinas transparentes: para donde el sistema no recorta el icono.
const rounded = await sharp(plate)
  .ensureAlpha()
  .composite([{ input: mask, blend: "dest-in" }])
  .png()
  .toBuffer();

// Sin transparencia y a sangre: para los sistemas que aplican su propia máscara.
const solid = await sharp({
  create: { width: size, height: size, channels: 3, background: CREAM },
})
  .composite([{ input: rounded }])
  .png()
  .toBuffer();

const jobs = [
  { src: rounded, size: 48, out: "favicon.png" },
  { src: rounded, size: 192, out: "pwa-192x192.png" },
  { src: rounded, size: 512, out: "pwa-512x512.png" },
  { src: solid, size: 180, out: "apple-touch-icon.png" },
  { src: solid, size: 512, out: "pwa-maskable-512x512.png" },
];

for (const { src, size: s, out } of jobs) {
  await sharp(src)
    .resize(s, s, { kernel: "lanczos3" })
    .png({ compressionLevel: 9, palette: s > 192, quality: 90 })
    .toFile(pub(out));
  console.log(`✓ public/${out}`);
}
