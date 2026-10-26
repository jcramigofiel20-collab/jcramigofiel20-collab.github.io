import { useState, type ReactNode } from 'react'
import { Link, useParams } from 'react-router'
import { motion, useReducedMotion } from 'motion/react'
import {
  ArrowLeft, BookOpen, Calendar, CircleHelp, Code, Cpu, Database, Download, ExternalLink, FileText, HardDrive,
  Hash, Images, ListChecks, MessageCircle, Monitor, Phone, TriangleAlert, ZoomIn,
} from 'lucide-react'
import { Lightbox } from '../components/Lightbox'
import { accentRing } from '../components/SystemCard'
import { Icon } from '../components/ui/Icon'
import { ExternalButton, Pill, Reveal, SectionTitle, StatusBadge } from '../components/ui/primitives'
import { site } from '../config/site'
import type { SoftwareSystem } from '../data/types'
import { docHref, findCategory, findSystem, isDownloadable, latestAssetUrl, releasesUrl } from '../lib/catalog'
import { latestStable, useReleases } from '../lib/github'
import { asset, formatDate, formatSize, phoneUrl, whatsappUrl } from '../lib/format'
import NotFound from './NotFound'

const sections = [
  { id: 'descripcion', label: 'Descripción' },
  { id: 'funciones', label: 'Funciones' },
  { id: 'capturas', label: 'Capturas' },
  { id: 'modulos', label: 'Módulos' },
  { id: 'requisitos', label: 'Requisitos' },
  { id: 'instalacion', label: 'Instalación' },
  { id: 'documentacion', label: 'Documentación' },
  { id: 'preguntas', label: 'Preguntas' },
  { id: 'soporte', label: 'Soporte' },
]

const scrollTo = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault()
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

/** Versión, fecha y tamaño: primero de GitHub; si no responde, los datos del catálogo. */
function useReleaseInfo(system: SoftwareSystem) {
  const state = useReleases(system.download?.github)
  const latest = latestStable(state.releases)
  const fallback = system.download?.fallback
  const installer = latest?.assets.find((a) => a.name === system.download?.primary.fileName)
  return {
    loading: state.status === 'loading',
    version: latest?.version ?? fallback?.version,
    date: latest?.publishedAt ?? fallback?.date,
    size: installer?.size ?? fallback?.sizeBytes,
    notesUrl: latest?.url,
  }
}

function Section({ id, children }: { id: string; children: ReactNode }) {
  return (
    <section id={id} className="scroll-mt-24">
      <Reveal>{children}</Reveal>
    </section>
  )
}

export default function SystemDetail() {
  const { slug } = useParams()
  const system = findSystem(slug)
  const reduce = useReducedMotion()
  const [shot, setShot] = useState<number | null>(null)
  if (!system) return <NotFound />

  return <Detail system={system} reduce={!!reduce} shot={shot} setShot={setShot} />
}

