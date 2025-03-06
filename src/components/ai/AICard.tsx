import { ReactNode } from 'react';

interface AICardProps {
  children: ReactNode;
  onClose: () => void;
}

const AICard = ({ children, onClose }: AICardProps) => {
  return (
    <div className="fixed right-8 bottom-32 max-w-sm bg-white rounded-lg shadow-lg overflow-hidden z-20 border border-gray-200 pointer-events-auto">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 h-2"></div>
      <div className="relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 z-10"
          onClick={onClose}
          aria-label="Close"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

export default AICard;