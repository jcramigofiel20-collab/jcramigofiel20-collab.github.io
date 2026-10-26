import { Link } from 'react-router'
import { ArrowRight, Check } from 'lucide-react'
import type { SoftwareSystem } from '../data/types'
import { findCategory } from '../lib/catalog'
import { asset } from '../lib/format'
import { Icon } from './ui/Icon'
import { StatusBadge } from './ui/primitives'

export const accentRing: Record<SoftwareSystem['accent'], string> = {
  blue: 'from-blue-500 to-cyan-400',
  cyan: 'from-cyan-500 to-teal-400',
  violet: 'from-violet-500 to-fuchsia-400',
  emerald: 'from-emerald-500 to-teal-400',
  amber: 'from-amber-500 to-orange-400',
}

/** Tarjeta del catálogo: imagen, estado, versión, funciones clave y «Ver detalles». */
export function SystemCard({ system }: { system: SoftwareSystem }) {
  const category = findCategory(system.category)
  const version = system.download?.fallback.version
  return (
    <article className="group glass relative flex h-full flex-col overflow-hidden rounded-3xl transition duration-300 hover:-translate-y-1 hover:border-white/15 hover:shadow-[0_30px_60px_-30px_rgba(37,99,235,0.55)]">
      <div className="relative aspect-[16/9] overflow-hidden border-b border-white/6 bg-ink-850">
        {system.heroImage ? (
          <img
            src={asset(system.heroImage.thumb)}
            alt={`${system.name}: ${system.heroImage.title}`}
            loading="lazy"
            decoding="async"
            width={720}
            height={405}
            className="size-full object-cover object-left-top transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className="grid size-full place-items-center">
            <Icon name={system.icon} className="size-14 text-slate-600" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 rounded-full bg-ink-950/85 backdrop-blur">
          <StatusBadge status={system.status} />
        </div>
        {!system.screenshotsAreReal && system.heroImage && (
          <span className="absolute right-3 bottom-3 rounded-md bg-black/60 px-2 py-0.5 text-[10px] font-medium text-slate-300">Imagen ilustrativa</span>
        )}
      </div>

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <span className={`grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br ${accentRing[system.accent]} text-white shadow-lg`}>
            <Icon name={system.icon} className="size-5" />
          </span>
          <div className="min-w-0">
            <h3 className="font-display text-lg font-bold text-white">{system.name}</h3>
            <p className="text-xs text-slate-400">
              {category?.name}
              {version && <> · v{version}</>}
            </p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-slate-400">{system.summary}</p>
        <ul className="mt-4 space-y-2">
          {system.highlights.map((h) => (
            <li key={h} className="flex items-start gap-2 text-sm text-slate-300">
              <Check className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true" />
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-auto pt-6">
          <Link
            to={`/sistemas/${system.slug}`}
            className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 text-sm font-semibold text-white transition group-hover:border-cyan-400/40 group-hover:bg-gradient-to-r group-hover:from-brand-600 group-hover:to-cyan-500"
          >
            Ver detalles
            <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden="true" />
            <span className="absolute inset-0" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}