function Detail({ system, reduce, shot, setShot }: { system: SoftwareSystem; reduce: boolean; shot: number | null; setShot: (i: number | null) => void }) {
  const info = useReleaseInfo(system)
  const category = findCategory(system.category)
  const downloadable = isDownloadable(system)
  const dl = system.download
  const installerUrl = dl ? latestAssetUrl(system, dl.primary.fileName) : undefined
  const imageNote = system.screenshotsAreReal
    ? system.screenshotsNote ?? 'Capturas reales del programa.'
    : 'Imágenes ilustrativas: todavía no son capturas del programa terminado.'

  const facts = [
    { icon: Hash, label: 'Versión', value: info.version ? `v${info.version}` : 'Por anunciar' },
    { icon: Calendar, label: 'Última actualización', value: formatDate(info.date) || 'Por anunciar' },
    { icon: Monitor, label: 'Compatible con', value: system.operatingSystems.join(' · ') },
    ...(system.database ? [{ icon: Database, label: 'Base de datos', value: system.database }] : []),
    ...(info.size ? [{ icon: HardDrive, label: 'Tamaño del instalador', value: formatSize(info.size) }] : []),
  ]

  return (
    <article>
      <Link to="/sistemas" className="mb-6 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-medium text-slate-400 transition hover:text-white">
        <ArrowLeft className="size-4" aria-hidden="true" />
        Volver al catálogo
      </Link>

      {/* Encabezado del producto */}
      <section className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:items-center">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusBadge status={system.status} />
            {category && <Pill>{category.name}</Pill>}
            {info.version && <Pill>Versión {info.version}</Pill>}
          </div>
          <div className="mt-5 flex items-center gap-4">
            <span className={`grid size-14 shrink-0 place-items-center rounded-2xl bg-gradient-to-br ${accentRing[system.accent]} text-white shadow-[0_12px_30px_-10px_rgba(59,130,246,0.8)]`}>
              <Icon name={system.icon} className="size-7" />
            </span>
            <div>
              <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{system.name}</h1>
              <p className="text-sm text-slate-400">{system.fullName.split('—')[1]?.trim() ?? system.fullName}</p>
            </div>
          </div>
          <p className="mt-5 text-lg leading-relaxed text-slate-300">{system.tagline}</p>

          {/* Panel de acciones */}
          <div className="glass mt-7 rounded-2xl p-4 sm:p-5">
            <div className="grid gap-3 sm:grid-cols-2">
              {downloadable && installerUrl ? (
                <ExternalButton href={installerUrl} download className="sm:col-span-2">
                  <Download className="size-4" aria-hidden="true" />
                  Descargar sistema
                </ExternalButton>
              ) : dl?.sourceUrl ? (
                <ExternalButton href={dl.sourceUrl} className="sm:col-span-2" showIcon>
                  <Code className="size-4" aria-hidden="true" />
                  Ver código fuente
                </ExternalButton>
              ) : (
                <ExternalButton href={whatsappUrl(system.whatsappMessage)} className="sm:col-span-2">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  En desarrollo · Solicitar información
                </ExternalButton>
              )}
              <a href="#documentacion" onClick={scrollTo('documentacion')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/5 ">
                <BookOpen className="size-4" aria-hidden="true" />
                Ver documentación
              </a>
              <a href="#soporte" onClick={scrollTo('soporte')} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/10 px-4 text-sm font-semibold text-slate-100 transition hover:border-white/20 hover:bg-white/5 ">
                <MessageCircle className="size-4" aria-hidden="true" />
                Consultar soporte
              </a>
            </div>
            {downloadable && dl && (
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {dl.primary.label} · {dl.primary.description}
                {info.size ? ` · ${formatSize(info.size)}` : ''}. Descarga oficial desde GitHub Releases.
              </p>
            )}
          </div>
        </div>

        {system.heroImage && (
          <motion.figure
            initial={reduce ? false : { opacity: 0, y: 20, rotateX: 8 }}
            animate={{ opacity: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative [perspective:1200px]"
          >
            <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-blue-600/30 via-cyan-500/10 to-violet-600/30 blur-3xl" aria-hidden="true" />
            <button
              type="button"
              onClick={() => setShot(0)}
              className="group relative block w-full overflow-hidden rounded-2xl border border-white/12 bg-ink-850 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.9)]"
              aria-label={`Ampliar captura: ${system.heroImage.title}`}
            >
              <img
                src={asset(system.heroImage.src)}
                alt={`${system.name}: ${system.heroImage.title}. ${system.heroImage.caption}`}
                width={1366}
                height={768}
                fetchPriority="high"
                className="w-full transition duration-500 group-hover:scale-[1.015]"
              />
              <span className="absolute right-3 bottom-3 inline-flex items-center gap-1.5 rounded-lg bg-black/65 px-2.5 py-1 text-xs text-white opacity-0 transition group-hover:opacity-100">
                <ZoomIn className="size-3.5" aria-hidden="true" /> Ampliar
              </span>
            </button>
            <figcaption className="relative mt-3 text-center text-xs text-slate-500">{imageNote}</figcaption>
          </motion.figure>
        )}
      </section>

      {/* Datos rápidos */}
      <dl className="mt-10 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-5">
        {facts.map((f) => (
          <div key={f.label} className="glass rounded-2xl p-4">
            <dt className="flex items-center gap-2 text-xs text-slate-500">
              <f.icon className="size-3.5 text-cyan-400" aria-hidden="true" />
              {f.label}
            </dt>
            <dd className="mt-1.5 text-sm font-semibold text-white">{info.loading && (f.label === 'Versión' || f.label === 'Última actualización') ? <span className="inline-block h-4 w-20 animate-pulse rounded bg-white/10" /> : f.value}</dd>
          </div>
        ))}
      </dl>

      {/* Índice de la ficha */}
      <nav aria-label="Secciones de la ficha" className="sticky top-16 z-20 -mx-4 mt-10 border-y border-white/6 bg-ink-950/80 px-4 backdrop-blur-xl sm:-mx-6 sm:px-6 lg:-mx-10 lg:px-10">
        <ul className="scrollbar-thin flex gap-1 overflow-x-auto py-2">
          {sections.map((s) => (
            <li key={s.id} className="shrink-0">
              <a href={`#${s.id}`} onClick={scrollTo(s.id)} className="inline-flex min-h-9 items-center rounded-lg px-3 text-xs font-semibold text-slate-400 transition hover:bg-white/6 hover:text-white">
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="mt-12 space-y-20">
        <Section id="descripcion">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
            <div>
              <SectionTitle eyebrow="Descripción" title={`¿Qué es ${system.name}?`} />
              <div className="space-y-4 text-base leading-relaxed text-slate-300">
                {system.description.map((p) => <p key={p}>{p}</p>)}
              </div>
            </div>
            <div>
              <h3 className="mb-4 font-display text-lg font-bold text-white">Problemas que resuelve</h3>
              <ul className="space-y-3">
                {system.problems.map((p) => (
                  <li key={p.title} className="glass rounded-2xl p-4">
                    <p className="text-sm font-semibold text-white">{p.title}</p>
                    <p className="mt-1 text-sm leading-relaxed text-slate-400">{p.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Section>

        <Section id="funciones">
          <SectionTitle eyebrow="Funcionalidades" title="Todo lo que necesitas en el día a día" description="Funciones disponibles en la versión publicada." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {system.features.map((f) => (
              <div key={f.title} className="glass group rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/15">
                <span className="grid size-10 place-items-center rounded-xl bg-blue-500/15 text-cyan-300 transition group-hover:bg-blue-500/25">
                  <Icon name={f.icon} className="size-5" />
                </span>
                <h3 className="mt-3.5 text-sm font-bold text-white">{f.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-slate-400">{f.text}</p>
              </div>
            ))}
          </div>
        </Section>

        <Section id="capturas">
          <SectionTitle eyebrow="Capturas" title={system.screenshotsAreReal ? 'Así se ve el programa' : 'Vista previa'} description={imageNote} />
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {system.gallery.map((g, i) => (
              <li key={g.src}>
                <button type="button" onClick={() => setShot(i)} className="group glass block w-full overflow-hidden rounded-2xl text-left transition duration-300 hover:-translate-y-0.5 hover:border-white/15" aria-label={`Ampliar captura: ${g.title}`}>
                  <span className="relative block aspect-[16/9] overflow-hidden bg-ink-850">
                    <img src={asset(g.thumb)} alt="" loading="lazy" decoding="async" width={720} height={405} className="size-full object-cover object-left-top transition duration-500 group-hover:scale-[1.04]" />
                    <span className="absolute inset-0 grid place-items-center bg-ink-950/0 opacity-0 transition group-hover:bg-ink-950/40 group-hover:opacity-100">
                      <ZoomIn className="size-6 text-white" aria-hidden="true" />
                    </span>
                  </span>
                  <span className="block p-4">
                    <span className="block text-sm font-semibold text-white">{g.title}</span>
                    <span className="mt-0.5 block text-xs leading-relaxed text-slate-400">{g.caption}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
          <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
            <Images className="size-3.5" aria-hidden="true" /> Toca una captura para verla en grande.
          </p>
        </Section>

        <Section id="modulos">
          <SectionTitle eyebrow="Módulos" title="Módulos disponibles" description="Cada usuario ve solo los módulos que su rol le permite." />
          <ul className="flex flex-wrap gap-2">
            {system.modules.map((m) => (
              <li key={m} className="inline-flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.03] px-3.5 py-2 text-sm text-slate-200">
                <ListChecks className="size-4 text-cyan-400" aria-hidden="true" />
                {m}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="requisitos">
          <SectionTitle eyebrow="Requisitos" title="Requisitos mínimos" />
          <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
            <dl className="glass divide-y divide-white/6 overflow-hidden rounded-2xl">
              {system.requirements.map((r) => (
                <div key={r.label} className="grid gap-1 px-5 py-3.5 sm:grid-cols-[200px_1fr] sm:gap-4">
                  <dt className="text-sm font-medium text-slate-400">{r.label}</dt>
                  <dd className="text-sm text-white">{r.value}</dd>
                </div>
              ))}
            </dl>
            <div className="space-y-4">
              <div className="glass rounded-2xl p-5">
                <p className="flex items-center gap-2 text-sm font-semibold text-white"><Monitor className="size-4 text-cyan-400" aria-hidden="true" /> Sistemas operativos</p>
                <ul className="mt-3 space-y-1.5 text-sm text-slate-300">
                  {system.operatingSystems.map((o) => <li key={o}>{o}</li>)}
                </ul>
              </div>
              {system.database && (
                <div className="glass rounded-2xl p-5">
                  <p className="flex items-center gap-2 text-sm font-semibold text-white"><Cpu className="size-4 text-cyan-400" aria-hidden="true" /> Base de datos</p>
                  <p className="mt-3 text-sm text-slate-300">{system.database}. Gratuita y de código abierto; los datos se guardan en tu propia computadora (PC servidor).</p>
                </div>
              )}
            </div>
          </div>
        </Section>

        <Section id="instalacion">
          <SectionTitle eyebrow="Instalación" title="Guía de instalación" description={system.installTime} />
          <ol className="relative space-y-4 border-l border-white/10 pl-6 sm:pl-8">
            {system.installSteps.map((step, i) => (
              <li key={step.title} className="relative">
                <span className="absolute top-3 -left-[37px] grid size-7 place-items-center rounded-full border border-cyan-400/40 bg-ink-900 text-xs font-bold text-cyan-300 sm:-left-[45px]">{i + 1}</span>
                <div className="glass rounded-2xl p-4 sm:p-5">
                  <p className="text-sm font-semibold text-white">{step.title}</p>
                  <p className="mt-1 text-sm leading-relaxed text-slate-400">{step.text}</p>
                </div>
              </li>
            ))}
          </ol>
          {dl && dl.warnings.length > 0 && (
            <div className="mt-6 rounded-2xl border border-amber-400/25 bg-amber-400/[0.07] p-5">
              <p className="flex items-center gap-2 text-sm font-semibold text-amber-200"><TriangleAlert className="size-4" aria-hidden="true" /> Antes de instalar</p>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-amber-100/80">
                {dl.warnings.map((w) => <li key={w}>{w}</li>)}
              </ul>
            </div>
          )}
        </Section>

        <Section id="documentacion">
          <SectionTitle eyebrow="Documentación" title="Manuales y guías" description="Documentos oficiales de la última versión publicada." />
          <div className="grid gap-4 md:grid-cols-3">
            {system.docs.map((d) => {
              const href = docHref(system, d)
              return href ? (
                <a key={d.label} href={href} target="_blank" rel="noopener noreferrer" className="glass group flex flex-col rounded-2xl p-5 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30">
                  <span className="flex items-center justify-between">
                    <span className="grid size-10 place-items-center rounded-xl bg-violet-500/15 text-violet-300"><FileText className="size-5" aria-hidden="true" /></span>
                    <ExternalLink className="size-4 text-slate-500 transition group-hover:text-cyan-300" aria-hidden="true" />
                  </span>
                  <span className="mt-4 text-sm font-semibold text-white">{d.label}</span>
                  <span className="mt-1 text-sm leading-relaxed text-slate-400">{d.description}</span>
                </a>
              ) : null
            })}
          </div>
          {releasesUrl(system) && (
            <p className="mt-4 text-sm text-slate-400">
              Notas de cada versión y versiones anteriores:{' '}
              <Link to="/actualizaciones" className="font-semibold text-cyan-300 hover:text-cyan-200">Actualizaciones</Link>
              {' · '}
              <Link to="/descargas" className="font-semibold text-cyan-300 hover:text-cyan-200">Centro de descargas</Link>
            </p>
          )}
        </Section>

        <Section id="preguntas">
          <SectionTitle eyebrow="Preguntas frecuentes" title="Lo que más nos preguntan" />
          <div className="space-y-3">
            {system.faq.map((f) => (
              <details key={f.q} className="glass group rounded-2xl [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-sm font-semibold text-white">
                  <span className="flex items-center gap-3"><CircleHelp className="size-4 shrink-0 text-cyan-400" aria-hidden="true" />{f.q}</span>
                  <span className="grid size-6 shrink-0 place-items-center rounded-full border border-white/10 text-slate-400 transition group-open:rotate-45" aria-hidden="true">+</span>
                </summary>
                <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-slate-400">{f.a}</p>
              </details>
            ))}
          </div>
        </Section>

        <Section id="soporte">
          <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-emerald-600/20 via-ink-850 to-blue-700/25 p-7 sm:p-10">
            <div className="relative grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
              <div>
                <p className="text-xs font-semibold tracking-[0.18em] text-emerald-300 uppercase">Soporte</p>
                <h2 className="mt-2 font-display text-2xl font-bold text-white">¿Necesitas ayuda con {system.name}?</h2>
                <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                  Consultas, precios y licencias, instalación (en persona o por acceso remoto), capacitación y cualquier
                  problema con el sistema. Atiende directamente {site.owner}.
                </p>
                <p className="mt-3 text-sm font-semibold text-white">WhatsApp y teléfono: {site.contact.phoneDisplay}</p>
              </div>
              <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
                <ExternalButton href={whatsappUrl(system.whatsappMessage)} variant="whatsapp">
                  <MessageCircle className="size-4" aria-hidden="true" />
                  Escribir por WhatsApp
                </ExternalButton>
                <a href={phoneUrl()} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-white/15 px-5 text-sm font-semibold text-white transition hover:bg-white/8">
                  <Phone className="size-4" aria-hidden="true" />
                  Llamar
                </a>
              </div>
            </div>
          </div>
        </Section>
      </div>

      <Lightbox items={system.gallery} index={shot} onChange={setShot} onClose={() => setShot(null)} note={imageNote} />
    </article>
  )
}
