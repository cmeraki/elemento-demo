'use client';
// src/app/page.tsx
// Updated to use permanent sidebar and adjust layout

import { useState, useEffect, useCallback, useRef } from 'react';
import Canvas from '../components/canvas/Canvas';
import QuestionSelect from '../components/question/QuestionSelect';
import QuestionDisplay from '../components/question/QuestionDisplay';
import Sidebar from '../components/sidebar/Sidebar';
import Solution from '../components/solution/Solution';
import AIButton from '../components/ai/AIButton';
import ImplicitChecker from '../components/ai/ImplicitChecker';
import Checker from '../components/ai/Checker';
import Hint from '../components/ai/Hint';
import { Question, AppView, AIMode, CanvasData, CheckResult } from '../types';
import { useTabletLayout } from '../hooks/useTabletLayout';

export default function Home() {
  // App state
  const [currentView, setCurrentView] = useState<AppView>('questionSelect');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(true);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  
  // AI state
  const [aiMode, setAiMode] = useState<AIMode | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [implicitCheckResult, setImplicitCheckResult] = useState<CheckResult | null>(null);
  
  // Get tablet layout values
  const { canvasHeight, questionBarHeight } = useTabletLayout();
  
  // Track if we should update canvas data
  const isUpdatingCanvasRef = useRef(false);
  const checkerWasShownRef = useRef(false);
  
  // Setup dynamic viewport height
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    
    return () => {
      window.removeEventListener('resize', setVh);
    };
  }, []);
  
  // Reset AI components when view changes
  useEffect(() => {
    if (currentView !== 'canvas') {
      setAiMode(null);
      setIsListening(false);
      setShowChecker(false);
      setShowHint(false);
      checkerWasShownRef.current = false;
    }
  }, [currentView]);
  
  const handleQuestionSelected = useCallback((question: Question) => {
    setSelectedQuestion(question);
    setCurrentView('canvas');
    setShowQuestion(true);
    setImplicitCheckResult(null);
    setCanvasData(null);
  }, []);
  
  const handleNewQuestion = useCallback(() => {
    setCurrentView('questionSelect');
  }, []);
  
  const handleCloseQuestion = useCallback(() => {
    setShowQuestion(false);
  }, []);
  
  const handleShowSolution = useCallback(() => {
    setCurrentView('solution');
  }, []);
  
  const handleShowCanvas = useCallback(() => {
    setCurrentView('canvas');
  }, []);
  
  const handleCanvasUpdate = useCallback((data: CanvasData) => {
    if (isUpdatingCanvasRef.current) return;
    
    if (
      canvasData?.paths === data.paths && 
      canvasData?.steps?.length === data.steps?.length
    ) {
      return;
    }
    
    isUpdatingCanvasRef.current = true;
    setCanvasData(data);
    
    setTimeout(() => {
      isUpdatingCanvasRef.current = false;
    }, 0);
    
    if (checkerWasShownRef.current && showChecker) {
      setTimeout(() => {
        setShowChecker(false);
      }, 300);
    }
  }, [canvasData, showChecker]);
  
  const handleAIButtonClick = useCallback(() => {
    setIsListening(true);
  }, []);
  
  const handleVoiceIntent = useCallback((intent: AIMode) => {
    setAiMode(intent);
    setIsListening(false);
    
    if (intent === 'checker') {
      setShowChecker(true);
      setShowHint(false);
      checkerWasShownRef.current = true;
    } else if (intent === 'hint') {
      setShowHint(true);
      setShowChecker(false);
    }
  }, []);
  
  const handleImplicitCheck = useCallback((result: CheckResult) => {
    if (result.hasError || (implicitCheckResult && implicitCheckResult.hasError)) {
      setImplicitCheckResult(result);
    }
  }, [implicitCheckResult]);
  
  const closeAIModals = useCallback(() => {
    setShowChecker(false);
    setShowHint(false);
  }, []);
  
  // Make sure we have a question
  const displayQuestion = selectedQuestion || {
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
    chapter: 'Calculus',
    solution: {
      steps: [
        { id: 1, content: "Apply the power rule for each term", latex: "f'(x) = \\frac{d}{dx}(x^3) + \\frac{d}{dx}(2x^2) - \\frac{d}{dx}(4x) + \\frac{d}{dx}(7)" },
        { id: 2, content: "Compute the derivative of each term", latex: "f'(x) = 3x^2 + 2 \\cdot 2x^1 - 4 \\cdot 1 + 0" },
        { id: 3, content: "Simplify", latex: "f'(x) = 3x^2 + 4x - 4" }
      ]
    }
  };
  
  return (
    <div className="h-[100dvh] w-screen relative bg-gray-50 overflow-hidden use-real-height">
      {/* Permanent Sidebar */}
      {currentView !== 'questionSelect' && (
        <Sidebar
          onShowSolution={handleShowSolution}
          onShowCanvas={handleShowCanvas}
          currentView={currentView}
        />
      )}
      
      {/* Main Content - Adjusted for sidebar */}
      <div className={`relative h-full ${currentView !== 'questionSelect' ? 'ml-12' : ''}`}>
        {/* Question Select View */}
        {currentView === 'questionSelect' && (
          <div className="absolute inset-0 bg-white z-10">
            <QuestionSelect onQuestionSelected={handleQuestionSelected} />
          </div>
        )}
        
        {/* Canvas View */}
        {currentView === 'canvas' && (
          <>
            <Canvas 
              onUpdate={handleCanvasUpdate}
              canvasData={canvasData}
              question={displayQuestion}
              onNewQuestion={handleNewQuestion}
              style={{ 
                height: canvasHeight,
                marginTop: `${questionBarHeight}px`
              }}
            />
            
            {/* Question Display */}
            {showQuestion && (
              <QuestionDisplay 
                question={displayQuestion}
                onClose={handleCloseQuestion}
              />
            )}
            
            {/* Floating button to show question if closed */}
            {!showQuestion && (
              <button
                className="absolute top-3 right-3 bg-blue-500 text-white p-2 rounded-full shadow-lg"
                onClick={() => setShowQuestion(true)}
                aria-label="Show question"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </button>
            )}
            
            {/* AI Button */}
            <AIButton 
              isListening={isListening}
              onClick={handleAIButtonClick}
              onVoiceIntent={handleVoiceIntent}
            />
            
            {/* Implicit Checker */}
            {canvasData && canvasData.paths && canvasData.paths.length > 0 && (
              <ImplicitChecker 
                canvasData={canvasData}
                question={displayQuestion}
                onCheckResult={handleImplicitCheck}
              />
            )}
            
            {/* Checker Component */}
            {showChecker && canvasData && (
              <Checker 
                canvasData={canvasData}
                question={displayQuestion}
                onClose={closeAIModals}
              />
            )}
            
            {/* Hint Component */}
            {showHint && canvasData && (
              <Hint
                canvasData={canvasData}
                question={displayQuestion}
                onClose={closeAIModals}
              />
            )}
            
            {/* Error notification from implicit checker */}
            {implicitCheckResult && implicitCheckResult.hasError && !showChecker && (
              <button 
                className="absolute top-1/4 right-3 bg-red-100 text-red-700 p-2 rounded-full shadow-lg cursor-pointer animate-bounce"
                onClick={() => setShowChecker(true)}
                aria-label="Show error details"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </button>
            )}
            
            {/* Floating button to add new question */}
            <button
              className="absolute bottom-14 right-3 bg-blue-500 text-white p-2 rounded-full shadow-lg"
              onClick={handleNewQuestion}
              aria-label="New question"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </>
        )}
        
        {/* Solution View */}
        {currentView === 'solution' && (
          <Solution 
            question={displayQuestion}
            onBack={handleShowCanvas}
          />
        )}
      </div>
    </div>
  );
}