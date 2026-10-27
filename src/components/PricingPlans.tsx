import { Check, Info, MessageCircle, RefreshCw, Wrench } from 'lucide-react'
import type { SoftwareSystem } from '../data/types'
import { whatsappUrl } from '../lib/format'
import { Reveal } from './ui/primitives'

const money = (n: number) =>
  n.toLocaleString('es-PE', { minimumFractionDigits: Number.isInteger(n) ? 0 : 2, maximumFractionDigits: 2 })

/** Los planes de un sistema en tarjetas: precio, qué incluye y botón para pedirlo por WhatsApp. */
export function PricingPlans({ system }: { system: SoftwareSystem }) {
  const plans = system.plans ?? []
  return (
    <div>
      <div className="grid items-stretch gap-5 md:grid-cols-3">
        {plans.map((p, i) => (
          <Reveal key={p.id} delay={i * 0.07} className="h-full">
            <article
              className={`group relative flex h-full flex-col overflow-hidden rounded-3xl p-6 transition duration-300 hover:-translate-y-1 sm:p-7 ${
                p.highlight
                  ? 'border border-cyan-400/40 bg-gradient-to-b from-blue-600/30 via-ink-850 to-ink-900 shadow-[0_30px_70px_-30px_rgba(34,211,238,0.6)]'
                  : 'glass hover:border-white/15'
              }`}
            >
              {p.highlight && <div className="absolute -top-24 left-1/2 size-48 -translate-x-1/2 rounded-full bg-cyan-400/25 blur-3xl" aria-hidden="true" />}
              <div className="relative flex items-center justify-between gap-3">
                <h3 className="font-display text-lg font-bold text-white">{p.name}</h3>
                {p.badge && (
                  <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${p.highlight ? 'bg-cyan-400 text-ink-950' : 'border border-violet-400/30 bg-violet-400/10 text-violet-200'}`}>
                    {p.badge}
                  </span>
                )}
              </div>
              <p className="relative mt-1 text-sm text-slate-400">{p.description}</p>
              <p className="relative mt-6 flex items-end gap-2">
                <span className="pb-1.5 text-lg font-semibold text-slate-300">S/</span>
                <span className="font-display text-5xl font-extrabold tracking-tight text-white">{money(p.price)}</span>
                <span className="pb-2 text-sm text-slate-400">{p.period}</span>
              </p>
              <ul className="relative mt-6 space-y-2.5">
                {p.features.map((f) => {
                  const FeatureIcon = /mantenimiento/i.test(f) ? Wrench : /actualizaci/i.test(f) ? RefreshCw : Check
                  const strong = /mantenimiento|actualizaci/i.test(f)
                  return (
                    <li key={f} className="flex gap-2.5 text-sm">
                      <FeatureIcon className={`mt-0.5 size-4 shrink-0 ${strong ? 'text-cyan-300' : 'text-emerald-300'}`} aria-hidden="true" />
                      <span className={strong ? 'font-semibold text-white' : 'text-slate-300'}>{f}</span>
                    </li>
                  )
                })}
              </ul>
              <div className="relative mt-auto pt-7">
                <a
                  href={whatsappUrl(`Hola Joab, quiero ${system.name} con el plan ${p.name} (S/ ${money(p.price)} ${p.period}).`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition active:scale-[0.98] ${
                    p.highlight
                      ? 'bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.8)] hover:brightness-110'
                      : 'border border-white/12 bg-white/5 text-white hover:border-cyan-400/40 hover:bg-white/8'
                  }`}
                >
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Elegir plan {p.name.toLowerCase()}
                </a>
              </div>
            </article>
          </Reveal>
        ))}
      </div>
      {system.plansNotes && (
        <ul className="mt-6 space-y-1.5">
          {system.plansNotes.map((n) => (
            <li key={n} className="flex gap-2 text-xs leading-relaxed text-slate-400 sm:text-sm">
              <Info className="mt-0.5 size-3.5 shrink-0 text-slate-500 sm:size-4" aria-hidden="true" />
              {n}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
