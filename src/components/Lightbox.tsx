import { useCallback, useEffect, useRef } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { Screenshot } from '../data/types'
import { asset } from '../lib/format'

/** Visor de capturas a pantalla completa: flechas del teclado para avanzar y Esc para cerrar. */
export function Lightbox({ items, index, onChange, onClose, note }: { items: Screenshot[]; index: number | null; onChange: (i: number) => void; onClose: () => void; note?: string }) {
  const closeRef = useRef<HTMLButtonElement>(null)
  const open = index !== null
  const move = useCallback(
    (delta: number) => index !== null && onChange((index + delta + items.length) % items.length),
    [index, items.length, onChange],
  )

  useEffect(() => {
    if (!open) return
    const previous = document.activeElement as HTMLElement | null
    closeRef.current?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      else if (e.key === 'ArrowRight') move(1)
      else if (e.key === 'ArrowLeft') move(-1)
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      previous?.focus()
    }
  }, [open, move, onClose])

  const item = index !== null ? items[index] : null

  return (
    <AnimatePresence>
      {item && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Captura: ${item.title}`}
          className="fixed inset-0 z-[70] flex flex-col bg-ink-950/95 backdrop-blur-md"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <div className="flex items-center justify-between gap-4 px-4 py-3 sm:px-6" onClick={(e) => e.stopPropagation()}>
            <p className="min-w-0 text-sm">
              <span className="font-semibold text-white">{item.title}</span>
              <span className="ml-2 text-slate-500">{index! + 1} / {items.length}</span>
            </p>
            <button
              ref={closeRef}
              type="button"
              onClick={onClose}
              className="grid size-11 place-items-center rounded-xl text-slate-300 hover:bg-white/10 hover:text-white"
              aria-label="Cerrar"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-16">
            <AnimatePresence mode="wait">
              <motion.img
                key={item.src}
                src={asset(item.src)}
                alt={`${item.title}: ${item.caption}`}
                className="max-h-full max-w-full rounded-xl border border-white/10 object-contain shadow-2xl"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                onClick={(e) => e.stopPropagation()}
              />
            </AnimatePresence>
            {items.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(-1)
                  }}
                  className="absolute left-2 grid size-11 place-items-center rounded-full border border-white/10 bg-ink-850/80 text-white hover:bg-ink-700 sm:left-4"
                  aria-label="Captura anterior"
                >
                  <ChevronLeft className="size-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    move(1)
                  }}
                  className="absolute right-2 grid size-11 place-items-center rounded-full border border-white/10 bg-ink-850/80 text-white hover:bg-ink-700 sm:right-4"
                  aria-label="Captura siguiente"
                >
                  <ChevronRight className="size-5" aria-hidden="true" />
                </button>
              </>
            )}
          </div>
          <div className="px-4 py-4 text-center sm:px-6" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm text-slate-300">{item.caption}</p>
            {note && <p className="mt-1 text-xs text-slate-500">{note}</p>}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
