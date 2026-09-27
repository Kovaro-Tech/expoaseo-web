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
import LegalPage, { NotFound } from './pages/LegalPage'

export default function App({ path = window.location.pathname.replace(/\/$/, '') || '/' }) {
  const home = path === '/'
  return (
    <>
      <a href="#contenido" className="skip-link">Saltar al contenido</a>
      <Navbar home={home} />

      {/* Ritmo: vídeo → fotos reales → movimiento → catálogo → interacción →
          preguntas → invitación. Cada bloque es una experiencia distinta. */}
      <main id="contenido" tabIndex={-1}>
        {home ? <><Hero />
        <Experience />
        <Clients />
        <Services />
        <WorkInAction />
        <RequestCta />
        <Faq />
        <FinalCta /></> : ['/privacidad', '/cookies'].includes(path) ? <LegalPage path={path} /> : <NotFound />}
      </main>

      <Footer />
    </>
  )
}
