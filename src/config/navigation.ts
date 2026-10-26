import { Download, Headset, History, House, Info, LayoutGrid, Layers, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** true = solo se marca activo en la dirección exacta. */
  end?: boolean
}

/** Menú de la barra lateral. Para una pantalla nueva: agréguela aquí y en src/App.tsx. */
export const navigation: NavItem[] = [
  { to: '/', label: 'Inicio', icon: House, end: true },
  { to: '/sistemas', label: 'Catálogo de sistemas', icon: LayoutGrid },
  { to: '/categorias', label: 'Categorías', icon: Layers },
  { to: '/descargas', label: 'Descargas', icon: Download },
  { to: '/actualizaciones', label: 'Actualizaciones', icon: History },
  { to: '/nosotros', label: 'Nosotros', icon: Info },
  { to: '/contacto', label: 'Contacto y soporte', icon: Headset },
]
