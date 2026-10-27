import { useState } from 'react'
import { Link } from 'react-router'
import { Archive, Check, Copy, Download, ExternalLink, FileText, MessageCircle, PlayCircle, ShieldCheck, TriangleAlert, WifiOff } from 'lucide-react'
import { accentRing } from '../components/SystemCard'
import { Icon } from '../components/ui/Icon'
import { ExternalButton, PageHeader, Pill, Reveal, Spinner, StatusBadge } from '../components/ui/primitives'
import type { DownloadFile, SoftwareSystem } from '../data/types'
import { allSystems, isDownloadable, latestAssetUrl, releasesUrl } from '../lib/catalog'
import { latestStable, useReleases, type ReleaseAsset } from '../lib/github'
import { formatDate, formatSize, whatsappUrl } from '../lib/format'

const kindIcon = { installer: Download, zip: Archive, pdf: FileText, text: FileText }

function CopyHash({ value }: { value: string }) {
  const [done, setDone] = useState(false)
  return (
    <button
      type="button"
      onClick={() => {
        navigator.clipboard?.writeText(value).then(() => {
          setDone(true)
          setTimeout(() => setDone(false), 1800)
        }, () => undefined)
      }}
      className="inline-flex min-h-8 items-center gap-1.5 rounded-lg border border-white/10 px-2.5 text-xs text-slate-300 hover:bg-white/8"
    >
      {done ? <Check className="size-3.5 text-emerald-300" aria-hidden="true" /> : <Copy className="size-3.5" aria-hidden="true" />}
      {done ? 'Copiado' : 'Copiar'}
    </button>
  )
}

function FileRow({ system, file, asset }: { system: SoftwareSystem; file: DownloadFile; asset?: ReleaseAsset }) {
  const KindIcon = kindIcon[file.kind]
  const href = asset?.downloadUrl ?? latestAssetUrl(system, file.fileName)!
  return (
    <li className="flex flex-col gap-3 py-3.5 sm:flex-row sm:items-center">
      <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-white/5 text-slate-300">
        <KindIcon className="size-5" aria-hidden="true" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-white">{file.label}</span>
        <span className="block text-xs text-slate-400">
          {file.description}
          {asset ? ` · ${formatSize(asset.size)}` : ''}
        </span>
      </span>
      <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-10 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-cyan-400/40 hover:bg-white/5">
        {file.kind === 'installer' || file.kind === 'zip' ? 'Descargar' : 'Abrir'}
        <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />
      </a>
    </li>
  )
}

