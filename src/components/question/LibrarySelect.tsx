// src/components/question/LibrarySelect.tsx
import { useState } from 'react';
import { Question, GetQuestionsParams } from '../../types';

// Correct import path for the getQuestions function 
// In a real app, this should come from an API service or data file
import { getQuestions } from '../../data/questionLibrary';

interface LibrarySelectProps {
  onQuestionSelected: (question: Question) => void;
}

interface BookChapter {
  id: string;
  title: string;
}

interface Book {
  id: string;
  title: string;
  subject: string;
  chapters: BookChapter[];
}

const books: Book[] = [
  {
    id: 'math101',
    title: 'Mathematics 101',
    subject: 'Mathematics',
    chapters: [
      { id: 'math101-ch1', title: 'Chapter 1: Basic Algebra' },
      { id: 'math101-ch2', title: 'Chapter 2: Linear Equations' },
      { id: 'math101-ch3', title: 'Chapter 3: Quadratic Equations' }
    ]
  },
  {
    id: 'phys101',
    title: 'Physics 101',
    subject: 'Physics',
    chapters: [
      { id: 'phys101-ch1', title: 'Chapter 1: Mechanics' },
      { id: 'phys101-ch2', title: 'Chapter 2: Thermodynamics' },
      { id: 'phys101-ch3', title: 'Chapter 3: Electricity' }
    ]
  }
];

// Mock implementation of getQuestions in case the import fails
// This provides a fallback to prevent runtime errors
const fallbackGetQuestions = async (params: GetQuestionsParams): Promise<Question[]> => {
  console.warn('Using fallback getQuestions function - check your imports');
  return [
    {
      id: 'fallback-1',
      text: 'Sample question (fallback)',
      options: [
        { id: 'A', text: 'Option A', isCorrect: true },
        { id: 'B', text: 'Option B', isCorrect: false },
      ],
      difficulty: params.difficulty || 'medium',
      subject: 'General',
      chapter: 'Sample Chapter'
    }
  ];
};

// Use the imported getQuestions if available, otherwise use fallback
const fetchQuestions = typeof getQuestions === 'function' ? getQuestions : fallbackGetQuestions;

