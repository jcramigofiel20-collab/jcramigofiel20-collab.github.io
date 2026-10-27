import { Link } from 'react-router'
import { ArrowRight, PlayCircle } from 'lucide-react'
import { PricingPlans } from '../components/PricingPlans'
import { accentRing } from '../components/SystemCard'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Reveal } from '../components/ui/primitives'
import { allSystems } from '../lib/catalog'

export default function Plans() {
  const withPlans = allSystems().filter((s) => s.plans?.length)
  return (
    <>
      <PageHeader
        eyebrow="Planes y precios"
        title="Elige cómo pagar tu sistema"
        description="Pago mensual, anual o un solo pago. Todos incluyen el sistema completo y sus actualizaciones. Antes de decidir, pruébalo gratis con la demostración."
      />
      <div className="space-y-14">
        {withPlans.map((s) => (
          <section key={s.slug}>
            <Reveal className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <span className={`grid size-11 place-items-center rounded-xl bg-gradient-to-br ${accentRing[s.accent]} text-white`}>
                  <Icon name={s.icon} className="size-5" />
                </span>
                <div>
                  <h2 className="font-display text-xl font-bold text-white">{s.name}</h2>
                  <p className="text-sm text-slate-400">{s.fullName.split('—')[1]?.trim()}</p>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {s.demo && (
                  <Link to={`/sistemas/${s.slug}#demostracion`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-emerald-400/30 bg-emerald-400/10 px-4 text-sm font-semibold text-emerald-200 hover:bg-emerald-400/15">
                    <PlayCircle className="size-4" aria-hidden="true" /> Prueba gratis
                  </Link>
                )}
                <Link to={`/sistemas/${s.slug}`} className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-200 hover:bg-white/5">
                  Ver el sistema <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </div>
            </Reveal>
            <PricingPlans system={s} />
          </section>
        ))}
      </div>
    </>
  )
}
