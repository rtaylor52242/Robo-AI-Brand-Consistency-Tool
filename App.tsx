
import React, { useState, useCallback } from 'react';
import { BusinessDNA, CampaignIdea } from './types';
import BusinessDnaStep from './components/BusinessDnaStep';
import CampaignIdeationStep from './components/CampaignIdeationStep';
import CreativeGenerationStep from './components/CreativeGenerationStep';
import Header from './components/Header';
import StepWizard from './components/StepWizard';

export enum AppStep {
  DNA_INPUT,
  CAMPAIGN_IDEATION,
  CREATIVE_GENERATION,
}

const App: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>(AppStep.DNA_INPUT);
  const [businessDNA, setBusinessDNA] = useState<BusinessDNA | null>(null);
  const [selectedCampaign, setSelectedCampaign] = useState<CampaignIdea | null>(null);

  const handleDnaGenerated = useCallback((dna: BusinessDNA) => {
    setBusinessDNA(dna);
    setCurrentStep(AppStep.CAMPAIGN_IDEATION);
  }, []);

  const handleCampaignSelected = useCallback((campaign: CampaignIdea) => {
    setSelectedCampaign(campaign);
    setCurrentStep(AppStep.CREATIVE_GENERATION);
  }, []);
  
  const handleRestart = useCallback(() => {
    setCurrentStep(AppStep.DNA_INPUT);
    setBusinessDNA(null);
    setSelectedCampaign(null);
  }, []);

  const renderStep = () => {
    switch (currentStep) {
      case AppStep.DNA_INPUT:
        return <BusinessDnaStep onDnaGenerated={handleDnaGenerated} />;
      case AppStep.CAMPAIGN_IDEATION:
        if (!businessDNA) return null;
        return <CampaignIdeationStep businessDNA={businessDNA} onCampaignSelected={handleCampaignSelected} />;
      case AppStep.CREATIVE_GENERATION:
        if (!businessDNA || !selectedCampaign) return null;
        return <CreativeGenerationStep businessDNA={businessDNA} campaign={selectedCampaign} onRestart={handleRestart} />;
      default:
        return <BusinessDnaStep onDnaGenerated={handleDnaGenerated} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans text-gray-900">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <StepWizard currentStep={currentStep} />
        <div className="mt-8">
          {renderStep()}
        </div>
      </main>
    </div>
  );
};

export default App;
