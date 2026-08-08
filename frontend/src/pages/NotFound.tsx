import { Link } from 'react-router-dom'
import { Button } from '../components/ui'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-display text-7xl font-semibold text-gold-400">404</p>
        <h1 className="mt-4 font-display text-3xl font-semibold text-white">Page not found</h1>
        <p className="mt-3 text-ink-400">
          The page you’re looking for doesn’t exist or has moved.
        </p>
        <Link to="/" className="mt-8 inline-block">
          <Button>Back to Home</Button>
        </Link>
      </div>
    </div>
  )
}
