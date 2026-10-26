import {
  Boxes, Building2, CalendarX, ChartColumn, Clock, Database, FileText, FlaskConical, Gift, HandCoins, Layers,
  LifeBuoy, Lock, Monitor, Network, Pill, Printer, Receipt, RefreshCw, ScanBarcode, Search, ShieldCheck,
  ShoppingCart, Smartphone, Sparkles, Store, Tag, Truck, Users, Utensils, Wallet, Wrench, Zap,
  type LucideIcon, type LucideProps,
} from 'lucide-react'
import type { IconKey } from '../../data/types'

const icons: Record<IconKey, LucideIcon> = {
  pill: Pill,
  utensils: Utensils,
  store: Store,
  'shopping-cart': ShoppingCart,
  wrench: Wrench,
  building: Building2,
  sparkles: Sparkles,
  scan: ScanBarcode,
  boxes: Boxes,
  truck: Truck,
  wallet: Wallet,
  chart: ChartColumn,
  tag: Tag,
  'hand-coins': HandCoins,
  gift: Gift,
  receipt: Receipt,
  users: Users,
  shield: ShieldCheck,
  database: Database,
  smartphone: Smartphone,
  refresh: RefreshCw,
  printer: Printer,
  network: Network,
  flask: FlaskConical,
  'calendar-x': CalendarX,
  search: Search,
  clock: Clock,
  lock: Lock,
  monitor: Monitor,
  zap: Zap,
  'life-buoy': LifeBuoy,
  layers: Layers,
  'file-text': FileText,
}

/** Icono del catálogo por nombre (los datos guardan el nombre, no el componente). */
export function Icon({ name, ...props }: { name: IconKey } & LucideProps) {
  const Component = icons[name]
  return <Component aria-hidden="true" {...props} />
}
