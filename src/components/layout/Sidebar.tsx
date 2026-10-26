import { NavLink } from 'react-router'
import { motion } from 'motion/react'
import { PanelLeftClose, PanelLeftOpen, X } from 'lucide-react'
import { navigation } from '../../config/navigation'
import { site } from '../../config/site'
import { Logo } from '../ui/Logo'
import { SocialLinks } from '../ui/SocialIcon'

interface Props {
  collapsed: boolean
  onToggleCollapsed?: () => void
  /** En celular: cierra el panel lateral. */
  onClose?: () => void
  /** Identifica el indicador animado (uno por instancia de la barra). */
  layoutKey: string
}

export function SidebarContent({ collapsed, onToggleCollapsed, onClose, layoutKey }: Props) {
  return (
    <div className="flex h-full flex-col">
      <div className={`flex items-center gap-2 px-4 pt-5 pb-6 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        <NavLink to="/" className="rounded-xl" aria-label={`${site.brand}, ir al inicio`} onClick={onClose}>
          <Logo collapsed={collapsed} />
        </NavLink>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            className="grid size-10 place-items-center rounded-xl text-slate-400 transition hover:bg-white/8 hover:text-white"
            aria-label="Cerrar menú"
          >
            <X className="size-5" aria-hidden="true" />
          </button>
        )}
      </div>

      <nav aria-label="Menú principal" className="scrollbar-thin flex-1 overflow-y-auto px-3">
        {!collapsed && <p className="mb-2 px-3 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">Navegación</p>}
        <ul className="space-y-1">
          {navigation.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                end={item.end}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group relative flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium transition-colors duration-200 ${
                    collapsed ? 'justify-center' : ''
                  } ${isActive ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-100'}`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <motion.span
                        layoutId={`nav-active-${layoutKey}`}
                        className="absolute inset-0 rounded-xl border border-blue-400/25 bg-gradient-to-r from-blue-500/25 via-cyan-500/10 to-transparent shadow-[0_0_24px_-8px_rgba(59,130,246,0.7)]"
                        transition={{ type: 'spring', stiffness: 420, damping: 34 }}
                      />
                    )}
                    {isActive && <span className="absolute top-2.5 bottom-2.5 left-0 w-[3px] rounded-full bg-gradient-to-b from-cyan-300 to-blue-500" />}
                    <item.icon
                      className={`relative size-[18px] shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? 'text-cyan-300' : ''}`}
                      aria-hidden="true"
                    />
                    {!collapsed && <span className="relative truncate">{item.label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="space-y-4 px-4 pt-4 pb-5">
        <div className={collapsed ? '' : 'border-t border-white/6 pt-4'}>
          {!collapsed && <p className="mb-2.5 text-[11px] font-semibold tracking-[0.16em] text-slate-500 uppercase">Síguenos</p>}
          <SocialLinks compact={collapsed} />
        </div>
        {!collapsed && (
          <div className="glass rounded-2xl p-3.5">
            <p className="font-display text-sm font-bold text-white">{site.brand}</p>
            <p className="mt-0.5 text-xs leading-relaxed text-slate-400">{site.slogan}</p>
          </div>
        )}
        {onToggleCollapsed && (
          <button
            type="button"
            onClick={onToggleCollapsed}
            className={`flex min-h-10 w-full items-center gap-2 rounded-xl px-3 text-xs font-medium text-slate-500 transition hover:bg-white/5 hover:text-slate-200 ${collapsed ? 'justify-center' : ''}`}
            aria-label={collapsed ? 'Expandir menú lateral' : 'Contraer menú lateral'}
          >
            {collapsed ? <PanelLeftOpen className="size-4" aria-hidden="true" /> : <PanelLeftClose className="size-4" aria-hidden="true" />}
            {!collapsed && 'Contraer menú'}
          </button>
        )}
      </div>
    </div>
  )
}
