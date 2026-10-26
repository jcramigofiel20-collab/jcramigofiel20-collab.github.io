import { Link } from 'react-router'
import { ExternalLink, WifiOff } from 'lucide-react'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Reveal, Spinner } from '../components/ui/primitives'
import type { SoftwareSystem } from '../data/types'
import { allSystems } from '../lib/catalog'
import { useReleases } from '../lib/github'
import { formatDate } from '../lib/format'
import { Markdown } from '../lib/markdown'

function SystemTimeline({ system }: { system: SoftwareSystem }) {
  const dl = system.download!
  const state = useReleases(dl.github)

  return (
    <section>
      <div className="mb-5 flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-blue-500/15 text-cyan-300">
          <Icon name={system.icon} className="size-5" />
        </span>
        <h2 className="font-display text-xl font-bold text-white">
          <Link to={`/sistemas/${system.slug}`} className="hover:text-cyan-200">{system.name}</Link>
        </h2>
      </div>

      {state.status === 'loading' && <Spinner label="Consultando las versiones publicadas…" />}

      {state.status === 'error' && (
        <div className="glass rounded-2xl p-5">
          <p className="flex items-start gap-2 text-sm text-slate-300">
            <WifiOff className="mt-0.5 size-4 shrink-0 text-slate-500" aria-hidden="true" />
            No se pudieron leer las notas desde GitHub en este momento ({state.message}).
          </p>
          <p className="mt-2 text-sm text-slate-400">
            Última versión conocida: <strong className="text-white">{dl.fallback.version}</strong>, publicada el {formatDate(dl.fallback.date)}.
          </p>
        </div>
      )}

      {state.status === 'ready' && (
        <ol className="relative space-y-6 border-l border-white/10 pl-6 sm:pl-8">
          {state.releases.map((r, i) => (
            <li key={r.tag} className="relative">
              <span className={`absolute top-6 -left-[31px] size-3 rounded-full border-2 sm:-left-[39px] ${i === 0 ? 'border-cyan-300 bg-cyan-400 shadow-[0_0_12px_3px_rgba(34,211,238,0.5)]' : 'border-slate-500 bg-ink-900'}`} aria-hidden="true" />
              <article className="glass rounded-2xl p-5 sm:p-6">
                <header className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <h3 className="font-display text-lg font-bold text-white">Versión {r.version}</h3>
                  {i === 0 && <span className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-2 py-0.5 text-xs font-semibold text-emerald-300">Más reciente</span>}
                  {r.prerelease && <span className="rounded-full border border-amber-400/30 bg-amber-400/10 px-2 py-0.5 text-xs font-semibold text-amber-300">Versión de prueba</span>}
                  <time dateTime={r.publishedAt} className="text-sm text-slate-500">{formatDate(r.publishedAt)}</time>
                </header>
                {r.notes ? <Markdown source={r.notes} /> : <p className="mt-3 text-sm text-slate-400">Sin notas para esta versión.</p>}
                <a href={r.url} target="_blank" rel="noopener noreferrer" className="mt-2 inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-300 hover:text-cyan-200">
                  Ver en GitHub
                  <ExternalLink className="size-3" aria-hidden="true" />
                </a>
              </article>
            </li>
          ))}
          {state.releases.length === 0 && <li className="text-sm text-slate-400">Todavía no hay versiones publicadas.</li>}
        </ol>
      )}
    </section>
  )
}

export default function Updates() {
  const published = allSystems().filter((s) => s.download)
  return (
    <>
      <PageHeader
        eyebrow="Actualizaciones"
        title="Novedades de cada versión"
        description="Las notas se leen directamente de las versiones publicadas en GitHub. Si ya tienes el sistema instalado, él mismo te avisa cuando hay una versión nueva y se actualiza con un clic."
      />
      <div className="space-y-14">
        {published.map((s) => (
          <Reveal key={s.slug}>
            <SystemTimeline system={s} />
          </Reveal>
        ))}
      </div>
    </>
  )
}
