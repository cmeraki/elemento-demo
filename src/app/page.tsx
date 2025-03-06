'use client';

// src/app/page.tsx - Updated to handle Checker component properly
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

export default function Home() {
  // App state
  const [currentView, setCurrentView] = useState<AppView>('questionSelect');
  const [selectedQuestion, setSelectedQuestion] = useState<Question | null>(null);
  const [showQuestion, setShowQuestion] = useState(true);
  const [showSidebar, setShowSidebar] = useState(false);
  const [canvasData, setCanvasData] = useState<CanvasData | null>(null);
  
  // AI state
  const [aiMode, setAiMode] = useState<AIMode | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [showChecker, setShowChecker] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [implicitCheckResult, setImplicitCheckResult] = useState<CheckResult | null>(null);
  
  // Track if we should update canvas data
  const isUpdatingCanvasRef = useRef(false);
  const checkerWasShownRef = useRef(false);
  
  // Reset AI components when view changes
  useEffect(() => {
    if (currentView !== 'canvas') {
      setAiMode(null);
      setIsListening(false);
      setShowChecker(false);
      setShowHint(false);
      // Don't reset implicitCheckResult here as we need it when returning to canvas
      checkerWasShownRef.current = false;
    }
  }, [currentView]);
  
  const handleQuestionSelected = useCallback((question: Question) => {
    setSelectedQuestion(question);
    setCurrentView('canvas');
    setShowQuestion(true);
    setImplicitCheckResult(null); // Reset any previous check results
    setCanvasData(null); // Reset canvas data
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
  
  const toggleSidebar = useCallback(() => {
    setShowSidebar(!showSidebar);
  }, [showSidebar]);
  
  // Wrap canvas update handler in useCallback to prevent re-creation
  const handleCanvasUpdate = useCallback((data: CanvasData) => {
    // Prevent infinite update cycles by checking if we're already updating
    if (isUpdatingCanvasRef.current) return;
    
    // Don't update if nothing has changed
    if (
      canvasData?.paths === data.paths && 
      canvasData?.steps?.length === data.steps?.length
    ) {
      return;
    }
    
    isUpdatingCanvasRef.current = true;
    setCanvasData(data);
    
    // Reset update flag after state update completes
    setTimeout(() => {
      isUpdatingCanvasRef.current = false;
    }, 0);
    
    // If the checker was shown and the canvas is updated, auto-hide it
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
  
  // Wrap implicit check handler in useCallback
  const handleImplicitCheck = useCallback((result: CheckResult) => {
    // Only update if there's an error or if previous result had an error
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
    <div className="h-screen w-screen relative bg-gray-50 overflow-hidden">
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
              className="absolute top-6 right-6 bg-blue-500 text-white p-2 rounded-full shadow-lg"
              onClick={() => setShowQuestion(true)}
              aria-label="Show question"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          
          {/* Implicit Checker - Only show when we have canvas data */}
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
              className="absolute top-1/4 right-12 bg-red-100 text-red-700 p-2 rounded-full shadow-lg cursor-pointer animate-bounce"
              onClick={() => setShowChecker(true)}
              aria-label="Show error details"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </button>
          )}
        </>
      )}
      
      {/* Solution View */}
      {currentView === 'solution' && (
        <Solution 
          question={displayQuestion}
          onBack={handleShowCanvas}
        />
      )}
      
      {/* Sidebar Toggle Button */}
      {currentView !== 'questionSelect' && (
        <button
          className="absolute top-6 left-6 bg-gray-800 text-white p-2 rounded-md shadow-lg z-20"
          onClick={toggleSidebar}
          aria-label="Toggle sidebar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {/* Sidebar */}
      {showSidebar && (
        <Sidebar 
          onShowSolution={handleShowSolution}
          onShowCanvas={handleShowCanvas}
          currentView={currentView}
          onClose={() => setShowSidebar(false)}
        />
      )}
      
      {/* Floating button to add new question */}
      {currentView !== 'questionSelect' && (
        <button
          className="absolute bottom-24 right-6 bg-blue-500 text-white p-3 rounded-full shadow-lg"
          onClick={handleNewQuestion}
          aria-label="New question"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      )}
    </div>
  );
}