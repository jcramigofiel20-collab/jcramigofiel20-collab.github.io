import { lazy } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router'
import { MotionConfig } from 'motion/react'
import { AppLayout } from './components/layout/AppLayout'
import Home from './pages/Home'

// El inicio se carga de inmediato; las demás pantallas, cuando se visitan.
const Catalog = lazy(() => import('./pages/Catalog'))
const SystemDetail = lazy(() => import('./pages/SystemDetail'))
const Categories = lazy(() => import('./pages/Categories'))
const Downloads = lazy(() => import('./pages/Downloads'))
const Updates = lazy(() => import('./pages/Updates'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const NotFound = lazy(() => import('./pages/NotFound'))

/** Rutas de la página. Cada pantalla tiene su propia dirección. */
const router = createBrowserRouter(
  [
    {
      element: <AppLayout />,
      children: [
        { index: true, element: <Home /> },
        { path: 'sistemas', element: <Catalog /> },
        { path: 'sistemas/:slug', element: <SystemDetail /> },
        { path: 'categorias', element: <Categories /> },
        { path: 'descargas', element: <Downloads /> },
        { path: 'actualizaciones', element: <Updates /> },
        { path: 'nosotros', element: <About /> },
        { path: 'contacto', element: <Contact /> },
        { path: '*', element: <NotFound /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL.replace(/\/$/, '') || '/' },
)

export default function App() {
  return (
    <MotionConfig reducedMotion="user">
      <RouterProvider router={router} />
    </MotionConfig>
  )
}
