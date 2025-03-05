"use client";
import { useState } from 'react';
import Canvas from '../components/canvas/Canvas';
import QuestionSelect from '../components/question/QuestionSelect';
import QuestionDisplay from '../components/question/QuestionDisplay';
import { Question } from '../types';

export default function Home() {
  const [showQuestionSelect, setShowQuestionSelect] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(true);
  
  const handleQuestionSelected = (question: Question) => {
    setSelectedQuestion(question);
    setShowQuestionSelect(false);
    setShowQuestion(true);
  };
  
  const handleNewQuestion = () => {
    setShowQuestionSelect(true);
  };
  
  const handleCloseQuestion = () => {
    setShowQuestion(false);
  };
  
  // Create a sample math question if nothing is selected
  const sampleQuestion: Question = {
    id: 'sample-1',
    text: 'What is the derivative of f(x) = x³ + 2x² - 4x + 7?',
    options: [
      { id: 'A', text: '3x² + 4x - 4', isCorrect: true },
      { id: 'B', text: '3x² + 2x - 4', isCorrect: false },
      { id: 'C', text: '3x² + 4x', isCorrect: false },
      { id: 'D', text: 'x³ + 4x - 4', isCorrect: false },
    ],
    difficulty: 'medium',
    subject: 'Mathematics',
    chapter: 'Calculus'
  };
  
  return (
    <div className="h-screen w-screen relative bg-gray-50">
      <Canvas />
      
      {showQuestionSelect && (
        <div className="absolute inset-0 bg-white bg-opacity-95 z-10">
          <QuestionSelect onQuestionSelected={handleQuestionSelected} />
        </div>
      )}
      
      {/* Display either the selected question or the sample question if nothing is selected yet */}
      {((selectedQuestion && !showQuestionSelect) || (!selectedQuestion && !showQuestionSelect)) && showQuestion && (
        <QuestionDisplay 
          question={selectedQuestion || sampleQuestion}
          onClose={handleCloseQuestion}
        />
      )}
      
      {/* Floating button to show question again if it was closed */}
      {!showQuestion && !showQuestionSelect && (
        <button
          className="absolute top-6 right-6 bg-blue-500 text-white p-2 rounded-full shadow-lg"
          onClick={() => setShowQuestion(true)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
      )}
      
      {/* Floating button to add new question */}
      {!showQuestionSelect && (
        <button
          className="absolute bottom-24 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={handleNewQuestion}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}