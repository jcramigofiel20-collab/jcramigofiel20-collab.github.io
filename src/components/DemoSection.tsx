import { CalendarCheck, Check, Download, KeyRound, PlayCircle } from 'lucide-react'
import type { SoftwareSystem } from '../data/types'
import { isDownloadable, latestAssetUrl } from '../lib/catalog'
import { asset } from '../lib/format'
import { ExternalButton } from './ui/primitives'

/** «Pruébalo gratis»: la demostración incluida, en tres pasos, más los días de prueba completa. */
export function DemoSection({ system }: { system: SoftwareSystem }) {
  const demo = system.demo!
  const installer = isDownloadable(system) && system.download ? latestAssetUrl(system, system.download.primary.fileName) : undefined

  return (
    <div className="relative overflow-hidden rounded-3xl border border-emerald-400/20 bg-gradient-to-br from-emerald-500/12 via-ink-850 to-cyan-600/10">
      <div className="grid-bg absolute inset-0 opacity-40" aria-hidden="true" />
      <div className="relative grid gap-8 p-6 sm:p-8 lg:grid-cols-[1.05fr_1fr] lg:gap-10 lg:p-10">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-xs font-bold tracking-wide text-emerald-300 uppercase">
            <PlayCircle className="size-4" aria-hidden="true" />
            Prueba de demostración gratis
          </span>
          <h2 className="mt-4 font-display text-2xl font-bold text-white sm:text-3xl">Pruébalo antes de comprar</h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-300 sm:text-base">
            {system.name} trae una <strong className="text-white">farmacia de demostración</strong> lista para usar. Explora
            todo el sistema sin pagar y sin cargar tus productos.
          </p>

          <ol className="mt-6 space-y-3">
            {demo.steps.map((s, i) => (
              <li key={s.title} className="flex gap-4">
                <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-emerald-400 font-display text-sm font-extrabold text-ink-950">{i + 1}</span>
                <span>
                  <span className="block text-sm font-semibold text-white">{s.title}</span>
                  <span className="block text-sm leading-relaxed text-slate-400">{s.text}</span>
                </span>
              </li>
            ))}
          </ol>

          <ul className="mt-6 space-y-2">
            {demo.points.map((p) => (
              <li key={p} className="flex gap-2.5 text-sm text-slate-300">
                <Check className="mt-0.5 size-4 shrink-0 text-emerald-300" aria-hidden="true" />
                {p}
              </li>
            ))}
          </ul>

          {installer && (
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <ExternalButton href={installer} download>
                <Download className="size-4" aria-hidden="true" />
                Descargar y probar gratis
              </ExternalButton>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4">
          {demo.image && (
            <figure className="overflow-hidden rounded-2xl border border-white/10 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
              <img src={asset(demo.image.src)} alt={`${demo.image.title}: ${demo.image.caption}`} width={1200} height={740} loading="lazy" className="block w-full" />
              <figcaption className="bg-ink-900 px-4 py-2.5 text-xs text-slate-400">{demo.image.caption}</figcaption>
            </figure>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="glass rounded-2xl p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <KeyRound className="size-4 text-cyan-300" aria-hidden="true" /> Acceso a la demostración
              </p>
              <p className="mt-2 text-sm text-white">
                Usuario <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">{demo.user}</code>
              </p>
              <p className="mt-1 text-sm text-white">
                Contraseña <code className="rounded bg-white/10 px-1.5 py-0.5 text-cyan-200">{demo.password}</code>
              </p>
              <p className="mt-2 text-xs text-slate-500">Entra sola con el botón; estos datos son por si los pide.</p>
            </div>
            <div className="glass rounded-2xl p-4">
              <p className="flex items-center gap-2 text-xs font-semibold text-slate-400">
                <CalendarCheck className="size-4 text-emerald-300" aria-hidden="true" /> Con tu propia farmacia
              </p>
              <p className="mt-2 font-display text-3xl font-extrabold text-white">{demo.trialDays} días</p>
              <p className="text-sm text-slate-300">de prueba completa, sin pagar nada.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
