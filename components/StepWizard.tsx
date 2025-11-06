
import React from 'react';
import { AppStep } from '../App';

interface StepWizardProps {
  currentStep: AppStep;
}

const Step: React.FC<{ step: number; title: string; active: boolean; done: boolean }> = ({ step, title, active, done }) => {
  const getStepClasses = () => {
    if (active) {
      return 'bg-indigo-600 text-white';
    }
    if (done) {
      return 'bg-green-500 text-white';
    }
    return 'bg-gray-200 text-gray-500';
  };
  
  const getTextClasses = () => {
    if (active || done) {
      return 'text-gray-800 font-semibold';
    }
    return 'text-gray-500';
  };

  return (
    <div className="flex items-center">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${getStepClasses()}`}>
        {done ? <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> : step}
      </div>
      <span className={`ml-3 text-sm md:text-base ${getTextClasses()}`}>{title}</span>
    </div>
  );
};

const StepWizard: React.FC<StepWizardProps> = ({ currentStep }) => {
  const steps = [
    { id: AppStep.DNA_INPUT, title: 'Generate Business DNA' },
    { id: AppStep.CAMPAIGN_IDEATION, title: 'Campaign Ideation' },
    { id: AppStep.CREATIVE_GENERATION, title: 'Generate Creatives' },
  ];
  
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      {steps.map((s, index) => (
        <React.Fragment key={s.id}>
          <Step
            step={index + 1}
            title={s.title}
            active={index === currentStepIndex}
            done={index < currentStepIndex}
          />
          {index < steps.length - 1 && <div className="flex-1 h-0.5 bg-gray-200 mx-4 md:mx-8"></div>}
        </React.Fragment>
      ))}
    </div>
  );
};

export default StepWizard;
