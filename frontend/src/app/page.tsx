import { PublicHeader } from '../components/landing/PublicHeader';
import { PublicFooter } from '../components/landing/PublicFooter';
import { AnimatedBackground } from '../components/landing/AnimatedBackground';
import { HeroNew } from '../components/landing/HeroNew';
import { StatsSectionNew } from '../components/landing/StatsSectionNew';
import { EWasteFlowSection } from '../components/landing/EWasteFlowSection';
import { FeaturesGrid } from '../components/landing/FeaturesGrid';
import { HowItWorksStepper } from '../components/landing/HowItWorksStepper';
import { TechStackSection } from '../components/landing/TechStackSection';
import { ImpactIndiaSection } from '../components/landing/ImpactIndiaSection';
import { TrustSection } from '../components/landing/TrustSection';
import { FinalCTA } from '../components/landing/FinalCTA';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-eco-gradient text-white">
      <div className="relative min-h-screen">
        <AnimatedBackground />
        <PublicHeader />
        <main id="main-content" className="relative flex-1" tabIndex={-1}>
          <HeroNew />
          <StatsSectionNew />
          <EWasteFlowSection />
          <FeaturesGrid />
          <HowItWorksStepper />
          <TechStackSection />
          <ImpactIndiaSection />
          <TrustSection />
          <section className="min-h-[24vh] bg-[#0f1a2a]" aria-hidden />
          <FinalCTA />
          {/* Gradient divider between CTA and footer: eco → transparent → eco */}
          <div
            className="h-px w-full opacity-60"
            style={{
              background: 'linear-gradient(90deg, rgba(34,197,94,0.2) 0%, transparent 50%, rgba(34,197,94,0.2) 100%)',
            }}
            aria-hidden
          />
        </main>
        <PublicFooter />
      </div>
    </div>
  );
}
