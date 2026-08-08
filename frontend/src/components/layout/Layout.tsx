import Header from './Header'
import Footer from './Footer'
import ScrollToTop from './ScrollToTop'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-ink-950 text-white">
      <ScrollToTop />
      <Header />
      <main>{children}</main>
      <Footer />
    </div>
  )
}
