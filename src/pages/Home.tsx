import { Link } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import { ArrowRight, BookOpen, FolderKanban, Gauge, LifeBuoy, MousePointerClick, PlayCircle, RefreshCw, Wrench } from 'lucide-react'
import { HeroIllustration } from '../components/HeroIllustration'
import { SystemCard } from '../components/SystemCard'
import { Icon } from '../components/ui/Icon'
import { ButtonLink, Reveal, SectionTitle } from '../components/ui/primitives'
import { site } from '../config/site'
import { allCategories, featuredSystems, findSystem, systemsInCategory } from '../lib/catalog'

const advantages = [
  { icon: MousePointerClick, title: 'Interfaz intuitiva', text: 'Pantallas claras, atajos de teclado y menús pensados para el trabajo del día a día.' },
  { icon: Gauge, title: 'Herramientas que ahorran tiempo', text: 'Ventas, inventario, caja y reportes en un solo lugar, sin hojas de cálculo sueltas.' },
  { icon: FolderKanban, title: 'Información organizada', text: 'Todo queda registrado y ordenado, con permisos por usuario y copias de seguridad.' },
  { icon: RefreshCw, title: 'Actualizaciones y mejoras', text: 'Los sistemas avisan cuando hay una versión nueva y se actualizan sin perder datos.' },
  { icon: BookOpen, title: 'Documentación clara', text: 'Manual de usuario y guía de instalación paso a paso, con capturas reales.' },
  { icon: LifeBuoy, title: 'Soporte directo', text: `Atención por WhatsApp con ${site.owner}, quien desarrolla los sistemas.` },
]

