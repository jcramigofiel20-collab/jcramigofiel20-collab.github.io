import { Suspense, useEffect, useState } from 'react'
import { Link, ScrollRestoration, useLocation, useOutlet } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { site } from '../../config/site'
import { useSeo } from '../../lib/seo'
import { Spinner } from '../ui/primitives'
import { Background } from './Background'
import { SidebarContent } from './Sidebar'
import { Topbar } from './Topbar'

const COLLAPSE_KEY = 'joabsystems:sidebar-contraida'

function readCollapsed() {
  try {
    return localStorage.getItem(COLLAPSE_KEY) === '1'
  } catch {
    return false
  }
}

export function AppLayout() {
  const location = useLocation()
  const outlet = useOutlet()
  const [collapsed, setCollapsed] = useState(readCollapsed)
  const [mobileOpen, setMobileOpen] = useState(false)
  useSeo()

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  useEffect(() => {
    if (!mobileOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMobileOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [mobileOpen])

  const toggleCollapsed = () =>
    setCollapsed((v) => {
      try {
        localStorage.setItem(COLLAPSE_KEY, v ? '0' : '1')
      } catch {
        /* sin almacenamiento: solo dura esta visita */
      }
      return !v
    })

  return (
    <div className="relative min-h-screen">
      <a
        href="#contenido"
        className="sr-only z-[60] rounded-lg bg-cyan-400 px-4 py-2 font-semibold text-ink-950 focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
      >
        Saltar al contenido
      </a>
      <Background />

      {/* Barra lateral fija (computadora) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 hidden border-r border-white/6 bg-ink-900/70 backdrop-blur-xl transition-[width] duration-300 ease-out lg:block ${
          collapsed ? 'w-[84px]' : 'w-[272px]'
        }`}
      >
        <SidebarContent collapsed={collapsed} onToggleCollapsed={toggleCollapsed} layoutKey="desktop" />
      </aside>

      {/* Panel lateral (celular y tablet) */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              className="fixed inset-0 z-40 bg-ink-950/70 backdrop-blur-sm lg:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-label="Menú"
              className="fixed inset-y-0 left-0 z-50 w-[min(300px,86vw)] border-r border-white/8 bg-ink-900 shadow-2xl lg:hidden"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', stiffness: 380, damping: 38 }}
            >
              <SidebarContent collapsed={false} onClose={() => setMobileOpen(false)} layoutKey="mobile" />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className={`relative flex min-h-screen flex-col transition-[padding] duration-300 ease-out ${collapsed ? 'lg:pl-[84px]' : 'lg:pl-[272px]'}`}>
        <Topbar onOpenMenu={() => setMobileOpen(true)} />
        <main id="contenido" className="flex-1 overflow-x-clip px-4 pt-6 pb-16 sm:px-6 lg:px-10 lg:pt-10">
          <div className="mx-auto w-full max-w-6xl">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              >
                <Suspense
                  fallback={
                    <div className="grid min-h-[50vh] place-items-center">
                      <Spinner />
                    </div>
                  }
                >
                  {outlet}
                </Suspense>
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
        <footer className="border-t border-white/6 px-4 py-6 text-xs text-slate-500 sm:px-6 lg:px-10">
          <div className="mx-auto flex max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} {site.brand} · {site.owner} · {site.country}
            </p>
            <p className="flex flex-wrap gap-x-4 gap-y-1">
              <Link to="/contacto" className="hover:text-slate-300">Soporte: {site.contact.phoneDisplay}</Link>
              <span>Sitio web v{site.webVersion}</span>
            </p>
          </div>
        </footer>
      </div>
      <ScrollRestoration />
    </div>
  )
}
