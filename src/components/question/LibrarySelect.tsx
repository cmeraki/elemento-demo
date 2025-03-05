import { useState } from 'react';
import { Question } from '../../types';

// Mock data - in a real app this would come from an API or file
import { getQuestions } from '../../types';

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

const LibrarySelect = ({ onQuestionSelected }: LibrarySelectProps) => {
  const [selectedTab, setSelectedTab] = useState<'textbook' | 'ai'>('textbook');
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [concept, setConcept] = useState('');
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleBookSelect = (bookId: string) => {
    setSelectedBook(bookId);
    setSelectedChapter(null);
    setQuestions([]);
  };
  
  const handleChapterSelect = async (chapterId: string) => {
    setSelectedChapter(chapterId);
    setIsLoading(true);
    
    try {
      // In a real app, fetch questions from API or file
      const chapterQuestions = await getQuestions({
        chapterId,
        count: 5
      });
      
      setQuestions(chapterQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleAIFetch = async () => {
    if (!concept) return;
    
    setIsLoading(true);
    
    try {
      // In a real app, fetch questions from AI API
      const aiQuestions = await getQuestions({
        concept,
        difficulty,
        count: 5
      });
      
      setQuestions(aiQuestions);
    } catch (error) {
      console.error('Error fetching AI questions:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
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
            AI Generated
          </button>
        </div>
      </div>
      
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
                  {books
                    .find(book => book.id === selectedBook)
                    ?.chapters.map((chapter) => (
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
                    ))}
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
                        Difficulty: {question.difficulty} | Options: {question.options.length}
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
              <label className="block text-gray-700 font-medium mb-2">
                Enter Concept or Problem Scenario
              </label>
              <textarea
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
                placeholder="e.g., 'Conservation of momentum in elastic collisions' or 'Word problems about percentage'"
                value={concept}
                onChange={(e) => setConcept(e.target.value)}
              ></textarea>
            </div>
            
            <div className="mb-6">
              <label className="block text-gray-700 font-medium mb-2">
                Select Difficulty Level
              </label>
              <div className="flex space-x-4">
                <button
                  className={`px-4 py-2 rounded-md ${
                    difficulty === 'easy' 
                      ? 'bg-green-100 text-green-700 border border-green-300' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setDifficulty('easy')}
                >
                  Easy
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    difficulty === 'medium' 
                      ? 'bg-yellow-100 text-yellow-700 border border-yellow-300' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setDifficulty('medium')}
                >
                  Medium
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${
                    difficulty === 'hard' 
                      ? 'bg-red-100 text-red-700 border border-red-300' 
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                  onClick={() => setDifficulty('hard')}
                >
                  Hard
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed"
                onClick={handleAIFetch}
                disabled={!concept || isLoading}
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
                <h3 className="font-medium">AI Generated Questions</h3>
                {questions.map((question) => (
                  <button
                    key={question.id}
                    className="block w-full text-left p-3 border rounded-md hover:bg-gray-50"
                    onClick={() => onQuestionSelected(question)}
                  >
                    <p className="font-medium">{question.text}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Difficulty: {question.difficulty} | Options: {question.options.length}
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