const LibrarySelect = ({ onQuestionSelected }: LibrarySelectProps) => {
  const [selectedTab, setSelectedTab] = useState<'textbook' | 'ai'>('textbook');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [concept, setConcept] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null); // ADDED: Error state for error handling
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(null);
    setQuestions([]);
    setError(null); // Clear any previous errors
  };
  
  const handleChapterSelect = async (chapterId: string) => {
    setSelectedChapter(chapterId);
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // In a real app, fetch questions from API or file
      const chapterQuestions = await fetchQuestions({
        chapterId,
        count: 5
      });
      
      setQuestions(chapterQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
      setError('Failed to load questions. Please try again.'); // Set error message
      setQuestions([]); // Clear questions on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAIFetch = async () => {
    if (!concept) return;
    
    setIsLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      // In a real app, fetch questions from AI API
      const aiQuestions = await fetchQuestions({
        concept,
        difficulty,
        count: 5
      });
      
      setQuestions(aiQuestions);
    } catch (error) {
      console.error('Error fetching AI questions:', error);
      setError('Failed to generate questions. Please try again.'); // Set error message
      setQuestions([]); // Clear questions on error
    } finally {
      setIsLoading(false);
    }
  };
  
  const toggleRecording = () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      // Simulate receiving a transcription after a delay
      setTimeout(() => {
        const exampleTranscription = "Conservation of momentum in collisions";
        setTranscription(exampleTranscription);
        setConcept(exampleTranscription);
      }, 1500);
    } else {
      // Start recording
      setIsRecording(true);
      setTranscription('');
    }
  };
  
  // Get the selected book safely
  const selectedBookData = selectedBook ? books.find(book => book.id === selectedBook) : null;
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === 'textbook' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('textbook')}
          >
            From Textbook
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === 'ai' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('ai')}
          >
            AI Cuarated Questions
          </button>
        </div>
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex-grow flex">
        {selectedTab === 'textbook' ? (
          <div className="grid grid-cols-12 gap-4 h-full">
            <div className="col-span-3 border-r pr-4 overflow-y-auto">
              <h3 className="font-medium mb-2">Select Textbook</h3>
              <div className="space-y-2">
                {books.map((book) => (
                  <button
                    key={book.id}
                    className={`block w-full text-left px-3 py-2 rounded-md ${
                      selectedBook === book.id 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'hover:bg-gray-100'
                    }`}
                    onClick={() => handleBookSelect(book.id)}
                  >
                    {book.title}
                  </button>
                ))}
              </div>
            </div>
            
            <div className="col-span-3 border-r pr-4 overflow-y-auto">
              <h3 className="font-medium mb-2">Select Chapter</h3>
              {selectedBook ? (
                <div className="space-y-2">
                  {/* FIXED: Safe access with optional chaining and nullish coalescing */}
                  {selectedBookData?.chapters?.map((chapter) => (
                    <button
                      key={chapter.id}
                      className={`block w-full text-left px-3 py-2 rounded-md ${
                        selectedChapter === chapter.id 
                          ? 'bg-blue-100 text-blue-700' 
                          : 'hover:bg-gray-100'
                      }`}
                      onClick={() => handleChapterSelect(chapter.id)}
                    >
                      {chapter.title}
                    </button>
                  )) || (
                    <p className="text-gray-500 text-sm">No chapters found for this textbook</p>
                  )}
                </div>
              ) : (
                <p className="text-gray-500 text-sm">Please select a textbook first</p>
              )}
            </div>
            
            <div className="col-span-6 overflow-y-auto">
              <h3 className="font-medium mb-2">Select Question</h3>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : questions.length > 0 ? (
                <div className="space-y-4">
                  {questions.map((question) => (
                    <button
                      key={question.id}
                      className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                      onClick={() => onQuestionSelected(question)}
                    >
                      <p className="font-medium">{question.text}</p>
                      <p className="text-sm text-gray-500 mt-1">
                        Difficulty: {question.difficulty} | Options: {question.options?.length || 0}
                      </p>
                    </button>
                  ))}
                </div>
              ) : selectedChapter ? (
                <p className="text-gray-500 text-sm">No questions available for this chapter</p>
              ) : (
                <p className="text-gray-500 text-sm">Please select a chapter to view questions</p>
              )}
            </div>
          </div>
        ) : (
          <div className="w-full">
            <div className="mb-6">
              <div className="flex items-center mb-2">
                <label className="block text-gray-700 font-medium">
                  Voice your concept or problem scenario
                </label>
              </div>
              
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed border-gray-300 rounded-md">
                <button
                  onClick={toggleRecording}
                  className={`relative w-16 h-16 rounded-full flex items-center justify-center ${
                    isRecording ? 'bg-red-500' : 'bg-blue-500'
                  } text-white hover:opacity-90 transition-all duration-200`}
                  type="button"
                >
                  {isRecording ? (
                    <span className="animate-pulse">Stop</span>
                  ) : (
                    <svg 
                      xmlns="http://www.w3.org/2000/svg" 
                      className="h-8 w-8" 
                      fill="none" 
                      viewBox="0 0 24 24" 
                      stroke="currentColor"
                    >
                      <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        strokeWidth={2} 
                        d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
                      />
                    </svg>
                  )}
                </button>
                
                {/* Voice visualization animation */}
                {isRecording && (
                  <div className="flex items-center justify-center mt-4 space-x-1 h-8">
                    {[...Array(8)].map((_, i) => (
                      <div 
                        key={i}
                        className="w-2 bg-blue-500 rounded-full animate-pulse"
                        style={{
                          height: `${Math.random() * 24 + 8}px`,
                          animationDelay: `${i * 0.1}s`
                        }}
                      ></div>
                    ))}
                  </div>
                )}
                
                {transcription && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md w-full">
                    <p className="text-gray-800">{transcription}</p>
                  </div>
                )}
                
                <p className="text-sm text-gray-500 mt-4">
                  {isRecording ? 'Listening...' : 'Click the microphone to start speaking'}
                </p>
              </div>
            </div>
            
            <div className="mb-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleAIFetch}
                disabled={!concept || isLoading}
                type="button" // ADDED: Explicit button type
              >
                {isLoading ? 'Loading...' : 'Generate Questions'}
              </button>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : questions.length > 0 ? (
              <div className="space-y-4">
                <h3 className="font-medium">Relevant Questions</h3>
                {questions.map((question) => (
                  <button
                    key={question.id}
                    className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                    onClick={() => onQuestionSelected(question)}
                    type="button" // ADDED: Explicit button type
                  >
                    <p className="font-medium">{question.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Difficulty: {question.difficulty} | Options: {question.options?.length || 0}
                    </p>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarySelect;