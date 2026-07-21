// Genera los PNG de la PWA a partir de los SVG de public/.
// Uso: npm run icons
import sharp from "sharp";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = (f) => path.join(root, "public", f);

const icon = await readFile(pub("favicon.svg"));
const maskable = await readFile(pub("icon-maskable.svg"));

const jobs = [
  { src: icon, size: 192, out: "pwa-192x192.png" },
  { src: icon, size: 512, out: "pwa-512x512.png" },
  { src: icon, size: 180, out: "apple-touch-icon.png" },
  { src: maskable, size: 512, out: "pwa-maskable-512x512.png" },
];

for (const { src, size, out } of jobs) {
  await sharp(src, { density: 300 }).resize(size, size).png().toFile(pub(out));
  console.log(`✓ public/${out}`);
}
