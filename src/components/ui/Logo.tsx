import { useId } from 'react'
import { site } from '../../config/site'

/** Marca de JoabSystems: hexágono (pieza de software) con la «J». */
export function LogoMark({ className = 'size-9' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-g`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#3b82f6" />
          <stop offset=".55" stopColor="#06b6d4" />
          <stop offset="1" stopColor="#8b5cf6" />
        </linearGradient>
      </defs>
      <path d="M32 3 57 17.5v29L32 61 7 46.5v-29Z" fill={`url(#${id}-g)`} />
      <path d="M32 3 57 17.5v29L32 61 7 46.5v-29Z" fill="none" stroke="#fff" strokeOpacity=".25" strokeWidth="1.5" />
      <path
        d="M38 19v18.5c0 5.8-3.6 9.5-9.3 9.5-3.6 0-6.4-1.4-8.2-4l3.9-3.4c1 1.4 2.4 2.2 4 2.2 2.4 0 3.8-1.6 3.8-4.6V19Z"
        fill="#fff"
      />
    </svg>
  )
}

export function Logo({ collapsed = false }: { collapsed?: boolean }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark className="size-10 shrink-0 drop-shadow-[0_6px_18px_rgba(59,130,246,0.45)]" />
      {!collapsed && (
        <span className="leading-tight">
          <span className="block font-display text-lg font-bold tracking-tight text-white">
            Joab<span className="text-gradient">Systems</span>
          </span>
          <span className="block text-[11px] font-medium tracking-wide text-slate-400">Software para negocios</span>
        </span>
      )}
      <span className="sr-only">{site.brand}</span>
    </span>
  )
}
