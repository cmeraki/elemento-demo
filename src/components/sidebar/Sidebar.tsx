// src/components/sidebar/Sidebar.tsx
import { useState, useEffect } from 'react';
import { AppView } from '../../types';

interface SidebarProps {
  onShowSolution: () => void;
  onShowCanvas: () => void;
  currentView: AppView;
  onClose: () => void;
}

const Sidebar = ({
  onShowSolution,
  onShowCanvas,
  currentView,
  onClose
}: SidebarProps) => {
  const [isExpanded, setIsExpanded] = useState(true);
  
  useEffect(() => {
    // Set up escape key to close sidebar
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  return (
    <div 
      className={`fixed inset-y-0 left-0 transition-all duration-300 shadow-xl z-30 flex
        ${isExpanded ? 'w-64' : 'w-20'}`}
    >
      {/* Sidebar content */}
      <div className="w-full h-full bg-white flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          {isExpanded ? (
            <h2 className="font-bold text-lg">Study Helper</h2>
          ) : (
            <div className="h-8"></div>
          )}
          
          <div className="flex space-x-2">
            <button
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleExpand}
              aria-label={isExpanded ? "Collapse sidebar" : "Expand sidebar"}
            >
              {isExpanded ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>
            
            {isExpanded && (
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={onClose}
                aria-label="Close sidebar"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-grow overflow-y-auto">
          <ul className="p-2">
            <li>
              <button
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  currentView === 'solution' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={onShowSolution}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
                {isExpanded && <span>Solution</span>}
              </button>
            </li>
            
            <li className="mt-2">
              <button 
                className={`w-full flex items-center p-3 rounded-lg transition-colors ${
                  currentView === 'canvas' 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={onShowCanvas}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
                {isExpanded && <span>Your Working Area</span>}
              </button>
            </li>
          </ul>
        </nav>
        
        {/* Footer */}
        {isExpanded && (
          <div className="p-4 border-t border-gray-200">
            <div className="bg-blue-50 text-blue-700 p-3 rounded-lg">
              <p className="text-sm font-medium">Stuck on a problem?</p>
              <p className="text-xs mt-1">Try using the AI button for help or check the solution.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;