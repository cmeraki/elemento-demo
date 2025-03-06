// src/data/questionLibrary.ts
import { Question, GetQuestionsParams } from '../types';

// Sample data for demonstration - in a real app, this would be fetched from a database or API
const sampleQuestions: Question[] = [
  {
    id: 'q1',
    text: 'What is the derivative of f(x) = x³ + 2x² - 4x + 7?',
    options: [
      { id: 'A', text: '3x² + 4x - 4', isCorrect: true },
      { id: 'B', text: '3x² + 2x - 4', isCorrect: false },
      { id: 'C', text: '3x² + 4x', isCorrect: false },
      { id: 'D', text: 'x³ + 4x - 4', isCorrect: false },
    ],
    difficulty: 'medium',
    subject: 'Mathematics',
    chapter: 'Calculus',
    solution: {
      steps: [
        { id: 1, content: "Apply the power rule for each term", latex: "f'(x) = \\frac{d}{dx}(x^3) + \\frac{d}{dx}(2x^2) - \\frac{d}{dx}(4x) + \\frac{d}{dx}(7)" },
        { id: 2, content: "Compute the derivative of each term", latex: "f'(x) = 3x^2 + 2 \\cdot 2x^1 - 4 \\cdot 1 + 0" },
        { id: 3, content: "Simplify", latex: "f'(x) = 3x^2 + 4x - 4" }
      ]
    }
  },
  {
    id: 'q2',
    text: 'What is the derivative of f(x) = 3x² - 2x + 5?',
    options: [
      { id: 'A', text: '6x - 2', isCorrect: true },
      { id: 'B', text: '3x - 2', isCorrect: false },
      { id: 'C', text: '6x - 2 + 5', isCorrect: false },
      { id: 'D', text: '6x² - 2', isCorrect: false },
    ],
    difficulty: 'easy',
    subject: 'Mathematics',
    chapter: 'Calculus',
    solution: {
      steps: [
        { id: 1, content: "Identify the function to differentiate", latex: "f(x) = 3x^2 - 2x + 5" },
        { id: 2, content: "Apply the power rule to each term", latex: "f'(x) = \\frac{d}{dx}(3x^2) - \\frac{d}{dx}(2x) + \\frac{d}{dx}(5)" },
        { id: 3, content: "Calculate the derivative of each term", latex: "f'(x) = 3 \\cdot 2x^1 - 2 \\cdot 1 + 0" },
        { id: 4, content: "Simplify the expression", latex: "f'(x) = 6x - 2" }
      ]
    }
  },
  {
    id: 'q3',
    text: 'What is the derivative of f(x) = sin(x) + cos(x)?',
    options: [
      { id: 'A', text: 'cos(x) - sin(x)', isCorrect: true },
      { id: 'B', text: 'cos(x) + sin(x)', isCorrect: false },
      { id: 'C', text: '-sin(x) - cos(x)', isCorrect: false },
      { id: 'D', text: 'sin(x) - cos(x)', isCorrect: false },
    ],
    difficulty: 'medium',
    subject: 'Mathematics',
    chapter: 'Calculus',
    solution: {
      steps: [
        { id: 1, content: "Identify the function to differentiate", latex: "f(x) = \\sin(x) + \\cos(x)" },
        { id: 2, content: "Apply the derivative rules for trigonometric functions", latex: "f'(x) = \\frac{d}{dx}(\\sin(x)) + \\frac{d}{dx}(\\cos(x))" },
        { id: 3, content: "Use the rules: d/dx(sin(x)) = cos(x) and d/dx(cos(x)) = -sin(x)", latex: "f'(x) = \\cos(x) - \\sin(x)" }
      ]
    }
  },
  // Physics questions
  {
    id: 'p1',
    text: 'A ball is thrown vertically upward with an initial velocity of 20 m/s. How high will it go?',
    options: [
      { id: 'A', text: '20.4 m', isCorrect: true },
      { id: 'B', text: '10.2 m', isCorrect: false },
      { id: 'C', text: '40.8 m', isCorrect: false },
      { id: 'D', text: '30.6 m', isCorrect: false },
    ],
    difficulty: 'medium',
    subject: 'Physics',
    chapter: 'Mechanics',
    solution: {
      steps: [
        { id: 1, content: "Identify the relevant kinematic equation", latex: "v_f^2 = v_i^2 + 2a\\Delta x" },
        { id: 2, content: "At the highest point, final velocity is zero", latex: "0 = (20 \\text{ m/s})^2 + 2(-9.8 \\text{ m/s}^2)\\Delta x" },
        { id: 3, content: "Solve for Δx", latex: "\\Delta x = \\frac{(20 \\text{ m/s})^2}{2(9.8 \\text{ m/s}^2)} = 20.4 \\text{ m}" }
      ]
    }
  }
];

