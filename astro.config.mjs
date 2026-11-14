// @ts-check
// ─────────────────────────────────────────────────────────────────
// astro.config.mjs — Configuración general del sitio.
//
// Decisiones:
//  1. `site`: Astro lo usa para armar URLs absolutas (canonical,
//     Open Graph y sitemap). DEBE cambiarse por la URL real apenas
//     el sitio esté publicado en Netlify.
//  2. `inlineStylesheets: 'always'`: nuestro CSS pesa pocos KB, así
//     que lo incrustamos en el HTML. Así el navegador no hace una
//     petición extra que bloquee el dibujo de la página (mejora el
//     puntaje de Rendimiento en Lighthouse).
//  3. No usamos integraciones extra (ni Tailwind ni frameworks): el
//     sitio solo depende de Astro, lo que hace más fácil mantenerlo.
// ─────────────────────────────────────────────────────────────────

// defineConfig no cambia nada al ejecutarse; solo le da tipos al
// editor para avisar si escribimos una opción que no existe.
import { defineConfig } from 'astro/config';

export default defineConfig({
  // URL pública del sitio (reemplazar después del primer despliegue).
  site: 'https://informatica-utem.netlify.app',

  build: {
    // Incrusta el CSS dentro del HTML (ver decisión 2).
    inlineStylesheets: 'always'
  }
});
