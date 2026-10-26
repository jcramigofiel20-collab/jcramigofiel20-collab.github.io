import { motion, useReducedMotion } from 'motion/react'
import { BarChart3, Boxes, ReceiptText, ShieldCheck } from 'lucide-react'

/**
 * Ilustración decorativa (no es una captura de ningún programa): ventanas flotantes con un panel de control,
 * un inventario y un comprobante, dibujadas con formas.
 */
export function HeroIllustration() {
  const reduce = useReducedMotion()
  const enter = (delay: number) => ({
    initial: reduce ? false : { opacity: 0, y: 24, scale: 0.97 },
    animate: { opacity: 1, y: 0, scale: 1 },
    transition: { duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] as const },
  })
  const bars = [38, 56, 44, 70, 52, 84, 66]

  return (
    <div className="relative mx-auto aspect-[5/4] w-full max-w-[560px]" aria-hidden="true">
      <div className="absolute inset-8 rounded-full bg-gradient-to-tr from-blue-600/30 via-cyan-500/15 to-violet-600/30 blur-3xl" />

      {/* Ventana principal: panel de control */}
      <motion.div {...enter(0.1)} className="absolute top-[8%] left-[4%] w-[78%]">
        <div className="animate-float-slow rounded-2xl border border-white/12 bg-ink-850/90 shadow-[0_40px_80px_-30px_rgba(0,0,0,0.8)] backdrop-blur">
          <div className="flex items-center gap-1.5 border-b border-white/8 px-4 py-2.5">
            <span className="size-2.5 rounded-full bg-rose-400/70" />
            <span className="size-2.5 rounded-full bg-amber-400/70" />
            <span className="size-2.5 rounded-full bg-emerald-400/70" />
            <span className="ml-3 h-2 w-24 rounded-full bg-white/10" />
          </div>
          <div className="flex">
            <div className="hidden w-[22%] space-y-2 border-r border-white/6 p-3 sm:block">
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <span key={i} className={`block h-2 rounded-full ${i === 1 ? 'bg-cyan-400/60' : 'bg-white/8'}`} />
              ))}
            </div>
            <div className="flex-1 space-y-3 p-4">
              <div className="grid grid-cols-3 gap-2">
                {['from-blue-600 to-blue-500', 'from-emerald-600 to-emerald-500', 'from-violet-600 to-violet-500'].map((g) => (
                  <div key={g} className={`rounded-lg bg-gradient-to-br ${g} p-2.5`}>
                    <span className="block h-1.5 w-10 rounded-full bg-white/50" />
                    <span className="mt-2 block h-2.5 w-14 rounded-full bg-white/90" />
                  </div>
                ))}
              </div>
              <div className="rounded-lg border border-white/6 bg-white/[0.03] p-3">
                <div className="mb-2 flex items-center gap-2 text-[10px] text-slate-400">
                  <BarChart3 className="size-3.5 text-cyan-300" />
                  <span className="h-1.5 w-16 rounded-full bg-white/15" />
                </div>
                <div className="flex h-20 items-end gap-2">
                  {bars.map((h, i) => (
                    <motion.span
                      key={i}
                      className={`flex-1 rounded-t ${i === bars.length - 2 ? 'bg-gradient-to-t from-blue-600 to-cyan-400' : 'bg-blue-500/35'}`}
                      initial={reduce ? false : { height: 0 }}
                      animate={{ height: `${h}%` }}
                      transition={{ duration: 0.8, delay: 0.5 + i * 0.06, ease: 'easeOut' }}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Inventario */}
      <motion.div {...enter(0.3)} className="absolute right-[2%] bottom-[10%] w-[46%]">
        <div className="animate-float rounded-2xl border border-white/12 bg-ink-800/90 p-3.5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur [animation-delay:-2s]">
          <div className="mb-2.5 flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-cyan-500/20 text-cyan-300">
              <Boxes className="size-4" />
            </span>
            <span className="h-2 w-20 rounded-full bg-white/20" />
          </div>
          {['bg-emerald-400', 'bg-amber-400', 'bg-emerald-400', 'bg-rose-400'].map((dot, i) => (
            <div key={i} className="flex items-center gap-2 border-t border-white/6 py-1.5">
              <span className={`size-1.5 rounded-full ${dot}`} />
              <span className="h-1.5 flex-1 rounded-full bg-white/10" />
              <span className="h-1.5 w-6 rounded-full bg-white/20" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Comprobante */}
      <motion.div {...enter(0.45)} className="absolute bottom-[4%] left-[6%] w-[34%]">
        <div className="animate-float rounded-2xl border border-white/12 bg-ink-800/90 p-3.5 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.8)] backdrop-blur [animation-delay:-4s]">
          <div className="mb-2 flex items-center gap-2">
            <span className="grid size-7 place-items-center rounded-lg bg-violet-500/20 text-violet-300">
              <ReceiptText className="size-4" />
            </span>
            <span className="h-2 w-12 rounded-full bg-white/20" />
          </div>
          <span className="block h-1.5 w-full rounded-full bg-white/10" />
          <span className="mt-1.5 block h-1.5 w-4/5 rounded-full bg-white/10" />
          <span className="mt-3 block h-2.5 w-1/2 rounded-full bg-gradient-to-r from-violet-400 to-cyan-300" />
        </div>
      </motion.div>

      {/* Sello de seguridad */}
      <motion.div {...enter(0.6)} className="absolute top-[2%] right-[6%]">
        <div className="animate-float flex items-center gap-2 rounded-full border border-emerald-400/25 bg-ink-850/90 px-3 py-2 shadow-xl backdrop-blur [animation-delay:-1s]">
          <ShieldCheck className="size-4 text-emerald-300" />
          <span className="h-1.5 w-14 rounded-full bg-emerald-300/50" />
        </div>
      </motion.div>
    </div>
  )
}
