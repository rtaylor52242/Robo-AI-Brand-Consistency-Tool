
import React, { useState, useEffect, useCallback } from 'react';
import { BusinessDNA, CampaignIdea, Creative } from '../types';
import { generateCreative } from '../services/geminiService';
import CreativeCard from './CreativeCard';
import Loader from './Loader';

interface CreativeGenerationStepProps {
  businessDNA: BusinessDNA;
  campaign: CampaignIdea;
  onRestart: () => void;
}

type SizePreset = 'Square' | 'Story' | 'Banner';
const SIZES: SizePreset[] = ['Square', 'Story', 'Banner'];

const CreativeGenerationStep: React.FC<CreativeGenerationStepProps> = ({ businessDNA, campaign, onRestart }) => {
  const [creatives, setCreatives] = useState<Creative[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<SizePreset>('Square');

  const fetchCreatives = useCallback(async (count: number) => {
    count > 1 ? setIsLoading(true) : setIsAdding(true);
    setError(null);
    try {
      const newCreativesPromises = Array.from({ length: count }).map(() =>
        generateCreative(campaign, businessDNA, selectedSize)
      );
      const newCreatives = await Promise.all(newCreativesPromises);
      if (count > 1) {
        setCreatives(newCreatives);
      } else {
        setCreatives(prev => [...prev, ...newCreatives]);
      }
    } catch (err) {
      setError('Failed to generate creatives. Please try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
      setIsAdding(false);
    }
  }, [campaign, businessDNA, selectedSize]);

  useEffect(() => {
    fetchCreatives(3);
  }, [fetchCreatives]);

  const handleAddCreative = () => {
    fetchCreatives(1);
  };
  
  const handleSizeChange = (size: SizePreset) => {
    setSelectedSize(size);
    setCreatives([]);
    fetchCreatives(3);
  }

  return (
    <div className="animate-fade-in">
      <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">"{campaign.headline}"</h2>
              <p className="mt-1 text-gray-600">Creatives for your campaign. Download or generate more.</p>
            </div>
             <button
                onClick={onRestart}
                className="mt-4 md:mt-0 inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md shadow-sm text-gray-700 bg-white hover:bg-gray-50"
             >
                Start Over
             </button>
        </div>
        <div className="mt-6 flex items-center space-x-2">
            <span className="font-medium text-gray-700">Size:</span>
            {SIZES.map(size => (
                 <button key={size} onClick={() => handleSizeChange(size)} disabled={isLoading}
                    className={`px-3 py-1 text-sm font-medium rounded-full ${selectedSize === size ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'} transition-colors disabled:opacity-50`}
                 >
                    {size}
                 </button>
            ))}
        </div>
      </div>
      
      <div className="mt-8">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm min-h-[400px]">
            <Loader />
            <p className="mt-4 text-gray-600">Generating your on-brand creatives...</p>
          </div>
        ) : error ? (
           <div className="text-center p-8 bg-white rounded-lg border border-gray-200 shadow-sm">
             <p className="text-red-600">{error}</p>
           </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {creatives.map((creative) => (
              <CreativeCard key={creative.id} creative={creative} businessDNA={businessDNA} />
            ))}
             <div className="flex items-center justify-center min-h-[400px] bg-gray-100 rounded-lg border-2 border-dashed border-gray-300">
                <button 
                  onClick={handleAddCreative}
                  disabled={isAdding}
                  className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                >
                  {isAdding ? <Loader/> : <><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" /></svg> Add Creative</>}
                </button>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreativeGenerationStep;
