/**
 * Estructura del catálogo. Cada sistema es un objeto con estos campos; la página arma sus pantallas a partir de
 * ellos, así que agregar un sistema nuevo no requiere tocar el diseño.
 *
 * En el futuro, un panel administrativo puede guardar estos mismos datos en un servicio en línea: basta con que
 * src/lib/catalog.ts los lea de allí en lugar de este archivo.
 */

/** Disponible = tiene instalador publicado. En desarrollo = se está construyendo. Próximamente = planificado. */
export type SystemStatus = 'disponible' | 'en-desarrollo' | 'proximamente'

export type CategoryId = 'salud' | 'gastronomia' | 'comercio' | 'ferreteria' | 'empresas' | 'otros'

/** Nombre de un icono (ver src/components/ui/Icon.tsx). */
export type IconKey =
  | 'pill' | 'utensils' | 'store' | 'shopping-cart' | 'wrench' | 'building' | 'sparkles' | 'scan' | 'boxes'
  | 'truck' | 'wallet' | 'chart' | 'tag' | 'hand-coins' | 'gift' | 'receipt' | 'users' | 'shield' | 'database'
  | 'smartphone' | 'refresh' | 'printer' | 'network' | 'flask' | 'calendar-x' | 'search' | 'clock' | 'lock'
  | 'monitor' | 'zap' | 'life-buoy' | 'layers' | 'file-text'

export interface Category {
  id: CategoryId
  name: string
  description: string
  icon: IconKey
}

export interface Screenshot {
  /** Ruta dentro de /public (sin la barra inicial). */
  src: string
  thumb: string
  title: string
  caption: string
}

/** Punto que se toca sobre una captura del recorrido. x e y en porcentaje del ancho y alto de la imagen. */
export interface TourHotspot {
  x: number
  y: number
  title: string
  text: string
}

/** Una parada del recorrido interactivo: una pantalla del programa con sus partes explicadas. */
export interface TourStop {
  id: string
  label: string
  icon: IconKey
  title: string
  intro: string
  image: Screenshot
  hotspots: TourHotspot[]
}

export interface DemoInfo {
  /** Datos de acceso de la demostración (ficticia, pública a propósito). */
  user: string
  password: string
  trialDays: number
  steps: { title: string; text: string }[]
  points: string[]
  image?: Screenshot
}

export interface Plan {
  id: string
  name: string
  /** Precio en soles. */
  price: number
  /** Texto junto al precio: «/ mes», «/ año», «pago único». */
  period: string
  description: string
  badge?: string
  highlight?: boolean
  features: string[]
}

export interface Feature {
  icon: IconKey
  title: string
  text: string
}

export interface DownloadFile {
  label: string
  /** Nombre exacto del archivo en GitHub Releases. */
  fileName: string
  kind: 'installer' | 'zip' | 'pdf' | 'text'
  description: string
}

export interface DownloadConfig {
  /** Repositorio público donde se publican las versiones (GitHub Releases). */
  github: { owner: string; repo: string }
  /** Archivo principal del botón «Descargar». */
  primary: DownloadFile
  /** Otros archivos de la versión (manuales, verificación…). */
  extras: DownloadFile[]
  /** Datos conocidos de la última versión, por si GitHub no responde. */
  fallback: { version: string; date: string; sizeBytes?: number }
  /** Advertencias que el cliente debe leer antes de instalar. */
  warnings: string[]
  /** Si el sistema solo tuviera código fuente público (sin instalador), su enlace va aquí. */
  sourceUrl?: string
}

export interface DocLink {
  label: string
  description: string
  /** Archivo de la última versión en GitHub Releases, o una dirección completa (https://…). */
  fileName?: string
  href?: string
}

export interface SoftwareSystem {
  slug: string
  name: string
  fullName: string
  tagline: string
  /** Una o dos frases para las tarjetas del catálogo. */
  summary: string
  /** Párrafos de la pantalla de detalle. */
  description: string[]
  category: CategoryId
  /** Tipos de negocio a los que va dirigido (se usan en el buscador). */
  businessTypes: string[]
  status: SystemStatus
  featured?: boolean
  icon: IconKey
  /** Color principal de su pantalla. */
  accent: 'blue' | 'cyan' | 'violet' | 'emerald' | 'amber'
  /** Puntos clave para la tarjeta del catálogo (3 o 4). */
  highlights: string[]
  heroImage?: Screenshot
  /** true = capturas reales del programa. false = imágenes ilustrativas (se rotulan como tales). */
  screenshotsAreReal: boolean
  screenshotsNote?: string
  gallery: Screenshot[]
  /** Recorrido interactivo por las pantallas principales. */
  tour?: TourStop[]
  demo?: DemoInfo
  plans?: Plan[]
  /** Aclaraciones bajo los planes (moneda, cómo activar…). */
  plansNotes?: string[]
  problems: { title: string; text: string }[]
  features: Feature[]
  modules: string[]
  requirements: { label: string; value: string }[]
  operatingSystems: string[]
  database?: string
  installSteps: { title: string; text: string }[]
  installTime?: string
  docs: DocLink[]
  faq: { q: string; a: string }[]
  download?: DownloadConfig
  /** Texto para el mensaje de WhatsApp «Quiero información de…». */
  whatsappMessage: string
}
