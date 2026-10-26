import type { Category } from './types.ts'

/** Tipos de negocio. Una categoría sin sistemas publicados se muestra como «Próximamente». */
export const categories: Category[] = [
  {
    id: 'salud',
    name: 'Farmacias y boticas',
    description: 'Ventas, inventario por lotes y vencimientos, caja y reportes para el sector salud.',
    icon: 'pill',
  },
  {
    id: 'gastronomia',
    name: 'Restaurantes y pollerías',
    description: 'Atención de mesas, pedidos para cocina, caja y control de insumos.',
    icon: 'utensils',
  },
  {
    id: 'comercio',
    name: 'Tiendas y minimarkets',
    description: 'Punto de venta, inventario y compras para el comercio del día a día.',
    icon: 'store',
  },
  {
    id: 'ferreteria',
    name: 'Ferreterías',
    description: 'Catálogos amplios, unidades de medida y ventas al por mayor y menor.',
    icon: 'wrench',
  },
  {
    id: 'empresas',
    name: 'Gestión empresarial',
    description: 'Herramientas administrativas y de control para empresas.',
    icon: 'building',
  },
  {
    id: 'otros',
    name: 'Otros sistemas',
    description: 'Nuevas soluciones que se irán sumando al catálogo.',
    icon: 'sparkles',
  },
]
