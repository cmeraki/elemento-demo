import { useState } from 'react';
import { Question, QuestionOption } from '../../types';

interface QuestionDisplayProps {
  question: Question;
}

const QuestionDisplay = ({ question }: QuestionDisplayProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showCorrectAnswer, setShowCorrectAnswer] = useState(false);
  
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
  
  return (
    <div className="p-4">
      <div className="mb-4">
        <h2 className="text-lg font-medium">{question.text}</h2>
        <p className="text-sm text-gray-500">
          {question.subject} | {question.chapter} | Difficulty: {question.difficulty}
        </p>
      </div>
      
      <div className="space-y-2">
        {question.options.map((option) => (
          <button
            key={option.id}
            className={`block w-full text-left p-3 border rounded-md ${
              selectedOption === option.id
                ? isCorrect(option.id)
                  ? 'bg-green-100 border-green-500'
                  : 'bg-red-100 border-red-500'
                : showCorrectAnswer && isCorrect(option.id)
                  ? 'bg-green-100 border-green-500'
                  : 'hover:bg-gray-50'
            }`}
            onClick={() => handleOptionSelect(option.id)}
            disabled={showCorrectAnswer}
          >
            <span className="font-medium mr-2">{option.id})</span>
            {option.text}
          </button>
        ))}
      </div>
      
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
    </div>
  );
};

export default QuestionDisplay;

// src/utils/ocr.ts
export const extractTextFromImage = async (file: File): Promise<string> => {
  // In a real application, you would use a proper OCR service
  // like Tesseract.js, Google Cloud Vision, or Azure Computer Vision
  
  // This is a mock implementation for demonstration purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock OCR result
      const mockedText = `What is the value of x in the equation 2x + 5 = 15?
A) x = 5
B) x = 10
C) x = -5
D) x = 6`;
      
      resolve(mockedText);
    }, 1500); // Simulate processing time
  });
};

// src/utils/fileHandlers.ts
export const readFileAsDataURL = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result);
      } else {
        reject(new Error('Failed to read file as data URL'));
      }
    };
    
    reader.onerror = () => {
      reject(new Error('Error reading file'));
    };
    
    reader.readAsDataURL(file);
  });
};