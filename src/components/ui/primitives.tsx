import type { ComponentProps, ReactNode } from 'react'
import { Link } from 'react-router'
import { motion, type HTMLMotionProps } from 'motion/react'
import { ExternalLink } from 'lucide-react'
import type { SystemStatus } from '../../data/types'
import { statusLabel } from '../../lib/catalog'

type Variant = 'primary' | 'secondary' | 'ghost' | 'whatsapp'

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-to-r from-brand-600 to-cyan-500 text-white shadow-[0_10px_30px_-10px_rgba(37,99,235,0.8)] hover:shadow-[0_14px_36px_-10px_rgba(34,211,238,0.7)] hover:brightness-110',
  secondary: 'glass text-slate-100 hover:border-white/20 hover:bg-white/8',
  ghost: 'text-slate-300 hover:bg-white/6 hover:text-white',
  whatsapp: 'bg-[#25D366] text-[#05290f] shadow-[0_10px_30px_-12px_rgba(37,211,102,0.8)] hover:brightness-110',
}

const base =
  'relative inline-flex min-h-11 items-center justify-center gap-2 overflow-hidden rounded-xl px-5 py-2.5 text-sm font-semibold transition duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50'

/** Botón que lleva a otra pantalla de la página. */
export function ButtonLink({ to, variant = 'primary', className = '', children, ...rest }: { to: string; variant?: Variant } & Omit<ComponentProps<typeof Link>, 'to'>) {
  return (
    <Link to={to} className={`${base} ${variants[variant]} ${className}`} {...rest}>
      {children}
    </Link>
  )
}

/** Botón hacia un sitio externo (abre en otra pestaña de forma segura). */
export function ExternalButton({ href, variant = 'primary', className = '', children, download, showIcon = false, ...rest }: { href: string; variant?: Variant; showIcon?: boolean; download?: boolean } & Omit<ComponentProps<'a'>, 'href' | 'download'>) {
  return (
    <a
      href={href}
      {...(download ? { download: '' } : { target: '_blank', rel: 'noopener noreferrer' })}
      className={`${base} ${variants[variant]} ${className}`}
      {...rest}
    >
      {children}
      {showIcon && <ExternalLink className="size-3.5 opacity-70" aria-hidden="true" />}
    </a>
  )
}

const statusStyle: Record<SystemStatus, string> = {
  disponible: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300',
  'en-desarrollo': 'border-amber-400/30 bg-amber-400/10 text-amber-300',
  proximamente: 'border-violet-400/30 bg-violet-400/10 text-violet-300',
}

export function StatusBadge({ status, className = '' }: { status: SystemStatus; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${statusStyle[status]} ${className}`}>
      <span className="relative flex size-1.5">
        {status === 'disponible' && <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-60" />}
        <span className="relative inline-flex size-1.5 rounded-full bg-current" />
      </span>
      {statusLabel[status]}
    </span>
  )
}

export function Pill({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs font-medium text-slate-300 ${className}`}>
      {children}
    </span>
  )
}

/** Encabezado de cada pantalla. */
export function PageHeader({ eyebrow, title, description, children }: { eyebrow?: string; title: ReactNode; description?: ReactNode; children?: ReactNode }) {
  return (
    <header className="mb-8 flex flex-col gap-5 md:mb-10 md:flex-row md:items-end md:justify-between">
      <div className="max-w-3xl">
        {eyebrow && <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">{eyebrow}</p>}
        <h1 className="font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
        {description && <p className="mt-3 text-base leading-relaxed text-slate-400">{description}</p>}
      </div>
      {children}
    </header>
  )
}

export function SectionTitle({ eyebrow, title, description, className = '' }: { eyebrow?: string; title: ReactNode; description?: ReactNode; className?: string }) {
  return (
    <div className={`mb-6 max-w-2xl ${className}`}>
      {eyebrow && <p className="mb-2 text-xs font-semibold tracking-[0.18em] text-cyan-300 uppercase">{eyebrow}</p>}
      <h2 className="font-display text-2xl font-bold tracking-tight text-white sm:text-[1.7rem]">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">{description}</p>}
    </div>
  )
}

/** Aparece con un desplazamiento corto cuando entra en pantalla. */
export function Reveal({ delay = 0, className, children, ...rest }: { delay?: number } & HTMLMotionProps<'div'>) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -40px 0px' }}
      transition={{ duration: 0.45, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

export function Spinner({ label = 'Cargando…' }: { label?: string }) {
  return (
    <span role="status" className="inline-flex items-center gap-2 text-sm text-slate-400">
      <span className="size-4 animate-spin rounded-full border-2 border-white/15 border-t-cyan-400" aria-hidden="true" />
      {label}
    </span>
  )
}
