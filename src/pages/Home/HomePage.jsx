import { IconContext } from '../../components/commons/IconsPhosphor';
import { Navbar } from '../../components/home/Navbar';
import { Hero } from '../../components/home/Hero';
import { BentoFeatures } from '../../components/home/BentoFeatures';
import { Categories } from '../../components/home/Categories';
import { HowItWorks } from '../../components/home/HowItWorks';
import { SecurityEscrow } from '../../components/home/SecurityEscrow';
import { Testimonials } from '../../components/home/Testimonials';
import { ProviderCTA } from '../../components/home/ProviderCTA';
import { Footer } from '../../components/home/Footer';

export default function HomePage() {
  return (
    <IconContext.Provider value={{ size: 20, weight: 'regular' }}>
      <div className="min-h-[100dvh] bg-surface font-body text-sl-900">
        <Navbar />
        <main>
          <Hero />
          <BentoFeatures />
          <Categories />
          <HowItWorks />
          <SecurityEscrow />
          <Testimonials />
          <ProviderCTA />
        </main>
        <Footer />
      </div>
    </IconContext.Provider>
  );
}

