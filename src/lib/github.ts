import { useEffect, useState } from 'react'

/**
 * Lectura de versiones publicadas en GitHub Releases mediante la API pública (sin tokens).
 * GitHub permite unas 60 consultas por hora por visitante, así que la respuesta se guarda 30 minutos en el
 * navegador. Si GitHub no responde, la página usa los datos de respaldo del catálogo.
 */

export interface ReleaseAsset {
  name: string
  size: number
  downloadUrl: string
  downloads: number
  /** Huella SHA-256 que calcula GitHub (para comprobar el archivo descargado). */
  sha256?: string
}

export interface Release {
  tag: string
  name: string
  version: string
  publishedAt: string
  notes: string
  url: string
  prerelease: boolean
  assets: ReleaseAsset[]
}

type State =
  | { status: 'loading'; releases: Release[] }
  | { status: 'ready'; releases: Release[] }
  | { status: 'error'; releases: Release[]; message: string }

const TTL_MS = 30 * 60 * 1000
const memory = new Map<string, Promise<Release[]>>()

interface ApiRelease {
  tag_name: string
  name: string | null
  published_at: string | null
  body: string | null
  html_url: string
  draft: boolean
  prerelease: boolean
  assets: { name: string; size: number; browser_download_url: string; download_count: number; digest?: string | null }[]
}

function readCache(key: string): { at: number; data: Release[] } | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as { at: number; data: Release[] }) : null
  } catch {
    return null
  }
}

function writeCache(key: string, data: Release[]) {
  try {
    localStorage.setItem(key, JSON.stringify({ at: Date.now(), data }))
  } catch {
    /* almacenamiento no disponible: se consulta de nuevo la próxima vez */
  }
}

async function request(owner: string, repo: string): Promise<Release[]> {
  const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/releases?per_page=20`, {
    headers: { Accept: 'application/vnd.github+json' },
  })
  if (res.status === 403 || res.status === 429) throw new Error('GitHub limitó las consultas por un momento.')
  if (!res.ok) throw new Error(`GitHub respondió con el código ${res.status}.`)
  const data = (await res.json()) as ApiRelease[]
  return data
    .filter((r) => !r.draft)
    .map((r) => ({
      tag: r.tag_name,
      name: r.name || r.tag_name,
      version: r.tag_name.replace(/^v/i, ''),
      publishedAt: r.published_at ?? '',
      notes: r.body ?? '',
      url: r.html_url,
      prerelease: r.prerelease,
      assets: r.assets.map((a) => ({
        name: a.name,
        size: a.size,
        downloadUrl: a.browser_download_url,
        downloads: a.download_count,
        sha256: a.digest?.startsWith('sha256:') ? a.digest.slice(7) : undefined,
      })),
    }))
}

export function fetchReleases(owner: string, repo: string): Promise<Release[]> {
  const key = `gh-releases:${owner}/${repo}`
  const cached = readCache(key)
  if (cached && Date.now() - cached.at < TTL_MS) return Promise.resolve(cached.data)
  let pending = memory.get(key)
  if (!pending) {
    pending = request(owner, repo)
      .then((data) => {
        writeCache(key, data)
        return data
      })
      .catch((err: unknown) => {
        memory.delete(key)
        // Con un error, mejor mostrar datos algo antiguos que nada.
        if (cached) return cached.data
        throw err
      })
    memory.set(key, pending)
  }
  return pending
}

export function useReleases(github?: { owner: string; repo: string }): State {
  const [state, setState] = useState<State>({ status: github ? 'loading' : 'ready', releases: [] })
  useEffect(() => {
    if (!github) return
    let alive = true
    fetchReleases(github.owner, github.repo)
      .then((releases) => alive && setState({ status: 'ready', releases }))
      .catch((err: unknown) =>
        alive &&
        setState({ status: 'error', releases: [], message: err instanceof Error ? err.message : 'Sin conexión con GitHub.' }),
      )
    return () => {
      alive = false
    }
  }, [github?.owner, github?.repo])
  return state
}

export const latestStable = (releases: Release[]) => releases.find((r) => !r.prerelease)
