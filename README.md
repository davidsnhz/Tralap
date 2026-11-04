# Tralap 🧳

**Haz la maleta sin olvidar nada.**

Tralap es una aplicación web progresiva (PWA) para preparar el equipaje de tus viajes. Genera listas inteligentes según el tipo de viaje, la duración y las actividades que vayas a hacer, y te acompaña también a la vuelta para que no te dejes nada en el alojamiento.

## Características

- **Mis viajes** — tarjetas con progreso de preparación; desliza a la izquierda para renombrar (edición inline) o eliminar con animación de colapso.
- **Mi plantilla** — tus imprescindibles personales, persistentes entre sesiones, que puedes incluir en cualquier viaje nuevo con un toque.
- **Creación inteligente** — al crear un viaje (destino, tipo, actividades, días) Tralap genera:
  - *Outfits* con cantidades calculadas según los días (`calcBasics`).
  - *Esenciales*: base + sugerencias del tipo de viaje ✨ + ítems de las actividades elegidas + tu plantilla 🔖, sin duplicados y con el icono distintivo de cada origen.
- **Detalle de viaje** — cabecera con anillo de progreso, pestañas Outfits/Esenciales, toque para marcar y deslizar para eliminar, añade tus propios ítems.
- **Modo vuelta** — checklist de repaso del alojamiento con su propio progreso en verde.
- **PWA instalable** — funciona sin conexión y se puede instalar en el móvil como una app nativa.
- **Sin backend** — todos los datos se guardan en `localStorage` (con versión de esquema).
- Respeta `prefers-reduced-motion`.

## Stack

- [Vite](https://vitejs.dev/) + [React 18](https://react.dev/) + TypeScript (modo estricto)
- [Tailwind CSS](https://tailwindcss.com/) con la paleta del proyecto como tokens
- [vite-plugin-pwa](https://vite-pwa-org.netlify.app/) (service worker + manifest)
- [lucide-react](https://lucide.dev/) para los iconos

## Requisitos

- Node.js 18 o superior (recomendado LTS)
- npm

## Instalación

```bash
npm install
```

## Desarrollo

```bash
npm run dev
```

Abre la URL que muestra Vite (por defecto `http://localhost:5173`). En escritorio la app se centra con un ancho máximo de 430 px; en móvil ocupa toda la pantalla.

## Build de producción

```bash
npm run build
```

El resultado queda en `dist/`. Para probarlo en local (necesario para verificar el service worker y el modo offline):

```bash
npm run preview
```

## Regenerar iconos PWA

Los PNG de `public/` se generan a partir de la foto original del logo, `assets/logo-original.webp`:

```bash
npm run icons
```

## Estructura del proyecto

```
src/
  components/   Componentes de UI (Home, TripView, NewTripSheet, …)
  data/         Datos de inteligencia (tipos de viaje, sugerencias, actividades…)
  hooks/        useLocalStorage (persistencia versionada), useRoute (pantalla en la URL) y useSwipeX (gestos)
  theme/        Paleta de colores (misma fuente que tailwind.config.ts)
  types/        Tipos TypeScript del dominio
  utils/        Utilidades de texto (plurales, comparación de nombres)
```

## Instalar como app en el móvil

1. Sirve la build (`npm run preview`) o despliégala en cualquier hosting estático.
2. Abre la URL en el navegador del móvil.
3. Usa «Añadir a pantalla de inicio» (Android/Chrome muestra un aviso de instalación automáticamente).
