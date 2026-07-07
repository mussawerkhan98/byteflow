import Hero from './components/Hero'
import Services from './components/Services'
import AboutUs from './components/AboutUs'
import Reviews from './components/Reviews'
import HowItWorks from './components/HowItWorks'
import Blog from './components/Blog'
import FAQ from './components/FAQ'
import CTA from './components/CTA'
import Contact from './components/Contact'

export default function Home() {
  return (
    <>
      <Hero />
      <Services />
      <AboutUs />
      <HowItWorks />
      <Blog />
      <FAQ />
      <Reviews />
      <CTA />
      <Contact />
    </>
  )
}
