
import React, { useState } from 'react';
import { BusinessDNA } from '../types';
import { generateBusinessDna } from '../services/geminiService';
import Loader from './Loader';

interface BusinessDnaStepProps {
  onDnaGenerated: (dna: BusinessDNA) => void;
}

const ColorPalette: React.FC<{ colors: string[] }> = ({ colors }) => (
  <div className="flex space-x-2">
    {colors.map((color) => (
      <div key={color} className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color }}></div>
    ))}
  </div>
);

const BusinessDnaStep: React.FC<BusinessDnaStepProps> = ({ onDnaGenerated }) => {
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [dna, setDna] = useState<BusinessDNA | null>(null);

  const handleScan = async () => {
    if (!url) {
      setError('Please enter a website URL.');
      return;
    }
    setError(null);
    setIsLoading(true);
    setDna(null);
    try {
      const generatedDna = await generateBusinessDna(url);
      setDna(generatedDna);
    } catch (err) {
      setError('Failed to analyze the website. Please check the URL or try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
       <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center max-w-2xl mx-auto min-h-[300px] flex flex-col justify-center items-center">
        <Loader className="h-10 w-10 text-indigo-600" />
        <h2 className="text-2xl font-bold text-gray-800 mt-4">Generating your Business DNA</h2>
        <p className="mt-2 text-gray-600">Our AI is analyzing your brand, generating a logo, and creating imagery. This might take a minute...</p>
      </div>
    );
  }

  if (dna) {
    return (
      <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm animate-fade-in">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Business DNA</h2>
        <p className="text-gray-600 mb-6">We've analyzed <span className="font-semibold text-indigo-600">{dna.websiteUrl}</span>. Review and confirm your brand identity.</p>
        
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700">Business Name</label>
              <input type="text" value={dna.name} readOnly className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm p-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Tagline</label>
              <input type="text" value={dna.tagline} readOnly className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm p-2" />
            </div>
          </div>

          <div>
              <label className="block text-sm font-medium text-gray-700">Logo</label>
              <div className="mt-1 p-4 bg-gray-100 rounded-md flex items-center justify-center">
                  <img src={dna.logoUrl} alt="Business Logo" className="max-h-16" />
              </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Color Palette</label>
                <ColorPalette colors={dna.colors} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Voice & Tone</label>
                <input type="text" value={dna.tone} readOnly className="mt-1 block w-full bg-gray-100 rounded-md border-gray-300 shadow-sm p-2" />
              </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">AI-Generated Imagery</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
              {dna.images.map((imgSrc, index) => (
                <img key={index} src={imgSrc} alt={`Website image ${index+1}`} className="rounded-lg object-cover aspect-square" />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 text-right">
          <button
            onClick={() => onDnaGenerated(dna)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Confirm & Create Campaigns
            <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" /></svg>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg border border-gray-200 shadow-sm text-center max-w-2xl mx-auto">
      <h2 className="text-3xl font-bold text-gray-800">Create your Business DNA</h2>
      <p className="mt-2 text-gray-600">Enter your website URL, and our AI will analyze its brand assets, fonts, colors, and tone to build your unique brand identity.</p>
      <div className="mt-6 flex flex-col sm:flex-row items-center gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-business-website.com"
          className="w-full px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          disabled={isLoading}
        />
        <button
          onClick={handleScan}
          disabled={isLoading}
          className="w-full sm:w-auto inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed"
        >
          {isLoading ? <Loader /> : 'Scan Website'}
        </button>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default BusinessDnaStep;
