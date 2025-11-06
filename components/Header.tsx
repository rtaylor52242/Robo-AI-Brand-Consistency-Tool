import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between max-w-7xl">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
             <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8.5V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v2.5"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M8 13V9a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4"/><circle cx="17" cy="17" r="1"/><circle cx="7" cy="17" r="1"/></svg>
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Robo AI</h1>
        </div>
        <a href="https://ai.google.dev" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
          Powered by Google AI
        </a>
      </div>
    </header>
  );
};

export default Header;