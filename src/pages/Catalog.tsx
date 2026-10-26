import { useSearchParams } from 'react-router'
import { AnimatePresence, motion } from 'motion/react'
import { Search, SearchX, X } from 'lucide-react'
import { SystemCard } from '../components/SystemCard'
import { ButtonLink, PageHeader } from '../components/ui/primitives'
import type { CategoryId, SystemStatus } from '../data/types'
import { allCategories, allSystems, isDownloadable, searchSystems, statusLabel } from '../lib/catalog'

const statuses: SystemStatus[] = ['disponible', 'en-desarrollo', 'proximamente']

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`min-h-9 rounded-full border px-3.5 text-xs font-semibold transition ${
        active ? 'border-cyan-400/50 bg-cyan-400/15 text-cyan-200' : 'border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

export default function Catalog() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') ?? ''
  const categoria = params.get('categoria') as CategoryId | null
  const estado = params.get('estado') as SystemStatus | null
  const descarga = params.get('descarga') === '1'

  const update = (key: string, value: string | null) => {
    const next = new URLSearchParams(params)
    if (value) next.set(key, value)
    else next.delete(key)
    setParams(next, { replace: true })
  }

  const results = searchSystems(q, allSystems()).filter(
    (s) => (!categoria || s.category === categoria) && (!estado || s.status === estado) && (!descarga || isDownloadable(s)),
  )
  const filtering = q || categoria || estado || descarga
  const categoriesWithSystems = allCategories().filter((c) => allSystems().some((s) => s.category === c.id))

  return (
    <>
      <PageHeader
        eyebrow="Catálogo"
        title="Catálogo de sistemas"
        description="Explora los sistemas por tipo de negocio, estado y disponibilidad. Cada uno tiene su propia ficha con capturas, requisitos y documentación."
      />

      <div className="glass mb-8 space-y-4 rounded-2xl p-4 sm:p-5">
        <div className="relative">
          <label htmlFor="catalog-search" className="sr-only">Buscar en el catálogo</label>
          <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
          <input
            id="catalog-search"
            type="search"
            value={q}
            onChange={(e) => update('q', e.target.value)}
            placeholder="Buscar por nombre, categoría o descripción"
            className="h-12 w-full rounded-xl border border-white/8 bg-ink-950/50 pr-11 pl-10 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/50 focus:outline-none [&::-webkit-search-cancel-button]:hidden"
          />
          {q && (
            <button type="button" onClick={() => update('q', null)} className="absolute top-1/2 right-2 grid size-9 -translate-y-1/2 place-items-center rounded-lg text-slate-400 hover:bg-white/8 hover:text-white" aria-label="Borrar búsqueda">
              <X className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <div className="grid gap-4 lg:grid-cols-[1fr_auto_auto] lg:items-start">
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Tipo de negocio</legend>
            <div className="flex flex-wrap gap-2">
              <Chip active={!categoria} onClick={() => update('categoria', null)}>Todos</Chip>
              {categoriesWithSystems.map((c) => (
                <Chip key={c.id} active={categoria === c.id} onClick={() => update('categoria', categoria === c.id ? null : c.id)}>
                  {c.name}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Estado</legend>
            <div className="flex flex-wrap gap-2">
              {statuses.map((st) => (
                <Chip key={st} active={estado === st} onClick={() => update('estado', estado === st ? null : st)}>
                  {statusLabel[st]}
                </Chip>
              ))}
            </div>
          </fieldset>
          <fieldset>
            <legend className="mb-2 text-[11px] font-semibold tracking-[0.14em] text-slate-500 uppercase">Disponibilidad</legend>
            <Chip active={descarga} onClick={() => update('descarga', descarga ? null : '1')}>Con descarga</Chip>
          </fieldset>
        </div>
      </div>

      <div className="mb-4 flex items-center justify-between gap-4 text-sm text-slate-400" aria-live="polite">
        <p>
          {results.length === 1 ? '1 sistema' : `${results.length} sistemas`}
          {filtering ? ' con estos filtros' : ' en el catálogo'}
        </p>
        {filtering && (
          <button type="button" onClick={() => setParams({}, { replace: true })} className="font-semibold text-cyan-300 hover:text-cyan-200">
            Quitar filtros
          </button>
        )}
      </div>

      <motion.div layout className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {results.map((s) => (
            <motion.div key={s.slug} layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.2 }}>
              <SystemCard system={s} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {results.length === 0 && (
        <div className="glass flex flex-col items-center rounded-3xl px-6 py-14 text-center">
          <SearchX className="size-10 text-slate-500" aria-hidden="true" />
          <h2 className="mt-4 font-display text-lg font-bold text-white">No encontramos sistemas con esos filtros</h2>
          <p className="mt-2 max-w-md text-sm text-slate-400">
            Prueba con otra palabra o quita los filtros. Si buscas un sistema para tu rubro que aún no está en el
            catálogo, cuéntanos qué necesitas.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button type="button" onClick={() => setParams({}, { replace: true })} className="min-h-11 rounded-xl border border-white/10 px-5 text-sm font-semibold text-white hover:bg-white/5">
              Ver todos los sistemas
            </button>
            <ButtonLink to="/contacto">Contarnos qué necesitas</ButtonLink>
          </div>
        </div>
      )}

      <p className="mt-10 text-center text-sm text-slate-500">
        Por ahora el catálogo incluye los sistemas ya publicados. Los nuevos se agregarán aquí apenas estén listos.
      </p>
    </>
  )
}
