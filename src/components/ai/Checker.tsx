// src/components/ai/Checker.tsx - Fixed version
import { useState, useEffect, useRef } from 'react';
import { Question, CanvasData, CheckResult, StepCheckResult } from '../../types';
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
  const [expandedWarnings, setExpandedWarnings] = useState<string[]>([]);
  const { checkWork, resetChecker } = useChecker();
  
  // Use a ref to track the current question ID to prevent stale closures
  const currentQuestionIdRef = useRef<string | null>(null);
  
  // Reset checker only when the question actually changes
  useEffect(() => {
    if (currentQuestionIdRef.current !== question.id) {
      resetChecker();
      currentQuestionIdRef.current = question.id;
    }
  }, [question.id, resetChecker]);
  
  // Clean up when component unmounts
  useEffect(() => {
    return () => {
      // Only reset if we're unmounting the whole component
      resetChecker();
    };
  }, [resetChecker]);
  
  // Check the work whenever canvasData changes
  useEffect(() => {
    // Don't check if we have no data
    if (!canvasData || !canvasData.steps || canvasData.steps.length === 0) {
      setIsChecking(false);
      setCheckResults(null);
      return;
    }
    
    // Save the question ID we're checking for
    const questionIdBeingChecked = question.id;
    
    // Start checking
    setIsChecking(true);
    
    const timer = setTimeout(() => {
      try {
        // Only proceed if we're still checking the same question
        if (questionIdBeingChecked === currentQuestionIdRef.current) {
          const results = checkWork(canvasData, question);
          setCheckResults(results);
          
          // Auto-expand the first error if any
          if (results.hasError && results.steps && results.steps.length > 0) {
            const firstErrorStep = results.steps.find((step) => !step.isCorrect);
            if (firstErrorStep) {
              setExpandedErrors((prev) => {
                // Avoid duplicate entries
                if (!prev.includes(firstErrorStep.id)) {
                  return [...prev, firstErrorStep.id];
                }
                return prev;
              });
            }
          }
        }
      } catch (error) {
        console.error("Error checking work:", error);
        // Handle error gracefully with a properly typed empty result
        setCheckResults({
          hasError: false,
          steps: [] as StepCheckResult[]
        });
      } finally {
        setIsChecking(false);
      }
    }, 1000);
    
    // Clean up timer if component unmounts or canvasData changes
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
  
  const toggleWarningExpand = (stepId: string) => {
    setExpandedWarnings((prev) => 
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  // Show a message when no work is detected
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
      ) : checkResults ? (
        <>
          {/* Annotations for each step with errors */}
          {checkResults.steps && checkResults.steps.map((step: StepCheckResult) => {
            // Find the corresponding canvas step
            const canvasStep = canvasData.steps?.find((s) => s.id === step.id);
            
            // Only render if we found a matching canvas step
            return canvasStep ? (
              <Annotation
                key={`error-${step.id}`}
                step={step}
                canvasStep={canvasStep}
                isExpanded={expandedErrors.includes(step.id)}
                onToggleExpand={() => toggleErrorExpand(step.id)}
                isWarning={false}
              />
            ) : null;
          })}
          
          {/* Annotations for steps with warnings (dependent errors) */}
          {checkResults.dependentErrorSteps && checkResults.dependentErrorSteps.map((step: StepCheckResult) => {
            // Find the corresponding canvas step
            const canvasStep = canvasData.steps?.find((s) => s.id === step.id);
            
            // Only render if we found a matching canvas step
            return canvasStep ? (
              <Annotation
                key={`warning-${step.id}`}
                step={step}
                canvasStep={canvasStep}
                isExpanded={expandedWarnings.includes(step.id)}
                onToggleExpand={() => toggleWarningExpand(step.id)}
                isWarning={true}
              />
            ) : null;
          })}
          
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
              {checkResults.dependentErrorSteps && checkResults.dependentErrorSteps.length > 0 && (
                <p className="text-yellow-700 text-sm mb-2">
                  Some steps may be affected by earlier errors. These are marked with a yellow warning icon.
                </p>
              )}
              {checkResults.hasError && checkResults.hintMessage && (
                <div className="mt-4 bg-blue-50 p-3 rounded-md text-blue-700 text-sm">
                  <p className="font-bold mb-1">Hint:</p>
                  <p>{checkResults.hintMessage}</p>
                </div>
              )}
            </div>
          </AICard>
        </>
      ) : null}
    </div>
  );
};

export default Checker;