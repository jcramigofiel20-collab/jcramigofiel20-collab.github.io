import { useEffect, useId, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { ArrowRight, Search } from 'lucide-react'
import { findCategory, searchSystems, statusLabel } from '../../lib/catalog'
import { Icon } from '../ui/Icon'

/** Buscador de la barra superior: sugiere sistemas al escribir; Enter abre el catálogo filtrado. */
export function SearchBox({ autoFocus = false, onDone }: { autoFocus?: boolean; onDone?: () => void }) {
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(-1)
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const listId = useId()
  const inputRef = useRef<HTMLInputElement>(null)
  const results = query.trim() ? searchSystems(query).slice(0, 5) : []

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus()
  }, [autoFocus])

  useEffect(() => {
    setOpen(false)
  }, [pathname])

  const go = (to: string) => {
    setOpen(false)
    setQuery('')
    inputRef.current?.blur()
    navigate(to)
    onDone?.()
  }

  const submit = () => {
    if (active >= 0 && results[active]) go(`/sistemas/${results[active].slug}`)
    else go(query.trim() ? `/sistemas?q=${encodeURIComponent(query.trim())}` : '/sistemas')
  }

  return (
    <div className="relative w-full">
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault()
          submit()
        }}
      >
        <label htmlFor={`${listId}-input`} className="sr-only">Buscar sistemas</label>
        <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          ref={inputRef}
          id={`${listId}-input`}
          type="search"
          value={query}
          autoComplete="off"
          placeholder="Buscar sistemas…"
          role="combobox"
          aria-expanded={open && query.trim() !== ''}
          aria-controls={listId}
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          onChange={(e) => {
            setQuery(e.target.value)
            setActive(-1)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={(e) => {
            if (e.key === 'ArrowDown') {
              e.preventDefault()
              setActive((i) => Math.min(i + 1, results.length - 1))
            } else if (e.key === 'ArrowUp') {
              e.preventDefault()
              setActive((i) => Math.max(i - 1, -1))
            } else if (e.key === 'Escape') {
              setOpen(false)
              onDone?.()
            }
          }}
          className="h-11 w-full rounded-xl border border-white/8 bg-white/[0.04] pr-4 pl-10 text-sm text-slate-100 placeholder:text-slate-500 transition focus:border-cyan-400/50 focus:bg-white/[0.07] focus:outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </form>

      <AnimatePresence>
        {open && query.trim() !== '' && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full right-0 left-0 z-50 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-ink-850/95 shadow-2xl backdrop-blur-xl"
          >
            <ul id={listId} role="listbox" aria-label="Sistemas encontrados">
              {results.map((s, i) => (
                <li key={s.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <button
                    type="button"
                    onMouseDown={(e) => e.preventDefault()}
                    onClick={() => go(`/sistemas/${s.slug}`)}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition ${i === active ? 'bg-white/8' : 'hover:bg-white/5'}`}
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-lg bg-blue-500/15 text-cyan-300">
                      <Icon name={s.icon} className="size-4" />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm font-semibold text-white">{s.name}</span>
                      <span className="block truncate text-xs text-slate-400">
                        {findCategory(s.category)?.name} · {statusLabel[s.status]}
                      </span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
            {results.length === 0 && <p className="px-4 py-3 text-sm text-slate-400">No hay sistemas que coincidan con «{query.trim()}».</p>}
            <button
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={submit}
              className="flex w-full items-center justify-between border-t border-white/8 px-4 py-2.5 text-xs font-medium text-cyan-300 hover:bg-white/5"
            >
              Ver todos los resultados en el catálogo
              <ArrowRight className="size-3.5" aria-hidden="true" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
