import { useState } from 'react'
import { Check, ChevronDown, Download, ExternalLink, MessageCircle } from 'lucide-react'
import type { Edition, EditionAction, SoftwareSystem } from '../data/types'
import { latestAssetUrl } from '../lib/catalog'
import { whatsappUrl } from '../lib/format'
import { Icon } from './ui/Icon'
import { Reveal } from './ui/primitives'

const money = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })

const tone = {
  blue: { bar: 'from-blue-500 to-brand-600', icon: 'bg-blue-500/15 text-blue-300', btn: 'from-brand-600 to-blue-500', ring: 'hover:border-blue-400/40' },
  cyan: { bar: 'from-cyan-400 to-sky-500', icon: 'bg-cyan-400/15 text-cyan-300', btn: 'from-cyan-500 to-sky-500', ring: 'hover:border-cyan-400/40' },
  violet: { bar: 'from-violet-500 to-fuchsia-500', icon: 'bg-violet-500/15 text-violet-300', btn: 'from-violet-600 to-fuchsia-500', ring: 'hover:border-violet-400/40' },
}

function actionHref(system: SoftwareSystem, a: EditionAction): string {
  if (a.download && system.download) return latestAssetUrl(system, system.download.primary.fileName) ?? '#'
  if (a.whatsapp) return whatsappUrl(a.whatsapp)
  return a.href ?? '#'
}

function ActionLink({ system, action, primary, accent }: { system: SoftwareSystem; action: EditionAction; primary: boolean; accent: Edition['accent'] }) {
  const href = actionHref(system, action)
  const internal = href.startsWith('#')
  const ActionIcon = action.download ? Download : action.whatsapp ? MessageCircle : ExternalLink
  const onClick = internal
    ? (e: React.MouseEvent) => { e.preventDefault(); document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth', block: 'start' }) }
    : undefined
  return (
    <a
      href={href}
      onClick={onClick}
      {...(internal ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl px-4 text-sm font-semibold transition active:scale-[0.98] ${
        primary
          ? `bg-gradient-to-r ${tone[accent].btn} text-white shadow-[0_10px_30px_-12px_rgba(34,211,238,0.7)] hover:brightness-110`
          : 'border border-white/12 bg-white/5 text-white hover:bg-white/10'
      }`}
    >
      <ActionIcon className="size-4" aria-hidden="true" />
      {action.label}
    </a>
  )
}

/** «Elige cómo usarlo»: un panel por forma de tener el sistema, con precio, puntos clave y detalles desplegables. */
export function EditionsSection({ system }: { system: SoftwareSystem }) {
  const [open, setOpen] = useState<string | null>(null)
  const editions = system.editions ?? []
  return (
    <div className="grid items-stretch gap-5 lg:grid-cols-3">
      {editions.map((ed, i) => {
        const t = tone[ed.accent]
        const isOpen = open === ed.id
        return (
          <Reveal key={ed.id} delay={i * 0.08} className="h-full">
            <article className={`glass relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 ${t.ring} sm:p-7`}>
              <div className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${t.bar}`} aria-hidden="true" />
              {ed.badge && (
                <span className="absolute right-5 top-5 rounded-full bg-cyan-400 px-2.5 py-1 text-[11px] font-bold text-ink-950">{ed.badge}</span>
              )}
              <span className={`grid size-12 place-items-center rounded-2xl ${t.icon}`}>
                <Icon name={ed.icon} className="size-6" />
              </span>
              <h3 className="mt-4 font-display text-xl font-bold text-white">{ed.name}</h3>
              <p className="text-sm text-slate-400">{ed.tagline}</p>
              <p className="mt-5 flex items-end gap-2">
                {ed.price !== undefined ? (
                  <>
                    <span className="pb-1 text-base font-semibold text-slate-300">S/</span>
                    <span className="font-display text-4xl font-extrabold tracking-tight text-white">{money(ed.price)}</span>
                    <span className="pb-1.5 text-sm text-slate-400">{ed.period}</span>
                  </>
                ) : (
                  <span className="font-display text-3xl font-extrabold tracking-tight text-white">Consúltanos</span>
                )}
              </p>
              {ed.priceNote && <p className="mt-1 text-xs text-slate-400">{ed.priceNote}</p>}
              <ul className="mt-5 space-y-2.5">
                {ed.points.map((p) => (
                  <li key={p} className="flex gap-2.5 text-sm text-slate-300">
                    <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                    {p}
                  </li>
                ))}
              </ul>
              <div className="mt-auto space-y-2 pt-6">
                <ActionLink system={system} action={ed.primary} primary accent={ed.accent} />
                {ed.secondary && <ActionLink system={system} action={ed.secondary} primary={false} accent={ed.accent} />}
              </div>
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : ed.id)}
                aria-expanded={isOpen}
                className="mt-4 inline-flex min-h-10 items-center justify-between gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-4 text-sm font-semibold text-cyan-200 transition hover:bg-white/[0.06]"
              >
                Detalles y más información
                <ChevronDown className={`size-4 transition ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
              </button>
              {isOpen && (
                <div className="mt-3 space-y-2 text-sm leading-relaxed text-slate-400">
                  {ed.details.map((d) => <p key={d}>{d}</p>)}
                </div>
              )}
            </article>
          </Reveal>
        )
      })}
    </div>
  )
}
