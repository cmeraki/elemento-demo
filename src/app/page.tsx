"use client";
import { useState } from 'react';
import Canvas from '../components/canvas/Canvas';
import QuestionSelect from '../components/question/QuestionSelect';
import QuestionDisplay from '../components/question/QuestionDisplay';
import { Question } from '../types';

export default function Home() {
  const [showQuestionSelect, setShowQuestionSelect] = useState(true);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  
  const handleQuestionSelected = (question: Question) => {
    setSelectedQuestion(question);
    setShowQuestionSelect(false);
  };
  
  const handleNewQuestion = () => {
    setShowQuestionSelect(true);
  };
  
  return (
    <div className="h-screen w-screen relative bg-gray-50">
      <Canvas 
        question={selectedQuestion}
        onNewQuestion={handleNewQuestion}
      />
      
      {showQuestionSelect && (
        <div className="absolute inset-0 bg-white bg-opacity-95 z-10">
          <QuestionSelect onQuestionSelected={handleQuestionSelected} />
        </div>
      )}
      
      {selectedQuestion && !showQuestionSelect && (
        <div className="absolute top-0 left-0 right-0 p-4 bg-white shadow-md z-5">
          <QuestionDisplay 
            question={selectedQuestion} 
          />
        </div>
      )}
    </div>
  );
}
