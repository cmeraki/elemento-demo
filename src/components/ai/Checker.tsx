import { useState, useEffect } from 'react';
import { Question, CanvasData, CheckResult } from '../../types';
import { useChecker } from '../../hooks/useChecker';
import Annotation from './Annotation';
import AICard from './AICard';

interface CheckerProps {
  canvasData: CanvasData | null;
  question: Question;
  onClose: () => void;
}

const Checker = ({ canvasData, question, onClose }: CheckerProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [checkResults, setCheckResults] = useState<CheckResult | null>(null);
  const [expandedErrors, setExpandedErrors] = useState<string[]>([]);
  const { checkWork } = useChecker();
  
  useEffect(() => {
    if (!canvasData) return;
    
    // Simulate checking process with a delay
    const timer = setTimeout(() => {
      const results = checkWork(canvasData, question);
      setCheckResults(results);
      setIsChecking(false);
      
      // Auto-expand the first error if any
      if (results.hasError) {
        const firstErrorStep = results.steps.find((step) => !step.isCorrect);
        if (firstErrorStep) {
          setExpandedErrors([firstErrorStep.id]);
        }
      }
    }, 1500);
    
    return () => {
      clearTimeout(timer);
    };
  }, [canvasData, question, checkWork]);
  
  const toggleErrorExpand = (stepId: string) => {
    setExpandedErrors((prev) => 
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  if (!canvasData || !canvasData.steps || canvasData.steps.length === 0) {
    return (
      <AICard onClose={onClose}>
        <div className="p-4">
          <p className="text-gray-700">No work detected. Please write your solution steps on the canvas.</p>
        </div>
      </AICard>
    );
  }
  
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* This is a container that doesn't block interactions with the canvas */}
      
      {isChecking ? (
        <AICard onClose={onClose}>
          <div className="p-4 flex items-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mr-3"></div>
            <p>Checking your work...</p>
          </div>
        </AICard>
      ) : checkResults && (
        <>
          {/* Annotations for each step */}
          {checkResults.steps.map((step: StepCheckResult) => (
            <Annotation
              key={step.id}
              step={step}
              canvasStep={canvasData?.steps?.find((s) => s.id === step.id)}
              isExpanded={expandedErrors.includes(step.id)}
              onToggleExpand={() => toggleErrorExpand(step.id)}
            />
          ))}
          
          {/* Summary card */}
          <AICard onClose={onClose}>
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">
                {checkResults.hasError
                  ? 'Looks like there are some issues'
                  : 'Great job! Your work looks correct'}
              </h3>
              <p className="text-gray-700 mb-2">
                {checkResults.hasError
                  ? 'I\'ve marked the issues in your work. Click on any ❌ for more details.'
                  : 'All your steps are correct! Well done.'}
              </p>
              {checkResults.hasError && checkResults.hintMessage && (
                <div className="mt-4 bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
                  <p className="font-bold mb-1">Hint:</p>
                  <p>{checkResults.hintMessage}</p>
                </div>
              )}
            </div>
          </AICard>
        </>
      )}
    </div>
  );
};

export default Checker;