export default function Home() {
  const reduce = useReducedMotion()
  const featured = featuredSystems()
  const farma = findSystem('farmacia')
  const up = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 18 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] as const },
  })

  return (
    <div className="space-y-20 lg:space-y-24">
      {/* Portada */}
      <section className="grid items-center gap-10 lg:grid-cols-[1.05fr_1fr] lg:gap-6">
        <div>
          <motion.p {...up(0)} className="mb-5 inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/8 px-3 py-1.5 text-xs font-semibold text-cyan-200">
            <span className="size-1.5 rounded-full bg-cyan-300" aria-hidden="true" />
            {site.brand} · Software para negocios
          </motion.p>
          <motion.h1 {...up(0.08)} className="font-display text-4xl leading-[1.08] font-extrabold tracking-tight text-white sm:text-5xl xl:text-6xl">
            El software que <span className="text-gradient">impulsa tu negocio.</span>
          </motion.h1>
          <motion.p {...up(0.16)} className="mt-5 max-w-xl text-base leading-relaxed text-slate-400 sm:text-lg">
            Descubre sistemas diseñados para optimizar procesos, organizar tu empresa y llevar tu negocio al siguiente nivel.
          </motion.p>
          <motion.div {...up(0.24)} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <ButtonLink to="/sistemas" className="sm:px-6">
              Explorar sistemas
              <ArrowRight className="size-4" aria-hidden="true" />
            </ButtonLink>
            <ButtonLink to="/nosotros" variant="secondary" className="sm:px-6">
              Conocer {site.brand}
            </ButtonLink>
          </motion.div>
        </div>
        <HeroIllustration />
      </section>

      {/* Categorías */}
      <section>
        <Reveal>
          <SectionTitle eyebrow="Categorías" title="Software para cada tipo de negocio" description="Cada sistema está pensado para un rubro. Empezamos por las farmacias y seguimos sumando." />
        </Reveal>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {allCategories().map((c, i) => {
            const count = systemsInCategory(c.id).length
            return (
              <Reveal key={c.id} delay={i * 0.04}>
                <Link
                  to={count ? `/sistemas?categoria=${c.id}` : '/categorias'}
                  className="group glass flex h-full flex-col gap-3 rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-white/15"
                >
                  <span className={`grid size-10 place-items-center rounded-xl transition ${count ? 'bg-blue-500/15 text-cyan-300 group-hover:bg-blue-500/25' : 'bg-white/5 text-slate-500'}`}>
                    <Icon name={c.icon} className="size-5" />
                  </span>
                  <span className="text-sm leading-snug font-semibold text-white">{c.name}</span>
                  <span className={`mt-auto text-xs ${count ? 'text-emerald-300' : 'text-slate-500'}`}>
                    {count ? `${count} disponible${count > 1 ? 's' : ''}` : 'Próximamente'}
                  </span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </section>

      {/* Destacados */}
      <section>
        <Reveal className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <SectionTitle eyebrow="Destacado" title="Sistemas listos para usar" description="Con instalador oficial, manuales y soporte." className="mb-0" />
          <Link to="/sistemas" className="inline-flex items-center gap-1.5 text-sm font-semibold text-cyan-300 hover:text-cyan-200">
            Ver el catálogo completo
            <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </Reveal>
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {featured.map((s, i) => (
            <Reveal key={s.slug} delay={i * 0.06}>
              <SystemCard system={s} />
            </Reveal>
          ))}
          <Reveal delay={0.08} className="md:col-span-1 xl:col-span-2">
            <div className="relative flex h-full flex-col justify-center overflow-hidden rounded-3xl border border-dashed border-white/12 p-7 sm:p-10">
              <div className="absolute -top-20 -right-20 size-64 rounded-full bg-violet-600/20 blur-3xl" aria-hidden="true" />
              <p className="text-xs font-semibold tracking-[0.18em] text-violet-300 uppercase">En camino</p>
              <h3 className="mt-2 font-display text-2xl font-bold text-white">Más sistemas se sumarán pronto</h3>
              <p className="mt-3 max-w-lg text-sm leading-relaxed text-slate-400">
                Estamos preparando nuevas soluciones para otros rubros. Cuando estén listas aparecerán aquí, con su
                instalador y su documentación. ¿Tienes un negocio con necesidades especiales? Conversemos.
              </p>
              <div className="mt-6">
                <ButtonLink to="/contacto" variant="secondary">
                  Escríbenos
                  <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Prueba gratis y planes */}
      {farma?.plans && (
        <Reveal>
          <section className="grid gap-5 lg:grid-cols-[1fr_1.2fr]">
            <Link to="/sistemas/farmacia#demostracion" className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-emerald-400/25 bg-gradient-to-br from-emerald-500/15 via-ink-850 to-ink-900 p-7 transition hover:-translate-y-1 hover:border-emerald-400/45 sm:p-8">
              <div className="absolute -top-16 -right-16 size-48 rounded-full bg-emerald-400/20 blur-3xl" aria-hidden="true" />
              <div className="relative">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-3 py-1 text-xs font-bold text-ink-950">
                  <PlayCircle className="size-4" aria-hidden="true" /> Prueba de demostración
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold text-white">Pruébalo gratis antes de comprar</h2>
                <p className="mt-2 text-sm leading-relaxed text-slate-300">
                  FARMA PRO incluye una farmacia de demostración con datos ficticios y {farma.demo?.trialDays} días de prueba completa con tu propia farmacia.
                </p>
                <ol className="mt-5 space-y-2.5">
                  {farma.demo?.steps.map((s, i) => (
                    <li key={s.title} className="flex items-center gap-3 text-sm text-slate-200">
                      <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-400/90 text-xs font-extrabold text-ink-950">{i + 1}</span>
                      {s.title}
                    </li>
                  ))}
                </ol>
              </div>
              <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-semibold text-emerald-300">
                Cómo probarlo <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" />
              </span>
            </Link>
            <div className="glass rounded-3xl p-7 sm:p-8">
              <p className="text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">Planes de FARMA PRO</p>
              <h2 className="mt-2 font-display text-2xl font-bold text-white">Paga como más te convenga</h2>
              <ul className="mt-5 grid gap-3 sm:grid-cols-3">
                {farma.plans.map((p) => (
                  <li key={p.id} className={`rounded-2xl border p-4 ${p.highlight ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-white/8 bg-white/[0.03]'}`}>
                    <p className="text-sm font-semibold text-slate-300">{p.name}</p>
                    <p className="mt-1 font-display text-2xl font-extrabold text-white">S/ {p.price.toLocaleString('es-PE', { minimumFractionDigits: Number.isInteger(p.price) ? 0 : 2 })}</p>
                    <p className="text-xs text-slate-400">{p.period}</p>
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-medium text-cyan-200">
                      <Wrench className="size-3.5" aria-hidden="true" /> {p.features.find((f) => /mantenimiento/i.test(f))?.split(',')[0]}
                    </p>
                  </li>
                ))}
              </ul>
              <p className="mt-4 flex items-center gap-2 text-sm text-slate-300">
                <RefreshCw className="size-4 text-cyan-300" aria-hidden="true" /> Todos los planes incluyen las actualizaciones del sistema.
              </p>
              <div className="mt-5">
                <ButtonLink to="/planes">
                  Ver planes y precios <ArrowRight className="size-4" aria-hidden="true" />
                </ButtonLink>
              </div>
            </div>
          </section>
        </Reveal>
      )}

      {/* Ventajas */}
      <section>
        <Reveal>
          <SectionTitle eyebrow="Por qué JoabSystems" title="Pensado para el trabajo real de tu negocio" />
        </Reveal>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {advantages.map((a, i) => (
            <Reveal key={a.title} delay={i * 0.05}>
              <div className="glass group h-full rounded-2xl p-6 transition duration-300 hover:border-white/15">
                <span className="grid size-11 place-items-center rounded-xl bg-gradient-to-br from-blue-500/25 to-violet-500/20 text-cyan-300 transition group-hover:scale-105">
                  <a.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-white">{a.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{a.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Llamado final */}
      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-700/40 via-ink-850 to-violet-800/30 p-8 sm:p-12">
          <div className="grid-bg absolute inset-0 opacity-60" aria-hidden="true" />
          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h2 className="font-display text-2xl font-bold text-white sm:text-3xl">¿Listo para organizar tu negocio?</h2>
              <p className="mt-2 text-slate-300">Descarga el sistema, pruébalo con la demostración incluida y escríbenos si necesitas ayuda para instalarlo.</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <ButtonLink to="/descargas">Ir a descargas</ButtonLink>
              <ButtonLink to="/contacto" variant="secondary">Hablar con soporte</ButtonLink>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  )
}
