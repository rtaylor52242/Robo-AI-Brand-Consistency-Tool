
import React, { useState } from 'react';
import { Creative, BusinessDNA } from '../types';

interface CreativeCardProps {
  creative: Creative;
  businessDNA: BusinessDNA;
}

const CreativeCard: React.FC<CreativeCardProps> = ({ creative, businessDNA }) => {
  const [showHeadline, setShowHeadline] = useState(true);
  const [fontSize, setFontSize] = useState<'text-lg' | 'text-xl' | 'text-2xl'>('text-xl');
  const [textColor, setTextColor] = useState<string>(businessDNA.colors[1] || '#FFFFFF');

  const getAspectRatio = (size: Creative['sizePreset']) => {
    switch(size) {
        case 'Square': return 'aspect-square';
        case 'Story': return 'aspect-[9/16]';
        case 'Banner': return 'aspect-video';
        default: return 'aspect-square';
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className={`relative w-full ${getAspectRatio(creative.sizePreset)} bg-gray-200 overflow-hidden`}>
        <img src={creative.imageUrl} alt={creative.headline} className="w-full h-full object-cover" />
        {showHeadline && (
          <div className="absolute inset-0 flex items-center justify-center p-4 bg-black bg-opacity-20">
            <h3 className={`font-bold text-center drop-shadow-lg ${fontSize}`} style={{ color: textColor }}>
              {creative.headline}
            </h3>
          </div>
        )}
         <div className="absolute top-2 left-2 p-1 bg-white rounded-full">
            <img src={businessDNA.logoUrl} alt={`${businessDNA.name} logo`} className="h-8 w-8 object-contain" />
        </div>
      </div>
      <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Headline</label>
          <button onClick={() => setShowHeadline(!showHeadline)} className={`px-3 py-1 text-xs font-semibold rounded-full ${showHeadline ? 'bg-green-100 text-green-800' : 'bg-gray-200 text-gray-800'}`}>
            {showHeadline ? 'ON' : 'OFF'}
          </button>
        </div>
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-gray-700">Font Size</label>
          <div className="flex space-x-1">
            <button onClick={() => setFontSize('text-lg')} className={`w-7 h-7 rounded ${fontSize === 'text-lg' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>S</button>
            <button onClick={() => setFontSize('text-xl')} className={`w-7 h-7 rounded ${fontSize === 'text-xl' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>M</button>
            <button onClick={() => setFontSize('text-2xl')} className={`w-7 h-7 rounded ${fontSize === 'text-2xl' ? 'bg-indigo-600 text-white' : 'bg-gray-200'}`}>L</button>
          </div>
        </div>
        <div className="flex items-center justify-between">
           <label className="text-sm font-medium text-gray-700">Text Color</label>
           <div className="flex space-x-1">
             {businessDNA.colors.map(color => (
                <button key={color} onClick={() => setTextColor(color)} className={`w-7 h-7 rounded-full border-2 ${textColor === color ? 'border-indigo-600' : 'border-transparent'}`} style={{backgroundColor: color}}></button>
             ))}
           </div>
        </div>
        <button className="w-full mt-2 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" /></svg>
          Download
        </button>
      </div>
    </div>
  );
};

export default CreativeCard;
