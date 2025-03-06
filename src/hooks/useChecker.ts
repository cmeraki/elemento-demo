// src/hooks/useChecker.ts
import { useCallback, useRef, useEffect } from 'react';
import { Question, CanvasData, CheckResult, StepCheckResult } from '../types';

interface UseCheckerReturn {
  checkWork: (canvasData: CanvasData, question: Question) => CheckResult;
  resetChecker: () => void;
}

export const useChecker = (): UseCheckerReturn => {
  // Use a ref to maintain consistent results between calls
  const previousResultsRef = useRef<Map<string, { isCorrect: boolean, questionId: string }>>(new Map());
  const currentQuestionIdRef = useRef<string | null>(null);
  
  // Reset checker function to clear previous results when needed
  const resetChecker = useCallback(() => {
    previousResultsRef.current.clear();
    currentQuestionIdRef.current = null;
  }, []);
  
  const checkWork = useCallback((canvasData: CanvasData, question: Question): CheckResult => {
    // Check if the question has changed - if so, reset previous results
    if (currentQuestionIdRef.current !== question.id) {
      resetChecker();
      currentQuestionIdRef.current = question.id;
    }
    
    // Safety check - make sure we have steps to evaluate
    if (!canvasData || !canvasData.steps || canvasData.steps.length === 0) {
      return {
        hasError: false,
        steps: [],
        hintMessage: undefined
      };
    }
    
    const steps = canvasData.steps;
    
    // For demonstration, we'll evaluate steps deterministically
    const checkedSteps: StepCheckResult[] = steps.map((step, index) => {
      // Safety check for step properties
      if (!step || !step.id || typeof step.content !== 'string') {
        return {
          id: step?.id || `generated-${index}`,
          isCorrect: false,
          errorMessage: "Invalid step format"
        };
      }
      
      // Check if we already have a result for this step ID for the current question
      const previousResult = previousResultsRef.current.get(step.id);
      if (previousResult && previousResult.questionId === question.id) {
        return {
          id: step.id,
          isCorrect: previousResult.isCorrect,
          errorMessage: previousResult.isCorrect ? undefined : getErrorMessageForStep(step, question)
        };
      }
      
      // First step is always correct
      if (index === 0) {
        const result = { isCorrect: true, questionId: question.id };
        previousResultsRef.current.set(step.id, result);
        return {
          id: step.id,
          isCorrect: true,
          errorMessage: undefined
        };
      }
      
      // For other steps, use a deterministic approach based on content and question
      // Create a hash based on both the step content and step number to be more stable
      const contentNormalized = step.content.trim().toLowerCase();
      const hashValue = (contentNormalized.length * 31 + index) % 10;
      
      // 30% error rate for demo purposes
      const isCorrect = hashValue >= 3;
      
      // Save the result for consistency in future calls
      previousResultsRef.current.set(step.id, { isCorrect, questionId: question.id });
      
      return {
        id: step.id,
        isCorrect,
        errorMessage: isCorrect ? undefined : getErrorMessageForStep(step, question)
      };
    });
    
    const hasError = checkedSteps.some(step => !step.isCorrect);
    
    // For proper error propagation, if a previous step is incorrect,
    // all subsequent steps should be affected
    let dependentErrorSteps: StepCheckResult[] = [];
    
    let foundError = false;
    for (let i = 0; i < checkedSteps.length; i++) {
      const step = checkedSteps[i];
      
      if (!step.isCorrect) {
        foundError = true;
      } else if (foundError) {
        // This step is marked correct but follows an incorrect step
        // Add a dependent error warning
        dependentErrorSteps.push({
          id: step.id,
          isCorrect: true, // Still mark as correct, but with a warning
          warningMessage: "This step may be affected by previous errors."
        });
      }
    }
    
    return {
      hasError,
      steps: checkedSteps,
      dependentErrorSteps: dependentErrorSteps.length > 0 ? dependentErrorSteps : undefined,
      hintMessage: hasError ? getHintForError(checkedSteps, question) : undefined
    };
  }, [resetChecker]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      previousResultsRef.current.clear();
    };
  }, []);
  
  const getErrorMessageForStep = (step: { id: string, content: string }, question: Question): string => {
    // Generate specific messages based on both step content and question type
    const stepContent = step.content.toLowerCase();
    
    // Check for question context
    if (question.text.includes("derivative")) {
      if (stepContent.includes("x^")) {
        return "There's an error in your application of the power rule. Remember that the derivative of x^n is n*x^(n-1).";
      } else if (stepContent.includes("+") || stepContent.includes("-")) {
        return "Check your arithmetic in this step. There seems to be a calculation error.";
      } else {
        return "You've applied the wrong differentiation rule here. Review the different rules for derivatives.";
      }
    } else if (question.text.includes("integral")) {
      if (stepContent.includes("x^")) {
        return "Check your integration of the power terms. Remember that the integral of x^n is x^(n+1)/(n+1) + C.";
      } else {
        return "Make sure you're applying the correct integration rules and including the constant of integration.";
      }
    } else {
      // Generic math error messages
      const errorMessages = [
        "There's a calculation error in this step. Double-check your work.",
        "This step contains an algebraic mistake. Review the mathematical operations.",
        "You've made an error in this step. Check your reasoning carefully.",
        "This step doesn't follow from the previous one. Review the mathematical principles involved.",
        "There's an error in how you've applied the formula here."
      ];
      
      // Use a hash of the step ID to get a consistent message
      const hash = step.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0) % errorMessages.length;
      return errorMessages[hash];
    }
  };
  
  const getHintForError = (steps: StepCheckResult[], question: Question): string | undefined => {
    // Find the first error
    const firstError = steps.find(step => !step.isCorrect);
    
    if (!firstError) return undefined;
    
    // In a real app, you would generate a hint based on the specific error and question
    if (question.text.includes("derivative")) {
      return "Review the differentiation rules, especially the power rule and constant rule. Make sure you're applying them correctly to each term.";
    } else if (question.text.includes("integral")) {
      return "When integrating, remember that you need to increase the exponent by 1 and divide by the new exponent. Also, don't forget the constant of integration.";
    } else if (question.text.includes("equation")) {
      return "Check your algebraic manipulations and make sure you're applying the same operation to both sides of the equation.";
    } else if (question.text.includes("factor")) {
      return "When factoring expressions, look for the greatest common factor first, then try to identify special patterns like difference of squares.";
    } else {
      return "Carefully review each step of your work and make sure you're applying the correct mathematical principles.";
    }
  };
  
  return { checkWork, resetChecker };
};