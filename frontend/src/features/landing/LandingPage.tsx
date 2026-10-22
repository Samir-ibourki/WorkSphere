import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { Footer } from '../../components/layout/Footer';
import { HeroSection } from './HeroSection';
import { ValueStrip } from './ValueStrip';
import { ProblemSolutionSection } from './ProblemSolutionSection';
import { FeaturesSection } from './FeaturesSection';
import { InteractivePreview } from './InteractivePreview';
import { HowItWorksSection } from './HowItWorksSection';
import { FinalCTASection } from './FinalCTASection';

export const LandingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] text-zinc-900 antialiased selection:bg-blue-600 selection:text-white overflow-x-hidden">
      <Navbar />
      <main>
        <HeroSection />
        <ValueStrip />
        <ProblemSolutionSection />
        <FeaturesSection />
        <InteractivePreview />
        <HowItWorksSection />
        <FinalCTASection />
      </main>
      <Footer />
    </div>
  );
};

export default LandingPage;
