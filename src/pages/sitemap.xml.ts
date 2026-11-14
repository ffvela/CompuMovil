// ─────────────────────────────────────────────────────────────────
// sitemap.xml.ts — Genera /sitemap.xml al hacer el build.
// El encargo pide un sitemap. Como el sitio tiene una sola página,
// lo escribimos a mano en vez de instalar una integración extra.
// ─────────────────────────────────────────────────────────────────
import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  // `site` viene de astro.config.mjs; sin él no hay URL absoluta.
  if (!site) throw new Error('Falta la opción `site` en astro.config.mjs');
  const url: string = new URL('/', site).href;
  const hoy: string = new Date().toISOString().slice(0, 10);

  const xml: string = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${url}</loc>
    <lastmod>${hoy}</lastmod>
  </url>
</urlset>`;

  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
