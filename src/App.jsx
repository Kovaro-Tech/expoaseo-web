import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Hero from './sections/Hero'
import Manifesto from './sections/Manifesto'
import RequestCta from './sections/RequestCta'
import Services from './sections/Services'
import WhyUs from './sections/WhyUs'

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <Manifesto />
        <Services />
        <RequestCta />
        <WhyUs />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
    </>
  )
}
