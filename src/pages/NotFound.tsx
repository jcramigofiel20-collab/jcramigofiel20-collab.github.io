import { ArrowLeft, LayoutGrid } from 'lucide-react'
import { ButtonLink } from '../components/ui/primitives'

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
      <p className="font-display text-7xl font-extrabold text-gradient sm:text-8xl">404</p>
      <h1 className="mt-4 font-display text-2xl font-bold text-white">Esta página no existe</h1>
      <p className="mt-2 max-w-md text-slate-400">Puede que la dirección esté mal escrita o que el contenido se haya movido.</p>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <ButtonLink to="/">
          <ArrowLeft className="size-4" aria-hidden="true" />
          Volver al inicio
        </ButtonLink>
        <ButtonLink to="/sistemas" variant="secondary">
          <LayoutGrid className="size-4" aria-hidden="true" />
          Ver sistemas
        </ButtonLink>
      </div>
    </div>
  )
}
