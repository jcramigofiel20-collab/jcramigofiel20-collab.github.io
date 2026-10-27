import { site } from '../config/site.ts'
import { allSystems, findSystem } from '../lib/catalog.ts'

/**
 * Título, descripción e imagen de cada pantalla. Se usan dentro de la aplicación y también al publicar, para que
 * cada dirección tenga su propia vista previa al compartirla en WhatsApp, Facebook, etc.
 */

export interface PageMeta {
  title: string
  description: string
  /** Imagen para compartir, relativa a /public. */
  image: string
  /** Nombre de la sección en la barra superior. */
  section: string
}

const DEFAULT_IMAGE = 'img/og-joabsystems.png'

const pages: Record<string, PageMeta> = {
  '/': {
    title: `${site.brand} — El software que impulsa tu negocio`,
    description:
      'Sistemas diseñados para organizar tu negocio: conoce FARMA PRO, el sistema de gestión para farmacias, y descárgalo desde su enlace oficial.',
    image: DEFAULT_IMAGE,
    section: 'Inicio',
  },
  '/sistemas': {
    title: `Catálogo de sistemas — ${site.brand}`,
    description: 'Explora los sistemas de JoabSystems por tipo de negocio, estado y disponibilidad.',
    image: DEFAULT_IMAGE,
    section: 'Catálogo de sistemas',
  },
  '/categorias': {
    title: `Categorías — ${site.brand}`,
    description: 'Sistemas organizados por tipo de negocio: farmacias, restaurantes, tiendas, ferreterías y empresas.',
    image: DEFAULT_IMAGE,
    section: 'Categorías',
  },
  '/planes': {
    title: `Planes y precios — ${site.brand}`,
    description: 'FARMA PRO: plan mensual S/ 39.90, anual S/ 460 o un solo pago S/ 1,200. Con actualizaciones y demostración gratis.',
    image: 'img/og-farma-pro.png',
    section: 'Planes y precios',
  },
  '/descargas': {
    title: `Centro de descargas — ${site.brand}`,
    description: 'Descarga los instaladores oficiales, manuales y versiones anteriores de los sistemas de JoabSystems.',
    image: DEFAULT_IMAGE,
    section: 'Descargas',
  },
  '/actualizaciones': {
    title: `Actualizaciones — ${site.brand}`,
    description: 'Novedades y notas de cada versión publicada de los sistemas de JoabSystems.',
    image: DEFAULT_IMAGE,
    section: 'Actualizaciones',
  },
  '/nosotros': {
    title: `Nosotros — ${site.brand}`,
    description: `${site.brand}: sistemas de gestión para negocios, desarrollados por ${site.owner}.`,
    image: DEFAULT_IMAGE,
    section: 'Nosotros',
  },
  '/contacto': {
    title: `Contacto y soporte — ${site.brand}`,
    description: `Consultas, instalación, licencias y soporte por WhatsApp: ${site.contact.phoneDisplay}.`,
    image: DEFAULT_IMAGE,
    section: 'Contacto y soporte',
  },
}

const NOT_FOUND: PageMeta = {
  title: `Página no encontrada — ${site.brand}`,
  description: 'La dirección no existe. Vuelve al inicio o explora el catálogo de sistemas.',
  image: DEFAULT_IMAGE,
  section: 'Página no encontrada',
}

export function metaFor(pathname: string): PageMeta {
  const path = pathname.replace(/\/+$/, '') || '/'
  if (pages[path]) return pages[path]
  const match = /^\/sistemas\/([^/]+)$/.exec(path)
  const system = match ? findSystem(match[1]) : undefined
  if (system) {
    return {
      title: `${system.name} — ${system.fullName.split('—')[1]?.trim() ?? system.tagline} | ${site.brand}`,
      description: system.tagline,
      image: system.slug === 'farmacia' ? 'img/og-farma-pro.png' : DEFAULT_IMAGE,
      section: system.name,
    }
  }
  return NOT_FOUND
}

/** Todas las direcciones que existen (para generar sus páginas y el mapa del sitio). */
export const allPaths = () => [...Object.keys(pages), ...allSystems().map((s) => `/sistemas/${s.slug}`)]
