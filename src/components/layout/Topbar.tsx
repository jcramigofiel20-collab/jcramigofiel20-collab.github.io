import { useState } from 'react'
import { Link, useLocation } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Download, Menu, MessageCircle, Search, X } from 'lucide-react'
import { metaFor } from '../../data/seo'
import { allSystems } from '../../lib/catalog'
import { SearchBox } from './SearchBox'

export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const { pathname } = useLocation()
  const [searchOpen, setSearchOpen] = useState(false)
  const section = metaFor(pathname).section
  const available = allSystems().filter((s) => s.status === 'disponible')

  return (
    <header className="sticky top-0 z-30 border-b border-white/6 bg-ink-950/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-8">
        <button
          type="button"
          onClick={onOpenMenu}
          className="grid size-11 shrink-0 place-items-center rounded-xl text-slate-300 transition hover:bg-white/8 hover:text-white lg:hidden"
          aria-label="Abrir menú"
        >
          <Menu className="size-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1 md:flex-none md:basis-56 xl:basis-72">
          <AnimatePresence mode="wait" initial={false}>
            <motion.p
              key={section}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.18 }}
              className="truncate font-display text-base font-semibold text-white"
            >
              {section}
            </motion.p>
          </AnimatePresence>
        </div>

        <div className="hidden max-w-md flex-1 md:block">
          <SearchBox />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {available.length > 0 && (
            <Link
              to="/actualizaciones"
              className="hidden items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/8 px-3 py-1.5 text-xs font-medium text-emerald-300 transition hover:border-emerald-400/40 xl:inline-flex"
              title="Sistemas con versión publicada"
            >
              <span className="size-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_2px_rgba(52,211,153,0.6)]" aria-hidden="true" />
              {available.length === 1 && available[0].download
                ? `${available[0].name} v${available[0].download.fallback.version} disponible`
                : `${available.length} sistemas disponibles`}
            </Link>
          )}
          <button
            type="button"
            onClick={() => setSearchOpen((v) => !v)}
            className="grid size-11 place-items-center rounded-xl text-slate-300 transition hover:bg-white/8 hover:text-white md:hidden"
            aria-label={searchOpen ? 'Cerrar buscador' : 'Buscar sistemas'}
            aria-expanded={searchOpen}
          >
            {searchOpen ? <X className="size-5" aria-hidden="true" /> : <Search className="size-5" aria-hidden="true" />}
          </button>
          <Link
            to="/descargas"
            className="grid size-11 place-items-center rounded-xl border border-white/8 text-slate-300 transition hover:border-cyan-400/40 hover:bg-white/5 hover:text-cyan-300 sm:flex sm:w-auto sm:gap-2 sm:px-3.5 sm:text-sm sm:font-medium"
            aria-label="Descargas"
          >
            <Download className="size-[18px]" aria-hidden="true" />
            <span className="hidden sm:inline">Descargas</span>
          </Link>
          <Link
            to="/contacto"
            className="hidden h-11 items-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 text-sm font-semibold text-white shadow-[0_8px_24px_-10px_rgba(37,99,235,0.9)] transition hover:brightness-110 sm:inline-flex"
          >
            <MessageCircle className="size-4" aria-hidden="true" />
            Contacto
          </Link>
        </div>
      </div>

      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-white/6 md:hidden"
          >
            <div className="px-4 py-3">
              <SearchBox autoFocus onDone={() => setSearchOpen(false)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
