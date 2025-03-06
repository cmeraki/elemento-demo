// src/components/sidebar/Sidebar.tsx
// Replace with this compact, permanent sidebar version

import { AppView } from '../../types';

interface SidebarProps {
  onShowSolution: () => void;
  onShowCanvas: () => void;
  currentView: AppView;
}

const Sidebar = ({
  onShowSolution,
  onShowCanvas,
  currentView
}: SidebarProps) => {
  return (
    <div className="fixed inset-y-0 left-0 w-12 bg-white shadow-md z-20 flex flex-col items-center py-2">
      {/* Logo or app icon */}
      <div className="mb-6 mt-2">
        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
          E
        </div>
      </div>
      
      {/* Navigation buttons */}
      <nav className="flex-grow flex flex-col items-center space-y-4">
        <button
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            currentView === 'canvas' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={onShowCanvas}
          title="Your Working Area"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        
        <button
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
            currentView === 'solution' 
              ? 'bg-blue-100 text-blue-700' 
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          onClick={onShowSolution}
          title="View Solution"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </button>
      </nav>
      
      {/* Helper tip at bottom */}
      <div className="mt-auto mb-2">
        <button
          className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-gray-200"
          title="Help"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;