function DownloadPanel({ system }: { system: SoftwareSystem }) {
  const dl = system.download!
  const state = useReleases(dl.github)
  const latest = latestStable(state.releases)
  const installer = latest?.assets.find((a) => a.name === dl.primary.fileName)
  const previous = state.releases.filter((r) => r !== latest)
  const version = latest?.version ?? dl.fallback.version
  const date = latest?.publishedAt ?? dl.fallback.date

  return (
    <article className="glass overflow-hidden rounded-3xl">
      <div className="relative border-b border-white/6 bg-gradient-to-r from-blue-600/15 via-transparent to-violet-600/10 p-6 sm:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accentRing[system.accent]} text-white shadow-lg`}>
              <Icon name={system.icon} className="size-7" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="font-display text-2xl font-bold text-white">{system.name}</h2>
                <StatusBadge status={system.status} />
              </div>
              <p className="mt-1 text-sm text-slate-400">{system.fullName.split('—')[1]?.trim()}</p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Pill>Versión {version}</Pill>
                {date && <Pill>Publicada el {formatDate(date)}</Pill>}
                {(installer?.size ?? dl.fallback.sizeBytes) && <Pill>{formatSize(installer?.size ?? dl.fallback.sizeBytes)}</Pill>}
                <Pill>Windows 10/11 · 64 bits</Pill>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col">
            <ExternalButton href={installer?.downloadUrl ?? latestAssetUrl(system, dl.primary.fileName)!} download className="px-6">
              <Download className="size-4" aria-hidden="true" />
              Descargar instalador
            </ExternalButton>
            <Link to={`/sistemas/${system.slug}`} className="inline-flex min-h-11 items-center justify-center rounded-xl border border-white/10 px-5 text-sm font-semibold text-slate-200 hover:bg-white/5">
              Ver ficha del sistema
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.3fr_1fr]">
        <div>
          <h3 className="text-sm font-semibold text-white">Archivos de esta versión</h3>
          <ul className="mt-2 divide-y divide-white/6">
            <FileRow system={system} file={dl.primary} asset={installer} />
            {dl.extras.map((f) => (
              <FileRow key={f.fileName} system={system} file={f} asset={latest?.assets.find((a) => a.name === f.fileName)} />
            ))}
          </ul>

          {installer?.sha256 && (
            <div className="mt-5 rounded-2xl border border-white/8 bg-ink-950/40 p-4">
              <p className="flex items-center gap-2 text-sm font-semibold text-white">
                <ShieldCheck className="size-4 text-emerald-300" aria-hidden="true" />
                Huella del instalador (SHA-256)
              </p>
              <p className="mt-1 text-xs text-slate-400">Sirve para comprobar que el archivo descargado es el original.</p>
              <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
                <code className="min-w-0 flex-1 rounded-lg bg-white/5 px-3 py-2 font-mono text-[11px] break-all text-cyan-200">{installer.sha256}</code>
                <CopyHash value={installer.sha256} />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-5">
          <div className="rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-5">
            <p className="flex items-center gap-2 text-sm font-semibold text-amber-200"><TriangleAlert className="size-4" aria-hidden="true" /> Antes de instalar</p>
            <ul className="mt-2 list-disc space-y-1.5 pl-5 text-sm text-amber-100/80">
              {dl.warnings.map((w) => <li key={w}>{w}</li>)}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white">Notas y versiones anteriores</h3>
            {state.status === 'loading' && <div className="mt-3"><Spinner label="Consultando GitHub…" /></div>}
            {state.status === 'error' && (
              <p className="mt-3 flex items-start gap-2 text-sm text-slate-400">
                <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
                No se pudo consultar el historial ahora ({state.message}). La descarga sigue funcionando.
              </p>
            )}
            {state.status === 'ready' && (
              <ul className="mt-3 space-y-2 text-sm">
                {latest && (
                  <li>
                    <a href={latest.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 font-semibold text-cyan-300 hover:text-cyan-200">
                      Notas de la versión {latest.version}
                      <ExternalLink className="size-3.5" aria-hidden="true" />
                    </a>
                  </li>
                )}
                {previous.length === 0 ? (
                  <li className="text-slate-400">Esta es la primera versión publicada; aún no hay versiones anteriores.</li>
                ) : (
                  previous.map((r) => (
                    <li key={r.tag} className="flex items-center justify-between gap-3 text-slate-300">
                      <span>
                        Versión {r.version}
                        {r.prerelease && <span className="ml-2 text-xs text-amber-300">(prueba)</span>}
                        <span className="ml-2 text-xs text-slate-500">{formatDate(r.publishedAt)}</span>
                      </span>
                      <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-cyan-300 hover:text-cyan-200">Ver</a>
                    </li>
                  ))
                )}
                <li>
                  <a href={releasesUrl(system)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-200">
                    Todas las versiones en GitHub
                    <ExternalLink className="size-3" aria-hidden="true" />
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </article>
  )
}

export default function Downloads() {
  const ready = allSystems().filter(isDownloadable)
  const upcoming = allSystems().filter((s) => !isDownloadable(s))

  return (
    <>
      <PageHeader
        eyebrow="Descargas"
        title="Centro de descargas"
        description="Instaladores oficiales, manuales y versiones anteriores, publicados en GitHub Releases. Descarga los sistemas solo desde esta página."
      />
      <div className="space-y-8">
        <Reveal>
          <div className="flex flex-col gap-4 rounded-2xl border border-emerald-400/25 bg-emerald-400/[0.07] p-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="flex items-start gap-3 text-sm text-emerald-50">
              <PlayCircle className="mt-0.5 size-5 shrink-0 text-emerald-300" aria-hidden="true" />
              <span><strong>Descarga gratis.</strong> El sistema trae una demostración con datos ficticios y 15 días de prueba completa. Pagas solo si decides usarlo.</span>
            </p>
            <Link to="/planes" className="inline-flex min-h-10 shrink-0 items-center justify-center gap-2 rounded-xl border border-white/15 px-4 text-sm font-semibold text-white hover:bg-white/8">
              Ver planes y precios
            </Link>
          </div>
        </Reveal>
        {ready.map((s, i) => (
          <Reveal key={s.slug} delay={i * 0.05}>
            <DownloadPanel system={s} />
          </Reveal>
        ))}
        {upcoming.length > 0 && (
          <Reveal>
            <h2 className="mb-4 font-display text-lg font-bold text-white">Aún sin descarga</h2>
            <ul className="grid gap-4 md:grid-cols-2">
              {upcoming.map((s) => (
                <li key={s.slug} className="glass flex items-center gap-4 rounded-2xl p-5">
                  <Icon name={s.icon} className="size-6 text-slate-400" />
                  <span className="flex-1">
                    <span className="block font-semibold text-white">{s.name}</span>
                    <StatusBadge status={s.status} />
                  </span>
                  <ExternalButton href={whatsappUrl(s.whatsappMessage)} variant="secondary">
                    <MessageCircle className="size-4" aria-hidden="true" /> Solicitar información
                  </ExternalButton>
                </li>
              ))}
            </ul>
          </Reveal>
        )}
        <p className="text-center text-sm text-slate-500">
          ¿Problemas para descargar o instalar? <Link to="/contacto" className="font-semibold text-cyan-300 hover:text-cyan-200">Escríbenos</Link> y te ayudamos.
        </p>
      </div>
    </>
  )
}
