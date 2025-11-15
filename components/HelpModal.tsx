import React from 'react';

interface HelpModalProps {
  onClose: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div 
      className="fixed inset-0 bg-gray-900 bg-opacity-75 flex items-center justify-center z-50 animate-fade-in"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div 
        className="bg-white rounded-lg shadow-xl w-full max-w-2xl m-4 p-8 relative animate-slide-up"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close help modal"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        
        <h2 className="text-3xl font-bold text-gray-800 text-center">How It Works</h2>
        <p className="mt-2 text-center text-gray-600">Create on-brand marketing campaigns in 3 simple steps.</p>

        <div className="mt-8 space-y-6">
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-600">1</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Generate Business DNA</h3>
              <p className="mt-1 text-gray-600">Enter your website URL. Our AI will analyze your brand's style, colors, and tone to create a unique brand profile.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-600">2</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Campaign Ideation</h3>
              <p className="mt-1 text-gray-600">Based on your DNA, we'll suggest several marketing campaign ideas. Pick the one that best fits your goals.</p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
              <span className="text-xl font-bold text-indigo-600">3</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-800">Generate Creatives</h3>
              <p className="mt-1 text-gray-600">Generate stunning, on-brand visual creatives for your chosen campaign. Customize them and they're ready to use!</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button 
            onClick={onClose} 
            className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
          >
            Got It!
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
