/** Fondo decorativo: cuadrícula tenue y luces de color que se desplazan muy despacio (solo CSS, sin costo de rendimiento). */
export function Background() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(1200px_600px_at_70%_-10%,rgba(37,99,235,0.18),transparent_60%)]" />
      <div className="grid-bg absolute inset-0" />
      <div className="absolute -top-40 -left-32 size-[520px] animate-drift rounded-full bg-blue-600/20 blur-[120px]" />
      <div className="absolute top-1/3 -right-40 size-[480px] animate-drift rounded-full bg-violet-600/15 blur-[130px] [animation-delay:-8s]" />
      <div className="absolute -bottom-48 left-1/3 size-[460px] animate-drift rounded-full bg-cyan-500/10 blur-[120px] [animation-delay:-16s]" />
    </div>
  )
}
