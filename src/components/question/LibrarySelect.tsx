// src/components/question/LibrarySelect.tsx
import { useState, useEffect } from 'react';
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
      { id: 'math101-ch1', title: 'Chapter 1: Sets' },
      { id: 'math101-ch2', title: 'Chapter 2: Relations and Functions' },
      { id: 'math101-ch3', title: 'Chapter 3: Trigonometric Functions' },
      { id: 'math101-ch4', title: 'Chapter 4: Principle of Mathematical Induction' },
      { id: 'math101-ch5', title: 'Chapter 5: Complex Numbers and Quadratic Equations' },
      { id: 'math101-ch6', title: 'Chapter 6: Linear Inequalities' },
      { id: 'math101-ch7', title: 'Chapter 7: Permutations and Combinations' },
      { id: 'math101-ch8', title: 'Chapter 8: Binomial Theorem' },
      { id: 'math101-ch9', title: 'Chapter 9: Sequences and Series' },
      { id: 'math101-ch10', title: 'Chapter 10: Straight Lines' },
      { id: 'math101-ch11', title: 'Chapter 11: Conic Sections' },
      { id: 'math101-ch12', title: 'Chapter 12: Introduction to Three-Dimensional Geometry' },
      { id: 'math101-ch13', title: 'Chapter 13: Limits and Derivatives' },
      { id: 'math101-ch14', title: 'Chapter 14: Mathematical Reasoning' },
      { id: 'math101-ch15', title: 'Chapter 15: Statistics' },
      { id: 'math101-ch16', title: 'Chapter 16: Probability' }
    ]
  },
  {
    id: 'phys101',
    title: 'Physics 101',
    subject: 'Physics',
    chapters: [
      { id: 'phys101-ch1', title: 'Chapter 1: Physical World' },
      { id: 'phys101-ch2', title: 'Chapter 2: Units and Measurements' },
      { id: 'phys101-ch3', title: 'Chapter 3: Motion in a Straight Line' },
      { id: 'phys101-ch4', title: 'Chapter 4: Motion in a Plane' },
      { id: 'phys101-ch5', title: 'Chapter 5: Laws of Motion' },
      { id: 'phys101-ch6', title: 'Chapter 6: Work, Energy, and Power' },
      { id: 'phys101-ch7', title: 'Chapter 7: System of Particles & Rotational Motion' },
      { id: 'phys101-ch8', title: 'Chapter 8: Gravitation' },
      { id: 'phys101-ch9', title: 'Chapter 9: Mechanical Properties of Solids' },
      { id: 'phys101-ch10', title: 'Chapter 10: Mechanical Properties of Fluids' },
      { id: 'phys101-ch11', title: 'Chapter 11: Thermal Properties of Matter' },
      { id: 'phys101-ch12', title: 'Chapter 12: Thermodynamics' },
      { id: 'phys101-ch13', title: 'Chapter 13: Kinetic Theory of Gases' },
      { id: 'phys101-ch14', title: 'Chapter 14: Oscillations' },
      { id: 'phys101-ch15', title: 'Chapter 15: Waves' }
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
  const [error, setError] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState('');
  
  // Track animation states for elegant transitions
  const [booksVisible, setBooksVisible] = useState(true);
  const [chaptersVisible, setChaptersVisible] = useState(false);
  const [questionsVisible, setQuestionsVisible] = useState(false);
  
  const handleBookSelect = (bookId: string) => {
    if (selectedBook === bookId) return;
    
    // Animate transitions
    setChaptersVisible(false);
    setQuestionsVisible(false);
    
    setTimeout(() => {
      setSelectedBook(bookId);
      setSelectedChapter(null);
      setQuestions([]);
      setError(null);
      setChaptersVisible(true);
    }, 300);
  };
  
  const handleChapterSelect = async (chapterId: string) => {
    if (selectedChapter === chapterId) return;
    
    // Animate transition
    setQuestionsVisible(false);
    
    setTimeout(async () => {
      setSelectedChapter(chapterId);
      setIsLoading(true);
      setError(null);
      
      try {
        const chapterQuestions = await fetchQuestions({
          chapterId,
          count: 5
        });
        
        setQuestions(chapterQuestions);
      } catch (error) {
        console.error('Error fetching questions:', error);
        setError('Failed to load questions. Please try again.');
        setQuestions([]);
      } finally {
        setIsLoading(false);
        setQuestionsVisible(true);
      }
    }, 300);
  };
  
  const handleAIFetch = async () => {
    if (!concept) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const aiQuestions = await fetchQuestions({
        concept,
        difficulty,
        count: 5
      });
      
      setQuestions(aiQuestions);
    } catch (error) {
      console.error('Error fetching AI questions:', error);
      setError('Failed to generate questions. Please try again.');
      setQuestions([]);
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
        const exampleTranscription = "Permutations and combinations combined with probability";
        setTranscription(exampleTranscription);
        setConcept(exampleTranscription);
      }, 1500);
    } else {
      // Start recording
      setIsRecording(true);
      setTranscription('');
    }
  };

  // Effect to manage visibility when switching tabs
  useEffect(() => {
    if (selectedTab === 'textbook') {
      setBooksVisible(true);
      setChaptersVisible(!!selectedBook);
      setQuestionsVisible(!!selectedChapter && questions.length > 0);
    }
  }, [selectedTab, selectedBook, selectedChapter, questions.length]);
  
  // Get the selected book safely
  const selectedBookData = selectedBook ? books.find(book => book.id === selectedBook) : null;
  
  return (
    <div className="h-full flex flex-col">
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium transition-colors duration-200 relative ${
              selectedTab === 'textbook' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('textbook')}
          >
            From Textbook
            {selectedTab === 'textbook' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300"></div>
            )}
          </button>
          <button
            className={`px-4 py-2 font-medium transition-colors duration-200 relative ${
              selectedTab === 'ai' 
                ? 'text-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('ai')}
          >
            AI Curated Questions
            {selectedTab === 'ai' && (
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600 transform transition-transform duration-300"></div>
            )}
          </button>
        </div>
      </div>
      
      {/* Error message display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md animate-fadeIn">
          {error}
        </div>
      )}
      
      <div className="flex-grow flex">
        {selectedTab === 'textbook' ? (
          <div className="w-full h-full flex gap-6">
            {/* Books and Chapters combined panel (Master) */}
            <div className="w-2/5 bg-white rounded-lg shadow-sm h-full overflow-hidden flex flex-col">
              <div className="p-4 border-b bg-gray-50">
                <h3 className="font-medium text-gray-800">Library</h3>
              </div>
              <div className="overflow-y-auto flex-grow">
                {books.map((book) => (
                  <div key={book.id} className="mb-2">
                    {/* Book header - always visible */}
                    <div
                      className={`cursor-pointer transition-all duration-200 p-3
                        ${selectedBook === book.id 
                          ? 'bg-blue-50' 
                          : 'hover:bg-gray-50'
                        }`}
                      onClick={() => handleBookSelect(book.id)}
                    >
                      <div className="flex items-center">
                        <div className="flex-shrink-0 mr-3">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center
                            ${selectedBook === book.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                            {book.title.charAt(0)}
                          </div>
                        </div>
                        <div className="flex-grow">
                          <h4 className={`font-medium ${selectedBook === book.id ? 'text-blue-700' : 'text-gray-800'}`}>
                            {book.title}
                          </h4>
                          <p className="text-xs text-gray-500">{book.subject}</p>
                        </div>
                        <div>
                          <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 text-gray-400 transition-transform ${selectedBook === book.id ? 'transform rotate-90' : ''}`} viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    
                    {/* Chapters - visible when book is selected */}
                    {selectedBook === book.id && (
                      <div className={`ml-4 pl-4 border-l border-gray-200 transition-all duration-300 
                        ${chaptersVisible ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0 overflow-hidden'}`}>
                        {book.chapters.map((chapter) => (
                          <div
                            key={chapter.id}
                            className={`rounded-md cursor-pointer transition-all duration-200 p-2 my-1
                              ${selectedChapter === chapter.id 
                                ? 'bg-blue-50 border-l-4 border-blue-500' 
                                : 'hover:bg-gray-50 border-l-4 border-transparent'
                              }`}
                            onClick={() => handleChapterSelect(chapter.id)}
                          >
                            <div className="flex items-center">
                              <div className="flex-shrink-0 mr-3">
                                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs
                                  ${selectedChapter === chapter.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-600'}`}>
                                  {chapter.title.split(':')[0].replace('Chapter ', '')}
                                </div>
                              </div>
                              <div>
                                <h4 className={`text-sm ${selectedChapter === chapter.id ? 'text-blue-700 font-medium' : 'text-gray-700'}`}>
                                  {chapter.title.split(':')[1]?.trim() || chapter.title}
                                </h4>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Questions Panel (Detail) */}
            <div className="w-3/5 bg-white rounded-lg shadow-sm h-full flex flex-col">
              <div className="p-4 border-b bg-gray-50 rounded-t-lg flex justify-between items-center">
                <h3 className="font-medium text-gray-800">
                  {selectedChapter ? 
                    `Questions: ${selectedBookData?.chapters.find(c => c.id === selectedChapter)?.title.split(':')[1]?.trim()}` : 
                    'Select a chapter to view questions'
                  }
                </h3>
                {selectedBookData && selectedChapter && (
                  <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">
                    {selectedBookData.title}
                  </span>
                )}
              </div>
              
              <div className="overflow-y-auto flex-grow">
                {isLoading ? (
                  <div className="flex justify-center items-center h-48">
                    <div className="flex flex-col items-center">
                      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500 mb-2"></div>
                      <p className="text-gray-500 text-sm">Loading questions...</p>
                    </div>
                  </div>
                ) : questions.length > 0 ? (
                  <div className="p-4 space-y-3">
                    {questions.map((question, index) => (
                      <div
                        key={question.id}
                        className="block w-full text-left p-4 border border-gray-100 rounded-md hover:bg-blue-50 hover:border-blue-100 transition-colors duration-200 cursor-pointer"
                        onClick={() => onQuestionSelected(question)}
                        style={{ animationDelay: `${index * 100}ms` }}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mr-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center bg-${
                              question.difficulty === 'easy' ? 'green' : 
                              question.difficulty === 'medium' ? 'yellow' : 'red'
                            }-100 text-${
                              question.difficulty === 'easy' ? 'green' : 
                              question.difficulty === 'medium' ? 'yellow' : 'red'
                            }-700 text-xs font-medium`}>
                              {question.difficulty === 'easy' ? 'E' : 
                               question.difficulty === 'medium' ? 'M' : 'H'}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium text-gray-800 mb-1 line-clamp-2">{question.text}</p>
                            <div className="flex items-center text-xs text-gray-500 mt-2">
                              <span className="flex items-center mr-3">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {question.options?.length || 0} options
                              </span>
                              <span className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full text-xs">
                                {question.difficulty}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : selectedChapter ? (
                  <div className="p-4 flex flex-col items-center justify-center h-48 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>No questions available for this chapter</p>
                  </div>
                ) : (
                  <div className="p-4 flex flex-col items-center justify-center h-48 text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <p>Please select a chapter to view questions</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          // AI Tab content (keeping the original implementation)
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
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200"
                onClick={handleAIFetch}
                disabled={!concept || isLoading}
                type="button"
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
                
                {/* Question 1 */}
                <button
                  key="question-1"
                  className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                  onClick={() => onQuestionSelected({
                    id: "question-1",
                    text: "A fair coin is tossed five times. What is the conditional probability of obtaining exactly three heads, given that the first toss resulted in a head?",
                    difficulty: "medium",
                    options: [
                      { id: 'A', text: '1/6', isCorrect: true },
                      { id: 'B', text: '1/12', isCorrect: false },
                      { id: 'C', text: '4/52', isCorrect: false },
                      { id: 'D', text: '1/26', isCorrect: false },
                      { id: 'D', text: '1/4', isCorrect: false },
                    ],
                    subject: "Mathematics",
                    chapter: "Probability"
                  })}
                  type="button"
                >
                  <p className="font-medium">A fair coin is tossed five times. What is the conditional probability of obtaining exactly three heads, given that the first toss resulted in a head?
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty: medium | Options: 4
                  </p>
                </button>
                
                {/* Question 2 */}
                <button
                  key="question-2"
                  className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                  onClick={() => onQuestionSelected({
                    id: "question-2",
                    text: "One Indian and four American men and their wives are to be seated randomly around a circular table. Then the conditional probability that the Indian man is seated adjacent to his wife given that each American man is seated adjacent to his wife is",
                    difficulty: "hard",
                    options: [
                      { id: 'A', text: '2/5', isCorrect: true },
                      { id: 'B', text: '4/5', isCorrect: false },
                      { id: 'C', text: '5/6', isCorrect: false },
                      { id: 'D', text: '1/6', isCorrect: false },
                    ],
                    subject: "Mathematics",
                    chapter: "Combinations"
                  })}
                  type="button"
                >
                  <p className="font-medium">One Indian and four American men and their wives are to be seated randomly around a circular table. Then the conditional probability that the Indian man is seated adjacent to his wife given that each American man is seated adjacent to his wife is</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty: hard | Options: 4
                  </p>
                </button>
                
                {/* Question 3 */}
                <button
                  key="question-3"
                  className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                  onClick={() => onQuestionSelected({
                    id: "question-3",
                    text: "A jar contains 8 red, 7 green, and 5 blue marbles. Two marbles are drawn sequentially without replacement. What is the probability that both marbles drawn are red, given that at least one marble drawn is red?",
                    difficulty: "easy",
                    options: [
                      { id: 'A', text: '3', isCorrect: false },
                      { id: 'B', text: '6', isCorrect: true },
                      { id: 'C', text: '9', isCorrect: false },
                      { id: 'D', text: '27', isCorrect: false },
                    ],
                    subject: "Mathematics",
                    chapter: "Permutations"
                  })}
                  type="button"
                >
                  <p className="font-medium">A jar contains 8 red, 7 green, and 5 blue marbles. Two marbles are drawn sequentially without replacement. What is the probability that both marbles drawn are red, given that at least one marble drawn is red?</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty: easy | Options: 4
                  </p>
                </button>
                
                {/* Question 4 */}
                <button
                  key="question-4"
                  className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                  onClick={() => onQuestionSelected({
                    id: "question-4",
                    text: "What is the probability of drawing an ace from a standard deck of cards?",
                    difficulty: "medium",
                    options: [
                      { id: 'A', text: '1/13', isCorrect: true },
                      { id: 'B', text: '1/4', isCorrect: false },
                      { id: 'C', text: '4/52', isCorrect: false },
                      { id: 'D', text: '1/26', isCorrect: false },
                    ],
                    subject: "Mathematics",
                    chapter: "Probability"
                  })}
                  type="button"
                >
                  <p className="font-medium">What is the probability of drawing an ace from a standard deck of cards?</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Difficulty: medium | Options: 4
                  </p>
                </button>
              </div>
            ) : (
              <p className="text-gray-500">No questions available. Try asking for a different concept.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LibrarySelect;