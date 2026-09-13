import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Clients from './sections/Clients'
import Experience from './sections/Experience'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Hero from './sections/Hero'
import RequestCta from './sections/RequestCta'
import Services from './sections/Services'

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        {/* La prueba real va inmediatamente después de la portada. */}
        <Experience />
        <Services />
        <RequestCta />
        <Clients />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}