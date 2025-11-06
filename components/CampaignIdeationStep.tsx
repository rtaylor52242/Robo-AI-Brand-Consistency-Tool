
import React, { useState, useEffect } from 'react';
import { BusinessDNA, CampaignIdea } from '../types';
import { generateCampaignIdeas } from '../services/geminiService';
import Loader from './Loader';

interface CampaignIdeationStepProps {
  businessDNA: BusinessDNA;
  onCampaignSelected: (campaign: CampaignIdea) => void;
}

const CampaignIdeationStep: React.FC<CampaignIdeationStepProps> = ({ businessDNA, onCampaignSelected }) => {
  const [ideas, setIdeas] = useState<CampaignIdea[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaigns = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedIdeas = await generateCampaignIdeas(businessDNA);
      setIdeas(generatedIdeas);
    } catch (err) {
      setError('Failed to generate campaign ideas. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCampaigns();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [businessDNA]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm min-h-[300px]">
        <Loader />
        <p className="mt-4 text-gray-600">Generating campaign ideas based on your Business DNA...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchCampaigns}
          className="mt-4 px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">Campaign Ideas</h2>
        <p className="mt-2 text-gray-600 max-w-2xl mx-auto">Here are some campaign ideas tailored to <span className="font-semibold text-indigo-600">{businessDNA.name}</span>. Select one to start generating creatives.</p>
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {ideas.map((idea, index) => (
          <div key={index} className="flex flex-col p-6 bg-gray-50 rounded-lg border border-gray-200 hover:shadow-lg hover:border-indigo-400 transition-all duration-300">
            <h3 className="text-xl font-bold text-gray-800">{idea.headline}</h3>
            <p className="mt-2 text-gray-600 flex-grow">{idea.description}</p>
            <button
              onClick={() => onCampaignSelected(idea)}
              className="mt-4 self-start inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Generate Creatives
            </button>
          </div>
        ))}
      </div>
      
       <div className="mt-8 text-center">
         <button onClick={fetchCampaigns} className="text-indigo-600 font-semibold hover:text-indigo-800 transition-colors">
            Generate New Ideas
         </button>
       </div>
    </div>
  );
};

export default CampaignIdeationStep;
