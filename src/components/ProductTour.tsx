import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, Expand, MousePointerClick } from 'lucide-react'
import type { TourStop } from '../data/types'
import { asset } from '../lib/format'
import { Lightbox } from './Lightbox'
import { Icon } from './ui/Icon'

/**
 * Recorrido interactivo: pestañas por pantalla y números sobre la captura. Al tocar un número se ilumina esa parte
 * y se explica qué hace. «Siguiente» avanza parte por parte y luego a la siguiente pantalla.
 */
export function ProductTour({ stops, note }: { stops: TourStop[]; note?: string }) {
  const [stopIndex, setStopIndex] = useState(0)
  const [spot, setSpot] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const stop = stops[stopIndex]
  const hotspot = stop.hotspots[spot]
  const isLast = stopIndex === stops.length - 1 && spot === stop.hotspots.length - 1
  const isFirst = stopIndex === 0 && spot === 0

  const goTo = (index: number, part = 0) => {
    setStopIndex(index)
    setSpot(part)
  }

  const next = () => {
    if (spot < stop.hotspots.length - 1) setSpot(spot + 1)
    else if (stopIndex < stops.length - 1) goTo(stopIndex + 1)
  }
  const prev = () => {
    if (spot > 0) setSpot(spot - 1)
    else if (stopIndex > 0) goTo(stopIndex - 1, stops[stopIndex - 1].hotspots.length - 1)
  }

  return (
    <div className="glass overflow-hidden rounded-3xl">
      {/* Pantallas del recorrido */}
      <div role="tablist" aria-label="Pantallas del recorrido" className="scrollbar-thin flex gap-1.5 overflow-x-auto border-b border-white/6 p-2 sm:p-3">
        {stops.map((s, i) => (
          <button
            key={s.id}
            type="button"
            role="tab"
            aria-selected={i === stopIndex}
            onClick={() => goTo(i)}
            className={`relative flex min-h-11 shrink-0 items-center gap-2 rounded-xl px-3.5 text-sm font-semibold transition sm:px-4 ${
              i === stopIndex ? 'text-white' : 'text-slate-400 hover:bg-white/5 hover:text-slate-200'
            }`}
          >
            {i === stopIndex && (
              <motion.span
                layoutId="tour-tab"
                className="absolute inset-0 rounded-xl border border-cyan-400/30 bg-gradient-to-r from-blue-600/40 to-cyan-500/20"
                transition={{ type: 'spring', stiffness: 420, damping: 34 }}
              />
            )}
            <span className={`relative grid size-6 place-items-center rounded-md text-[11px] ${i === stopIndex ? 'bg-cyan-400 text-ink-950' : 'bg-white/8'}`}>{i + 1}</span>
            <Icon name={s.icon} className="relative size-4" />
            <span className="relative">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] xl:grid-cols-[1fr_380px]">
        {/* Captura con números */}
        <div className="border-b border-white/6 p-3 sm:p-5 lg:border-r lg:border-b-0">
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-[0_30px_60px_-30px_rgba(0,0,0,0.9)]">
            <div className="flex items-center gap-1.5 border-b border-white/8 bg-ink-900 px-3 py-2">
              <span className="size-2.5 rounded-full bg-rose-400/70" />
              <span className="size-2.5 rounded-full bg-amber-400/70" />
              <span className="size-2.5 rounded-full bg-emerald-400/70" />
              <span className="ml-2 truncate text-xs text-slate-400">FARMA PRO · {stop.image.title}</span>
              <button
                type="button"
                onClick={() => setZoom(0)}
                className="ml-auto inline-flex min-h-8 items-center gap-1.5 rounded-lg px-2 text-xs text-slate-400 hover:bg-white/8 hover:text-white"
              >
                <Expand className="size-3.5" aria-hidden="true" />
                <span className="hidden sm:inline">Ampliar</span>
              </button>
            </div>
            <div className="relative">
              <AnimatePresence mode="wait" initial={false}>
                <motion.img
                  key={stop.image.src}
                  src={asset(stop.image.src)}
                  alt={`${stop.image.title}: ${stop.intro}`}
                  width={1600}
                  height={900}
                  className="block w-full"
                  initial={{ opacity: 0, scale: 1.01 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
              {/* Foco sobre la parte elegida */}
              <motion.div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0"
                animate={{
                  background: `radial-gradient(circle at ${hotspot.x}% ${hotspot.y}%, rgba(7,10,24,0) 0%, rgba(7,10,24,0) 9%, rgba(7,10,24,0.55) 22%)`,
                }}
                transition={{ duration: 0.4, ease: 'easeOut' }}
              />
              {stop.hotspots.map((h, i) => (
                <button
                  key={`${stop.id}-${i}`}
                  type="button"
                  onClick={() => setSpot(i)}
                  aria-label={`${i + 1}. ${h.title}`}
                  aria-pressed={i === spot}
                  className="group absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ left: `${h.x}%`, top: `${h.y}%` }}
                >
                  {i === spot && <span className="absolute inset-0 animate-ping rounded-full bg-cyan-400/60" aria-hidden="true" />}
                  <span
                    className={`relative grid size-6 place-items-center rounded-full border-2 text-[11px] font-bold shadow-lg transition sm:size-8 sm:text-sm ${
                      i === spot
                        ? 'scale-110 border-white bg-gradient-to-br from-cyan-400 to-blue-600 text-white'
                        : 'border-white/90 bg-orange-500 text-white group-hover:scale-110'
                    }`}
                  >
                    {i + 1}
                  </span>
                </button>
              ))}
              {/* Globo con la explicación (pantallas grandes) */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${stop.id}-${spot}`}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="pointer-events-none absolute hidden w-64 rounded-xl border border-cyan-400/30 bg-ink-900/95 p-3 shadow-2xl backdrop-blur md:block"
                  style={{
                    left: hotspot.x > 60 ? undefined : `calc(${hotspot.x}% + 24px)`,
                    right: hotspot.x > 60 ? `calc(${100 - hotspot.x}% + 24px)` : undefined,
                    top: hotspot.y > 65 ? undefined : `calc(${hotspot.y}% - 12px)`,
                    bottom: hotspot.y > 65 ? `calc(${100 - hotspot.y}% - 12px)` : undefined,
                  }}
                >
                  <p className="text-sm font-semibold text-white">{spot + 1}. {hotspot.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-slate-300">{hotspot.text}</p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
          <p className="mt-3 flex items-center gap-2 text-xs text-slate-500">
            <MousePointerClick className="size-3.5 shrink-0" aria-hidden="true" />
            Toca los números para ver qué hace cada parte. {note}
          </p>
        </div>

        {/* Explicación */}
        <div className="flex flex-col p-5 sm:p-6">
          <AnimatePresence mode="wait">
            <motion.div key={stop.id} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }} transition={{ duration: 0.2 }}>
              <p className="text-xs font-semibold tracking-[0.16em] text-cyan-300 uppercase">Pantalla {stopIndex + 1} de {stops.length}</p>
              <h3 className="mt-1.5 font-display text-xl font-bold text-white">{stop.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-400">{stop.intro}</p>
            </motion.div>
          </AnimatePresence>

          <ol className="mt-5 space-y-1.5">
            {stop.hotspots.map((h, i) => (
              <li key={`${stop.id}-l-${i}`}>
                <button
                  type="button"
                  onClick={() => setSpot(i)}
                  aria-current={i === spot ? 'step' : undefined}
                  className={`flex w-full gap-3 rounded-xl border px-3 py-2.5 text-left transition ${
                    i === spot ? 'border-cyan-400/40 bg-cyan-400/10' : 'border-transparent hover:bg-white/5'
                  }`}
                >
                  <span className={`mt-0.5 grid size-6 shrink-0 place-items-center rounded-full text-xs font-bold ${i === spot ? 'bg-cyan-400 text-ink-950' : 'bg-orange-500/90 text-white'}`}>{i + 1}</span>
                  <span className="min-w-0">
                    <span className={`block text-sm font-semibold ${i === spot ? 'text-white' : 'text-slate-300'}`}>{h.title}</span>
                    <AnimatePresence initial={false}>
                      {i === spot && (
                        <motion.span
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="block overflow-hidden text-xs leading-relaxed text-slate-400"
                        >
                          <span className="block pt-1">{h.text}</span>
                        </motion.span>
                      )}
                    </AnimatePresence>
                  </span>
                </button>
              </li>
            ))}
          </ol>

          <div className="mt-auto flex items-center gap-2 pt-5">
            <button
              type="button"
              onClick={prev}
              disabled={isFirst}
              className="grid size-11 place-items-center rounded-xl border border-white/10 text-slate-300 transition hover:bg-white/5 disabled:opacity-30"
              aria-label="Anterior"
            >
              <ChevronLeft className="size-5" aria-hidden="true" />
            </button>
            <button
              type="button"
              onClick={next}
              disabled={isLast}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-600 to-cyan-500 px-4 text-sm font-semibold text-white transition hover:brightness-110 disabled:opacity-40"
            >
              {spot < stop.hotspots.length - 1 ? 'Siguiente' : isLast ? 'Fin del recorrido' : `Ir a ${stops[stopIndex + 1].label}`}
              <ChevronRight className="size-4" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>

      <Lightbox items={[stop.image]} index={zoom} onChange={setZoom} onClose={() => setZoom(null)} note={note} />
    </div>
  )
}
