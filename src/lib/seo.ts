import { useEffect } from 'react'
import { useLocation } from 'react-router'
import { site } from '../config/site.ts'
import { metaFor } from '../data/seo.ts'

function setMeta(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.content = content
}

/** Actualiza el título de la pestaña y las etiquetas para compartir al cambiar de pantalla. */
export function useSeo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const meta = metaFor(pathname)
    // Misma dirección definitiva que en la publicación (con barra final).
    const clean = pathname.replace(/\/+$/, '')
    const url = `${site.url}${clean ? `${clean}/` : '/'}`
    document.title = meta.title
    setMeta('name', 'description', meta.description)
    setMeta('property', 'og:title', meta.title)
    setMeta('property', 'og:description', meta.description)
    setMeta('property', 'og:url', url)
    setMeta('property', 'og:image', `${site.url}/${meta.image}`)
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]')
    if (!canonical) {
      canonical = document.createElement('link')
      canonical.rel = 'canonical'
      document.head.appendChild(canonical)
    }
    canonical.href = url
  }, [pathname])
}
