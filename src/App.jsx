import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Clients from './sections/Clients'
import Experience from './sections/Experience'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Hero from './sections/Hero'
import RequestCta from './sections/RequestCta'
import Services from './sections/Services'
import WorkInAction from './sections/WorkInAction'

export default function App() {
  return (
    <>
      <Navbar />

      {/* Ritmo: vídeo → fotos reales → movimiento → catálogo → interacción →
          preguntas → invitación. Cada bloque es una experiencia distinta. */}
      <main>
        <Hero />
        <Experience />
        <Clients />
        <Services />
        <WorkInAction />
        <RequestCta />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}
