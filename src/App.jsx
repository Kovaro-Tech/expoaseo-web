import FloatingWhatsApp from './components/FloatingWhatsApp'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Faq from './sections/Faq'
import FinalCta from './sections/FinalCta'
import Hero from './sections/Hero'
import HowItWorks from './sections/HowItWorks'
import RequestCta from './sections/RequestCta'
import Services from './sections/Services'
import TrustBar from './sections/TrustBar'
import WhyUs from './sections/WhyUs'

export default function App() {
  return (
    <>
      <Navbar />

      <main>
        <Hero />
        <TrustBar />
        <Services />
        <HowItWorks />
        <RequestCta />
        <WhyUs />
        <Faq />
        <FinalCta />
      </main>

      <Footer />
      <FloatingWhatsApp />
    </>
  )
}
