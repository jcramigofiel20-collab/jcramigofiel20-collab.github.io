import { Link } from 'react-router'
import { ArrowRight } from 'lucide-react'
import { Icon } from '../components/ui/Icon'
import { PageHeader, Reveal, StatusBadge } from '../components/ui/primitives'
import { allCategories, systemsInCategory } from '../lib/catalog'

export default function Categories() {
  return (
    <>
      <PageHeader
        eyebrow="Categorías"
        title="Sistemas por tipo de negocio"
        description="Elige tu rubro para ver los sistemas disponibles. Las categorías sin sistemas todavía se irán completando."
      />
      <div className="grid gap-5 md:grid-cols-2">
        {allCategories().map((c, i) => {
          const list = systemsInCategory(c.id)
          return (
            <Reveal key={c.id} delay={i * 0.04}>
              <section className={`glass flex h-full flex-col rounded-3xl p-6 transition duration-300 sm:p-7 ${list.length ? 'hover:border-white/15' : 'opacity-80'}`}>
                <div className="flex items-start gap-4">
                  <span className={`grid size-12 shrink-0 place-items-center rounded-2xl ${list.length ? 'bg-gradient-to-br from-blue-500 to-cyan-400 text-white' : 'bg-white/5 text-slate-500'}`}>
                    <Icon name={c.icon} className="size-6" />
                  </span>
                  <div>
                    <h2 className="font-display text-lg font-bold text-white">{c.name}</h2>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{c.description}</p>
                  </div>
                </div>
                <div className="mt-5 flex-1">
                  {list.length ? (
                    <ul className="space-y-2">
                      {list.map((s) => (
                        <li key={s.slug}>
                          <Link to={`/sistemas/${s.slug}`} className="group flex min-h-12 items-center justify-between gap-3 rounded-xl border border-white/8 bg-white/[0.03] px-4 py-2.5 transition hover:border-cyan-400/40">
                            <span className="text-sm font-semibold text-white">{s.name}</span>
                            <span className="flex items-center gap-3">
                              <StatusBadge status={s.status} />
                              <ArrowRight className="size-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-cyan-300" aria-hidden="true" />
                            </span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="rounded-xl border border-dashed border-white/10 px-4 py-3 text-sm text-slate-500">
                      Próximamente. Aún no hay sistemas publicados en esta categoría.
                    </p>
                  )}
                </div>
              </section>
            </Reveal>
          )
        })}
      </div>
    </>
  )
}
