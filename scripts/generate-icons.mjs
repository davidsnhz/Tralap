// Genera los PNG de la PWA a partir del logo plano: la etiqueta de maleta
// dibujada en un solo color sobre el negro del fondo de la app.
// Uso: npm run icons
import sharp from "sharp";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const pub = (f) => path.join(root, "public", f);

// Los dos colores del tema oscuro (src/theme/colors.ts): si cambian allí, cámbialos aquí.
const BG = "#151515"; // THEMES.dark.white
const TAG = "#E9DFD2"; // THEMES.dark.walnut

const SIZE = 512;
const RADIUS = 0.255; // radio de las esquinas, en proporción al lado

// La etiqueta: placa ancha abajo (sale por el borde), correa vertical y hebilla.
// Los trazos en BG separan las piezas que se solapan.
const tag = `
  <rect x="92" y="318" width="328" height="260" rx="46" fill="${TAG}"/>
  <rect x="216" y="96" width="80" height="318" rx="30" fill="${TAG}" stroke="${BG}" stroke-width="12"/>
  <rect x="200" y="214" width="112" height="84" rx="18" fill="${TAG}" stroke="${BG}" stroke-width="12"/>
  <rect x="226" y="242" width="60" height="28" rx="9" fill="${BG}"/>
`;

const svg = (corner) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${SIZE}" height="${SIZE}" viewBox="0 0 ${SIZE} ${SIZE}">
      <clipPath id="c"><rect width="${SIZE}" height="${SIZE}" rx="${corner}"/></clipPath>
      <g clip-path="url(#c)"><rect width="${SIZE}" height="${SIZE}" fill="${BG}"/>${tag}</g>
    </svg>`,
  );

// Esquinas transparentes: para donde el sistema no recorta el icono.
const rounded = svg(Math.round(SIZE * RADIUS));
// A sangre: para los sistemas que aplican su propia máscara.
const solid = svg(0);

const jobs = [
  { src: rounded, size: 48, out: "favicon.png" },
  { src: rounded, size: 192, out: "pwa-192x192.png" },
  { src: rounded, size: 512, out: "pwa-512x512.png" },
  { src: solid, size: 180, out: "apple-touch-icon.png" },
  { src: solid, size: 512, out: "pwa-maskable-512x512.png" },
];

for (const { src, size, out } of jobs) {
  let image = sharp(src, { density: 72 * 4 }).resize(size, size, { kernel: "lanczos3" });
  if (src === solid) image = image.flatten({ background: BG });
  await image.png({ compressionLevel: 9 }).toFile(pub(out));
  console.log(`✓ public/${out}`);
}