/**
 * Get questions based on provided parameters
 */
export const getQuestions = async (params: GetQuestionsParams): Promise<Question[]> => {
  // This is a mock implementation
  // In a real app, this would call an API or query a database
  
  return new Promise((resolve) => {
    setTimeout(() => {
      // Filter questions based on parameters
      let filteredQuestions = [...sampleQuestions];
      
      // Filter by chapter if specified
      if (params.chapterId) {
        const subject = params.chapterId.includes('math') ? 'Mathematics' : 'Physics';
        const chapter = params.chapterId.includes('ch1') ? 'Mechanics' : 
                      params.chapterId.includes('ch2') ? 'Thermodynamics' : 
                      'Calculus';
        
        filteredQuestions = filteredQuestions.filter(q => 
          q.subject === subject && q.chapter.includes(chapter)
        );
      }
      
      // Filter by difficulty if specified
      if (params.difficulty) {
        filteredQuestions = filteredQuestions.filter(q => 
          q.difficulty === params.difficulty
        );
      }
      
      // Filter by concept if specified
      if (params.concept) {
        const conceptLower = params.concept.toLowerCase();
        filteredQuestions = filteredQuestions.filter(q => 
          q.text.toLowerCase().includes(conceptLower) || 
          q.subject.toLowerCase().includes(conceptLower) ||
          q.chapter.toLowerCase().includes(conceptLower)
        );
      }
      
      // If we have no matches or very few, generate some mock questions
      if (filteredQuestions.length < params.count) {
        const additionalCount = params.count - filteredQuestions.length;
        
        for (let i = 0; i < additionalCount; i++) {
          // Create dynamic mock questions
          const mockId = `mock-${Date.now()}-${i}`;
          const concept = params.concept || 'general concept';
          const difficulty = params.difficulty || 'medium';
          const subject = params.chapterId?.includes('phys') ? 'Physics' : 'Mathematics';
          
          filteredQuestions.push({
            id: mockId,
            text: `Question about ${concept} (${i + 1})`,
            options: [
              { id: 'A', text: 'First option', isCorrect: i % 4 === 0 },
              { id: 'B', text: 'Second option', isCorrect: i % 4 === 1 },
              { id: 'C', text: 'Third option', isCorrect: i % 4 === 2 },
              { id: 'D', text: 'Fourth option', isCorrect: i % 4 === 3 }
            ],
            difficulty: difficulty,
            subject: subject,
            chapter: params.chapterId?.includes('ch1') ? 'Chapter 1' : 
                    params.chapterId?.includes('ch2') ? 'Chapter 2' : 'Chapter 3'
          });
        }
      }
      
      // Limit to requested count
      filteredQuestions = filteredQuestions.slice(0, params.count);
      
      resolve(filteredQuestions);
    }, 800); // Simulate network delay
  });
};

/**
 * Get a specific question by ID
 */
export const getQuestionById = async (id: string): Promise<Question | null> => {
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      const question = sampleQuestions.find(q => q.id === id) || null;
      resolve(question);
    }, 300);
  });
};