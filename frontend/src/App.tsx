import { Link, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Confirmation from './pages/Confirmation'
import Login from './pages/Login'
import Admin from './pages/Admin'

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="bg-brand-700 text-white shadow">
        <nav className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <Link to="/" className="text-xl font-bold tracking-tight">
            🚐 Transport Agency
          </Link>
          <div className="flex items-center gap-4 text-sm">
            <Link to="/" className="hover:text-brand-100">
              Reservar
            </Link>
            <Link to="/admin/login" className="hover:text-brand-100">
              Administración
            </Link>
          </div>
        </nav>
      </header>
      <main>{children}</main>
      <footer className="border-t bg-white py-8 text-center text-sm text-slate-500">
        <div className="mx-auto max-w-6xl px-4">
          © {new Date().getFullYear()} Transport Agency · Servicio de transporte por todo Estados
          Unidos
        </div>
      </footer>
    </div>
  )
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/confirmacion" element={<Confirmation />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="/admin" element={<Admin />} />
        <Route
          path="*"
          element={
            <div className="mx-auto max-w-6xl px-4 py-20 text-center">
              <h1 className="text-3xl font-bold">Página no encontrada</h1>
              <Link to="/" className="mt-4 inline-block text-brand-600 underline">
                Volver al inicio
              </Link>
            </div>
          }
        />
      </Routes>
    </Layout>
  )
}
