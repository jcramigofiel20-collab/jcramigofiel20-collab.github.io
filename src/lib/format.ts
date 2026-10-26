import { site } from '../config/site.ts'

export function formatDate(iso: string | undefined) {
  if (!iso) return ''
  // Las fechas solo con día (AAAA-MM-DD) se leen como hora local para que no cambien de día.
  const date = /^\d{4}-\d{2}-\d{2}$/.test(iso) ? new Date(`${iso}T12:00:00`) : new Date(iso)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric' })
}

export function formatSize(bytes: number | undefined) {
  if (!bytes) return ''
  const mb = bytes / (1024 * 1024)
  return mb >= 1 ? `${mb.toFixed(mb >= 100 ? 0 : 1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`
}

export const whatsappUrl = (message: string) =>
  `https://wa.me/${site.contact.phoneDigits}?text=${encodeURIComponent(message)}`

export const phoneUrl = () => `tel:+${site.contact.phoneDigits}`

/** Ruta pública de un archivo de /public respetando la carpeta base de publicación. */
export const asset = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, '')}`
