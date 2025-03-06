import { useState } from 'react';
import { Question } from '../../types';

interface QuestionDisplayProps {
  question: Question;
  onClose: () => void;
}

const QuestionDisplay = ({ question, onClose }: QuestionDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowCorrectAnswer(true);
  };
  
  const isCorrect = (optionId: string): boolean => {
    return question.options.find(option => option.id === optionId)?.isCorrect || false;
  };
  
  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };
  
  // Compact version that shows just the question when collapsed
  if (!isExpanded) {
    return (
      <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 py-2 px-4 shadow-sm z-10 flex justify-between items-center">
        <h2 className="text-sm font-medium text-black truncate max-w-[85%]">{question.text}</h2>
        <div className="flex items-center space-x-2">
          <button 
            onClick={toggleExpand}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    );
  }
  
  // Expanded version with options
  return (
    <div className="absolute top-0 left-0 right-0 bg-yellow-50 border-b border-yellow-200 z-10 shadow-md">
      <div className="p-3 relative">
        <div className="flex justify-between items-start">
          <h2 className="text-sm font-medium text-black pr-16">{question.text}</h2>
          <div className="flex items-center space-x-2">
            <button 
              onClick={toggleExpand}
              className="text-blue-600 hover:text-blue-800 text-xs font-medium"
            >
              Hide
            </button>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="mt-2 grid grid-cols-2 gap-2">
          {question.options.map((option) => (
            <button
              key={option.id}
              className={`text-left p-1.5 border rounded text-xs ${
                selectedOption === option.id
                  ? isCorrect(option.id)
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-red-100 border-red-500 text-red-800'
                  : showCorrectAnswer && isCorrect(option.id)
                    ? 'bg-green-100 border-green-500 text-green-800'
                    : 'bg-white border-gray-200 hover:bg-gray-50 text-black'
              }`}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showCorrectAnswer}
            >
              <span className="font-medium mr-1 text-black">{option.id})</span>
              <span className="text-black">{option.text}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;