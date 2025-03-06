import { useCallback } from 'react';
import { Question, Solution } from '../types';

interface UseSolutionReturn {
  getSolution: (question: Question) => Solution;
}

export const useSolution = (): UseSolutionReturn => {
  const getSolution = useCallback((question: Question): Solution => {
    // Use the question's solution if available, otherwise generate a default one
    if (question.solution) {
      return question.solution;
    }
    
    // Default solution for derivative questions
    return {
      steps: [
        { 
          id: 1, 
          content: "First, identify the function to be differentiated.", 
          latex: "f(x) = x^3 + 2x^2 - 4x + 7" 
        },
        { 
          id: 2, 
          content: "Apply the power rule to each term.", 
          latex: "f'(x) = \\frac{d}{dx}(x^3) + \\frac{d}{dx}(2x^2) - \\frac{d}{dx}(4x) + \\frac{d}{dx}(7)" 
        },
        { 
          id: 3, 
          content: "The power rule states that the derivative of x^n is n*x^(n-1).", 
          latex: "f'(x) = 3x^2 + 2 \\cdot 2x^1 - 4 \\cdot 1 + 0" 
        },
        { 
          id: 4, 
          content: "Simplify the expression.", 
          latex: "f'(x) = 3x^2 + 4x - 4" 
        }
      ]
    };
  }, []);
  
  return { getSolution };
};