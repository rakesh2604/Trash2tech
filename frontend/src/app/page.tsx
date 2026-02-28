import { PublicHeader } from '../components/landing/PublicHeader';
import { PublicFooter } from '../components/landing/PublicFooter';
import { Hero } from '../components/landing/Hero';
import { StatsSection } from '../components/landing/StatsSection';
import { MeetPartnerSection } from '../components/landing/MeetPartnerSection';
import { HowItWorks } from '../components/landing/HowItWorks';
import { VideoSection } from '../components/landing/VideoSection';
import { TestimonialsSection } from '../components/landing/TestimonialsSection';
import { WhyIndiaSection } from '../components/landing/WhyIndiaSection';
import { PricingSection } from '../components/landing/PricingSection';
import { BookPickupCTA } from '../components/landing/BookPickupCTA';
import { DataAndReports } from '../components/landing/DataAndReports';
import { ImpactSection } from '../components/landing/ImpactSection';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900">
      <PublicHeader />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        <Hero />
        <StatsSection />
        <MeetPartnerSection />
        <HowItWorks />
        <VideoSection />
        <TestimonialsSection />
        <WhyIndiaSection />
        <PricingSection />
        <BookPickupCTA />
        <DataAndReports />
        <ImpactSection />
      </main>
      <PublicFooter />
    </div>
  );
}
