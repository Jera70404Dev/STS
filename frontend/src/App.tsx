import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Home from './pages/Home'
import About from './pages/About'
import Fleet from './pages/Fleet'
import Chauffeurs from './pages/Chauffeurs'
import Services from './pages/Services'
import Reserve from './pages/Reserve'
import Confirmation from './pages/Confirmation'
import Privacy from './pages/Privacy'
import Terms from './pages/Terms'
import Login from './pages/Login'
import NotFound from './pages/NotFound'
import { Spinner } from './components/ui'

const Admin = lazy(() => import('./pages/Admin'))

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/fleet" element={<Fleet />} />
        <Route path="/chauffeurs" element={<Chauffeurs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/reserve" element={<Reserve />} />
        <Route path="/confirmacion" element={<Confirmation />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/admin/login" element={<Login />} />
        <Route
          path="/admin"
          element={
            <Suspense
              fallback={
                <div className="flex justify-center py-32 text-gold-400">
                  <Spinner className="h-8 w-8" />
                </div>
              }
            >
              <Admin />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  )
}
