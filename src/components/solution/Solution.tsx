import { useState } from 'react';
import MathRenderer from './MathRenderer';
import { Question } from '../../types';

interface SolutionProps {
  question: Question;
  onBack: () => void;
}

const Solution = ({ question, onBack }: SolutionProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  // Default solution if not provided
  const solution = question.solution || {
    steps: [
      { 
        id: 1, 
        content: "The derivative of the function can be found by applying the power rule to each term.", 
        latex: "f'(x) = \\frac{d}{dx}(x^3 + 2x^2 - 4x + 7)" 
      },
      { 
        id: 2, 
        content: "By the power rule, the derivative of x^n is nx^(n-1).", 
        latex: "f'(x) = 3x^2 + 2 \\cdot 2x^1 - 4 \\cdot 1 + 0" 
      },
      { 
        id: 3, 
        content: "Simplifying the expression.", 
        latex: "f'(x) = 3x^2 + 4x - 4" 
      }
    ]
  };
  
  const totalSteps = solution.steps.length;
  
  const showNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const showPrevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };
  
  const showAllSteps = () => {
    setCurrentStep(totalSteps);
  };
  
  const resetSteps = () => {
    setCurrentStep(0);
  };
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 shadow-md">
        <div className="flex justify-between items-center">
          <button
            className="flex items-center text-white hover:text-gray-300"
            onClick={onBack}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Back to Canvas
          </button>
          
          <h1 className="text-lg font-bold">Step-by-Step Solution</h1>
          
          <div className="w-24"></div> {/* Spacer to center the title */}
        </div>
      </div>
      
      {/* Question */}
      <div className="max-w-4xl mx-auto mt-8 px-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-8">
          <h2 className="text-lg font-medium">
            {question.text}
          </h2>
        </div>
        
        {/* Progress bar */}
        <div className="w-full h-2 bg-gray-200 rounded-full mb-6">
          <div 
            className="h-full bg-blue-600 rounded-full transition-all duration-300"
            style={{ width: `${currentStep === 0 ? 5 : (currentStep / totalSteps) * 100}%` }}
          ></div>
        </div>
        
        {/* Steps controls */}
        <div className="flex justify-between mb-6">
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
              onClick={resetSteps}
              disabled={currentStep === 0}
            >
              Reset
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={showAllSteps}
              disabled={currentStep === totalSteps}
            >
              Show All
            </button>
          </div>
          
          <div className="flex space-x-3">
            <button
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
              onClick={showPrevStep}
              disabled={currentStep === 0}
            >
              Previous
            </button>
            
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              onClick={showNextStep}
              disabled={currentStep === totalSteps}
            >
              Next
            </button>
          </div>
        </div>
        
        {/* Solution steps */}
        <div className="bg-white border rounded-lg shadow-sm overflow-hidden">
          {currentStep === 0 ? (
            <div className="p-12 text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">Solution Guide</h3>
              <p className="text-gray-600 mb-6">Click &apos;Next&apos; to go through the solution step by step</p>
              <button
                className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                onClick={showNextStep}
              >
                Start Solution
              </button>
            </div>
          ) : (
            <div className="divide-y">
              {solution.steps.slice(0, currentStep).map((step) => (
                <div key={step.id} className="p-6">
                  <div className="flex items-start">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center flex-shrink-0 mr-4">
                      {step.id}
                    </div>
                    <div>
                      <p className="text-gray-700 mb-3">{step.content}</p>
                      <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
                        <MathRenderer latex={step.latex} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {/* Final answer */}
        {currentStep === totalSteps && (
          <div className="mt-8 bg-green-50 p-6 rounded-lg border border-green-200">
            <h3 className="text-xl font-bold text-green-800 mb-3">Final Answer</h3>
            <MathRenderer latex={solution.steps[totalSteps - 1].latex} />
            <p className="mt-4 text-green-700">
              The derivative of {question.text.split('derivative of ')[1]} is {solution.steps[totalSteps - 1].latex.replace("f'(x) = ", "")}.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Solution;