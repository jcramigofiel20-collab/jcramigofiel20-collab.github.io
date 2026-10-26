import { useState } from 'react'
import { Camera, Clock, FileText, Mail, MessageCircle, Monitor, Phone, Send } from 'lucide-react'
import { ExternalButton, PageHeader, Reveal } from '../components/ui/primitives'
import { BrandSvg } from '../components/ui/SocialIcon'
import { site } from '../config/site'
import { allSystems } from '../lib/catalog'
import { phoneUrl, whatsappUrl } from '../lib/format'

const reasons = ['Información y precios', 'Instalación', 'Licencia', 'Soporte técnico', 'Capacitación', 'Un sistema para mi rubro', 'Otro']

const inputClass =
  'w-full rounded-xl border border-white/10 bg-ink-950/50 px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none'

export default function Contact() {
  const [form, setForm] = useState({ name: '', business: '', system: allSystems()[0]?.name ?? '', reason: reasons[0], message: '' })
  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  const composed = [
    `Hola ${site.owner.split(' ')[0]}, te escribo desde la página de ${site.brand}.`,
    form.name && `Nombre: ${form.name}`,
    form.business && `Negocio: ${form.business}`,
    form.system && `Sistema: ${form.system}`,
    `Motivo: ${form.reason}`,
    form.message && `Mensaje: ${form.message}`,
  ]
    .filter(Boolean)
    .join('\n')

  return (
    <>
      <PageHeader
        eyebrow="Contacto y soporte"
        title="Estamos para ayudarte"
        description={`Consultas, precios, instalación, licencias y soporte técnico. Te atiende directamente ${site.owner}.`}
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.15fr]">
        <div className="space-y-4">
          <Reveal>
            <a href={site.socials.whatsapp || whatsappUrl('Hola')} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 rounded-3xl border border-[#25D366]/30 bg-[#25D366]/10 p-6 transition hover:border-[#25D366]/60 hover:bg-[#25D366]/15">
              <span className="grid size-14 place-items-center rounded-2xl bg-[#25D366] text-[#05290f] transition group-hover:scale-105">
                <BrandSvg id="whatsapp" className="size-7" />
              </span>
              <span>
                <span className="block text-sm text-emerald-200">WhatsApp (la forma más rápida)</span>
                <span className="block font-display text-2xl font-bold text-white">{site.contact.phoneDisplay}</span>
              </span>
            </a>
          </Reveal>
          <Reveal delay={0.05}>
            <div className="grid gap-3 sm:grid-cols-2">
              <a href={phoneUrl()} className="glass flex items-center gap-3 rounded-2xl p-4 transition hover:border-white/15">
                <Phone className="size-5 text-cyan-300" aria-hidden="true" />
                <span>
                  <span className="block text-xs text-slate-400">Llamadas</span>
                  <span className="block text-sm font-semibold text-white">{site.contact.phoneDisplay}</span>
                </span>
              </a>
              <div className="glass flex items-center gap-3 rounded-2xl p-4">
                <Clock className="size-5 text-cyan-300" aria-hidden="true" />
                <span>
                  <span className="block text-xs text-slate-400">Atención</span>
                  <span className="block text-sm font-semibold text-white">{site.contact.hours}</span>
                </span>
              </div>
              {site.contact.email && (
                <a href={`mailto:${site.contact.email}`} className="glass flex items-center gap-3 rounded-2xl p-4 transition hover:border-white/15 sm:col-span-2">
                  <Mail className="size-5 text-cyan-300" aria-hidden="true" />
                  <span className="text-sm font-semibold text-white">{site.contact.email}</span>
                </a>
              )}
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass rounded-2xl p-5">
              <h2 className="text-sm font-semibold text-white">Si pides soporte técnico, ten a mano:</h2>
              <ul className="mt-3 space-y-2.5 text-sm text-slate-400">
                <li className="flex gap-2.5"><Camera className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true" /> Qué estabas haciendo y el mensaje exacto que apareció (una foto de la pantalla ayuda mucho).</li>
                <li className="flex gap-2.5"><Monitor className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true" /> Tu usuario y el nombre de la PC (aparece al pie del menú lateral del sistema).</li>
                <li className="flex gap-2.5"><FileText className="mt-0.5 size-4 shrink-0 text-cyan-400" aria-hidden="true" /> La versión del sistema (menú Ayuda).</li>
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.08}>
          <form
            className="glass space-y-4 rounded-3xl p-6 sm:p-8"
            onSubmit={(e) => {
              e.preventDefault()
              window.open(whatsappUrl(composed), '_blank', 'noopener,noreferrer')
            }}
          >
            <div>
              <h2 className="font-display text-lg font-bold text-white">Escríbenos</h2>
              <p className="mt-1 text-sm text-slate-400">Completa los datos y se abrirá WhatsApp con tu mensaje listo para enviar. No guardamos nada en esta página.</p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Tu nombre</span>
                <input className={inputClass} value={form.name} onChange={set('name')} autoComplete="name" placeholder="Nombre y apellido" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Tu negocio</span>
                <input className={inputClass} value={form.business} onChange={set('business')} autoComplete="organization" placeholder="Nombre del negocio" />
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Sistema</span>
                <select className={inputClass} value={form.system} onChange={set('system')}>
                  {allSystems().map((s) => <option key={s.slug} value={s.name}>{s.name}</option>)}
                  <option value="Otro / aún no sé">Otro / aún no sé</option>
                </select>
              </label>
              <label className="block">
                <span className="mb-1.5 block text-xs font-medium text-slate-300">Motivo</span>
                <select className={inputClass} value={form.reason} onChange={set('reason')}>
                  {reasons.map((r) => <option key={r}>{r}</option>)}
                </select>
              </label>
            </div>
            <label className="block">
              <span className="mb-1.5 block text-xs font-medium text-slate-300">Mensaje</span>
              <textarea className={`${inputClass} min-h-32 resize-y`} value={form.message} onChange={set('message')} placeholder="Cuéntanos en qué te podemos ayudar" maxLength={800} />
            </label>
            <button type="submit" className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 text-sm font-semibold text-[#05290f] shadow-[0_10px_30px_-12px_rgba(37,211,102,0.8)] transition hover:brightness-110 active:scale-[0.99]">
              <Send className="size-4" aria-hidden="true" />
              Enviar por WhatsApp
            </button>
          </form>
        </Reveal>
      </div>

      <Reveal>
        <div className="mt-8 flex flex-col items-center gap-3 text-center text-sm text-slate-400 sm:flex-row sm:justify-center">
          <MessageCircle className="size-4 text-slate-500" aria-hidden="true" />
          ¿Prefieres escribir directamente?
          <ExternalButton href={whatsappUrl(`Hola ${site.owner.split(' ')[0]}, tengo una consulta.`)} variant="secondary" className="min-h-10 px-4">
            Abrir WhatsApp
          </ExternalButton>
        </div>
      </Reveal>
    </>
  )
}
