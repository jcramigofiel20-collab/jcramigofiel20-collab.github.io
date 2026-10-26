/**
 * Después de construir: crea una página HTML por cada dirección (con su título y su vista previa para compartir),
 * la página 404, el mapa del sitio y robots.txt. Así cada dirección abre directo, aunque se actualice el navegador.
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { site } from '../src/config/site.ts'
import { allPaths, metaFor } from '../src/data/seo.ts'

const dist = join(dirname(fileURLToPath(import.meta.url)), '..', 'dist')
const template = readFileSync(join(dist, 'index.html'), 'utf8')

// GitHub Pages sirve cada dirección como carpeta y agrega la barra final: esa es la dirección definitiva.
const publicUrl = (path: string) => `${site.url}${path === '/' ? '/' : `${path}/`}`

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function render(path: string, extra = '') {
  const meta = metaFor(path)
  const url = publicUrl(path)
  const image = `${site.url}/${meta.image}`
  const block = [
    `<title>${esc(meta.title)}</title>`,
    `<meta name="description" content="${esc(meta.description)}" />`,
    `<link rel="canonical" href="${esc(url)}" />`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="${esc(site.brand)}" />`,
    `<meta property="og:locale" content="es_PE" />`,
    `<meta property="og:title" content="${esc(meta.title)}" />`,
    `<meta property="og:description" content="${esc(meta.description)}" />`,
    `<meta property="og:url" content="${esc(url)}" />`,
    `<meta property="og:image" content="${esc(image)}" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    extra,
  ]
    .filter(Boolean)
    .join('\n    ')
  const html = template.replace(/<!-- seo:start -->[\s\S]*?<!-- seo:end -->/, block)
  if (html === template) throw new Error('No se encontró el bloque <!-- seo:start --> en index.html')
  return html
}

const paths = allPaths()
for (const path of paths) {
  const file = path === '/' ? join(dist, 'index.html') : join(dist, path, 'index.html')
  mkdirSync(dirname(file), { recursive: true })
  writeFileSync(file, render(path))
}

writeFileSync(join(dist, '404.html'), render('/no-existe', '<meta name="robots" content="noindex" />'))

const today = new Date().toISOString().slice(0, 10)
writeFileSync(
  join(dist, 'sitemap.xml'),
  `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths
    .map((p) => `  <url><loc>${publicUrl(p)}</loc><lastmod>${today}</lastmod></url>`)
    .join('\n')}\n</urlset>\n`,
)
writeFileSync(join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)
// GitHub Pages: publicar los archivos tal cual (sin procesarlos con Jekyll).
writeFileSync(join(dist, '.nojekyll'), '')

console.log(`Páginas generadas: ${paths.length} + 404 · dirección pública: ${site.url}`)
