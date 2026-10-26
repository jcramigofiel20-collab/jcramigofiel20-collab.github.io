import { categories } from '../data/categories.ts'
import { systems } from '../data/systems.ts'
import type { CategoryId, SoftwareSystem, SystemStatus } from '../data/types.ts'

/** Punto único de acceso a los datos del catálogo (un futuro panel administrativo solo cambiaría este archivo). */

export const allSystems = (): SoftwareSystem[] => systems

export const findSystem = (slug: string | undefined) => systems.find((s) => s.slug === slug)

export const allCategories = () => categories

export const findCategory = (id: CategoryId) => categories.find((c) => c.id === id)

export const systemsInCategory = (id: CategoryId) => systems.filter((s) => s.category === id)

export const featuredSystems = () => systems.filter((s) => s.featured)

export const statusLabel: Record<SystemStatus, string> = {
  disponible: 'Disponible',
  'en-desarrollo': 'En desarrollo',
  proximamente: 'Próximamente',
}

/** Quita tildes y mayúsculas para que «farmacia» encuentre «Farmacia» y «gestion» encuentre «gestión». */
export const normalize = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim()

export function searchSystems(query: string, list: SoftwareSystem[] = systems) {
  const words = normalize(query).split(/\s+/).filter(Boolean)
  if (words.length === 0) return list
  return list.filter((s) => {
    const haystack = normalize(
      [
        s.name,
        s.fullName,
        s.summary,
        s.tagline,
        findCategory(s.category)?.name ?? '',
        ...s.businessTypes,
        ...s.modules,
        ...s.features.map((f) => f.title),
      ].join(' '),
    )
    return words.every((w) => haystack.includes(w))
  })
}

export const isDownloadable = (s: SoftwareSystem) => s.status === 'disponible' && !!s.download

/** Enlace directo a un archivo de la última versión publicada en GitHub Releases. */
export const latestAssetUrl = (s: SoftwareSystem, fileName: string) =>
  s.download
    ? `https://github.com/${s.download.github.owner}/${s.download.github.repo}/releases/latest/download/${fileName}`
    : undefined

export const releasesUrl = (s: SoftwareSystem) =>
  s.download ? `https://github.com/${s.download.github.owner}/${s.download.github.repo}/releases` : undefined

export const docHref = (s: SoftwareSystem, doc: { fileName?: string; href?: string }) =>
  doc.href ?? (doc.fileName ? latestAssetUrl(s, doc.fileName) : undefined)
