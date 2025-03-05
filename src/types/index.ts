export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: QuestionOption[];
  difficulty: 'easy' | 'medium' | 'hard';
  subject: string;
  chapter: string;
}

export interface GetQuestionsParams {
  chapterId?: string;
  concept?: string;
  difficulty?: 'easy' | 'medium' | 'hard';
  count: number;
}

// src/data/questionLibrary.jsonl
// This is a mock implementation of a question library
// In a real app, this would be fetched from an API or database

export const getQuestions = async (params: GetQuestionsParams): Promise<Question[]> => {
  // Mock implementation for demonstration purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      // Generate some mock questions based on params
      const mockQuestions: Question[] = [];
      
      for (let i = 1; i <= params.count; i++) {
        const subject = params.chapterId?.includes('math') ? 'Mathematics' : 'Physics';
        const chapter = params.chapterId?.includes('ch1') ? 'Chapter 1' 
                      : params.chapterId?.includes('ch2') ? 'Chapter 2' 
                      : 'Chapter 3';
        
        mockQuestions.push({
          id: `q-${Math.random().toString(36).substring(2, 9)}`,
          text: params.concept 
            ? `Question about ${params.concept} (${i})`
            : `Question from ${subject} ${chapter} (${i})`,
          options: [
            { id: 'A', text: 'Option A', isCorrect: i % 4 === 0 },
            { id: 'B', text: 'Option B', isCorrect: i % 4 === 1 },
            { id: 'C', text: 'Option C', isCorrect: i % 4 === 2 },
            { id: 'D', text: 'Option D', isCorrect: i % 4 === 3 }
          ],
          difficulty: params.difficulty || 'medium',
          subject: subject,
          chapter: chapter
        });
      }
      
      resolve(mockQuestions);
    }, 1000); // Simulate network delay
  });
};