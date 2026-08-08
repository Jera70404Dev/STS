import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'
import { BeamsBackground } from '../beams-background'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-white">
      <BeamsBackground intensity="subtle" />
      <div className="relative z-10">
        <ScrollToTop />
        <Header />
        <main>{children}</main>
        <Footer />
      </div>
    </div>
  )
}
