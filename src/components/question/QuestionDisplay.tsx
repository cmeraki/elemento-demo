import { useState } from 'react';
import { Question, QuestionOption } from '../../types';

interface QuestionDisplayProps {
  question: Question;
  onClose?: () => void;
}

const QuestionDisplay = ({ question, onClose }: QuestionDisplayProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  const [isSolving, setIsSolving] = useState(false);
  
  const handleOptionSelect = (optionId: string) => {
    setSelectedOption(optionId);
    setShowCorrectAnswer(true);
  };
  
  const getCorrectOption = (): QuestionOption | undefined => {
    return question.options.find(option => option.isCorrect);
  };
  
  const isCorrect = (optionId: string): boolean => {
    return question.options.find(option => option.id === optionId)?.isCorrect || false;
  };
  
  const handleSolve = () => {
    setIsSolving(!isSolving);
  };
  
  return (
    <div className="absolute top-6 left-6 right-6 max-w-4xl mx-auto bg-yellow-50 rounded-xl shadow-md overflow-hidden border border-yellow-200">
      <div className="p-4 relative">
        {/* Close button */}
        {onClose && (
          <button 
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        )}
        
        {/* Question */}
        <div className="flex justify-between items-start mb-2">
          <h2 className="text-lg font-medium pr-8">
            {question.text}
          </h2>
          <button 
            onClick={handleSolve}
            className="bg-gray-800 text-white text-sm px-4 py-1 rounded-md hover:bg-gray-700"
          >
            Solve
          </button>
        </div>
        
        {/* Options - only show when not solving */}
        {!isSolving && question.options && question.options.length > 0 && (
          <div className="mt-4 space-y-2">
            {question.options.map((option) => (
              <button
                key={option.id}
                className={`block w-full text-left p-3 border rounded-md transition-colors ${
                  selectedOption === option.id
                    ? isCorrect(option.id)
                      ? 'bg-green-100 border-green-500'
                      : 'bg-red-100 border-red-500'
                    : showCorrectAnswer && isCorrect(option.id)
                      ? 'bg-green-100 border-green-500'
                      : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
                onClick={() => handleOptionSelect(option.id)}
                disabled={showCorrectAnswer}
              >
                <span className="font-medium mr-2">{option.id})</span>
                {option.text}
              </button>
            ))}
          </div>
        )}
        
        {/* Feedback after answering */}
        {showCorrectAnswer && (
          <div className={`mt-4 p-3 rounded-md ${
            selectedOption === getCorrectOption()?.id
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}>
            {selectedOption === getCorrectOption()?.id
              ? 'Correct! Well done.'
              : `Incorrect. The correct answer is ${getCorrectOption()?.id}.`}
          </div>
        )}
        
        {/* Solving area - only show when solving */}
        {isSolving && (
          <div className="mt-4 p-4 bg-white rounded-md border border-gray-200">
            <p className="text-gray-700">
              Use the canvas below to work through your solution...
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default QuestionDisplay;