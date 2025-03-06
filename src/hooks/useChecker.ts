// src/hooks/useChecker.ts
import { useCallback } from 'react';
import { Question, CanvasData, CheckResult, StepCheckResult } from '../types';

interface UseCheckerReturn {
  checkWork: (canvasData: CanvasData, question: Question) => CheckResult;
}

export const useChecker = (): UseCheckerReturn => {
  const checkWork = useCallback((canvasData: CanvasData, question: Question): CheckResult => {
    // This is a mock implementation
    // In a real app, you would analyze the canvas data and compare with solution steps
    
    const steps = canvasData.steps || [];
    
    // For demonstration, we'll make some steps correct and some incorrect
    const checkedSteps: StepCheckResult[] = steps.map((step, index) => {
      // First step is always correct, others have a chance of being incorrect
      const isCorrect = index === 0 ? true : Math.random() > 0.3;
      
      return {
        id: step.id,
        isCorrect,
        errorMessage: isCorrect ? undefined : getRandomErrorMessage()
      };
    });
    
    const hasError = checkedSteps.some(step => !step.isCorrect);
    
    return {
      hasError,
      steps: checkedSteps,
      hintMessage: hasError ? getHintForError(checkedSteps) : undefined
    };
  }, []);
  
  const getRandomErrorMessage = () => {
    const errorMessages = [
      "There's an error in your differentiation. Remember that the derivative of x^n is n*x^(n-1).",
      "Check your arithmetic in this step. There seems to be a calculation error.",
      "You've applied the wrong rule here. For polynomial terms, use the power rule: d/dx(x^n) = n*x^(n-1).",
      "There's a sign error in this step. Double-check your work.",
      "Make sure you're differentiating every term correctly."
    ];
    
    return errorMessages[Math.floor(Math.random() * errorMessages.length)];
  };
  
  const getHintForError = (steps: StepCheckResult[]): string | undefined => {
    // Find the first error
    const firstError = steps.find(step => !step.isCorrect);
    
    if (!firstError) return undefined;
    
    // In a real app, you would generate a hint based on the specific error
    // For demonstration, we'll return a generic hint
    return "Try reviewing the power rule for differentiation and check your calculations carefully.";
  };
  
  return { checkWork };
};
