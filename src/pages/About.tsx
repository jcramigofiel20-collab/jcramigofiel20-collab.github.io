import { ArrowRight, Compass, Handshake, HardDrive, Headset, RefreshCw, ShieldCheck, Target, Wrench } from 'lucide-react'
import { LogoMark } from '../components/ui/Logo'
import { ButtonLink, PageHeader, Reveal, SectionTitle } from '../components/ui/primitives'
import { site } from '../config/site'

const steps = [
  { icon: Compass, title: 'Entendemos tu negocio', text: 'Cada sistema nace del trabajo real de un rubro: cómo se vende, qué se controla y qué reportes hacen falta.' },
  { icon: Wrench, title: 'Desarrollamos y probamos', text: 'Programas de escritorio para Windows, probados con datos de demostración antes de cada versión.' },
  { icon: Handshake, title: 'Instalamos contigo', text: 'Guía paso a paso y, si lo prefieres, instalación en persona o por acceso remoto.' },
  { icon: Headset, title: 'Te acompañamos', text: 'Soporte por WhatsApp y actualizaciones que se instalan con un clic.' },
]

const principles = [
  { icon: HardDrive, title: 'Tus datos, en tu negocio', text: 'La información se guarda en tus propias computadoras. Para trabajar no dependes de internet.' },
  { icon: ShieldCheck, title: 'Seguridad desde el diseño', text: 'Usuarios por persona, permisos por rol, registros de auditoría y copias de seguridad.' },
  { icon: RefreshCw, title: 'Mejora continua', text: 'Cada versión nueva llega firmada digitalmente para que el programa compruebe que es la original.' },
]

export default function About() {
  return (
    <div className="space-y-16">
      <PageHeader
        eyebrow="Nosotros"
        title={<>Somos <span className="text-gradient">{site.brand}</span></>}
        description={`${site.brand} es la marca de ${site.owner}, desarrollador de sistemas de gestión para negocios en el ${site.country}. Creamos herramientas para que los negocios trabajen de forma más organizada, segura y eficiente.`}
      />

      <Reveal>
        <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-blue-700/30 via-ink-850 to-violet-800/25 p-7 sm:p-10">
          <div className="grid-bg absolute inset-0 opacity-50" aria-hidden="true" />
          <div className="relative grid gap-8 md:grid-cols-[auto_1fr] md:items-center">
            <LogoMark className="size-24 drop-shadow-[0_16px_40px_rgba(59,130,246,0.55)] sm:size-28" />
            <div>
              <p className="flex items-center gap-2 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">
                <Target className="size-4" aria-hidden="true" /> Nuestro propósito
              </p>
              <p className="mt-3 font-display text-xl leading-snug font-semibold text-white sm:text-2xl">
                Llevar software moderno y accesible a los negocios, para que dediquen menos tiempo al papeleo y más a
                sus clientes.
              </p>
              <p className="mt-3 text-sm text-slate-300">{site.slogan}.</p>
            </div>
          </div>
        </section>
      </Reveal>

      <section>
        <Reveal>
          <SectionTitle eyebrow="Cómo trabajamos" title="De la idea a tu mostrador" />
        </Reveal>
        <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06}>
              <li className="glass relative h-full list-none rounded-2xl p-6">
                <span className="absolute top-5 right-5 font-display text-3xl font-extrabold text-white/8">0{i + 1}</span>
                <span className="grid size-11 place-items-center rounded-xl bg-blue-500/15 text-cyan-300">
                  <s.icon className="size-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 font-display text-base font-bold text-white">{s.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section>
        <Reveal>
          <SectionTitle eyebrow="Principios" title="Lo que cuidamos en cada sistema" />
        </Reveal>
        <div className="grid gap-4 md:grid-cols-3">
          {principles.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.06}>
              <div className="glass h-full rounded-2xl p-6">
                <p.icon className="size-6 text-cyan-300" aria-hidden="true" />
                <h3 className="mt-4 font-display text-base font-bold text-white">{p.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-slate-400">{p.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Reveal>
        <section className="glass flex flex-col gap-5 rounded-3xl p-7 sm:flex-row sm:items-center sm:justify-between sm:p-9">
          <div>
            <h2 className="font-display text-xl font-bold text-white">¿Conversamos sobre tu negocio?</h2>
            <p className="mt-1 text-sm text-slate-400">Escríbenos por WhatsApp al {site.contact.phoneDisplay}.</p>
          </div>
          <ButtonLink to="/contacto">
            Ir a contacto
            <ArrowRight className="size-4" aria-hidden="true" />
          </ButtonLink>
        </section>
      </Reveal>
    </div>
  )
}
