// src/components/ai/Hint.tsx
import { useState, useEffect, useRef } from 'react';
import { Question, CanvasData } from '../../types';
import { useHint } from '../../hooks/useHint';
import AICard from './AICard';

interface HintProps {
  canvasData: CanvasData | null;
  question: Question;
  onClose: () => void;
}

const Hint = ({ canvasData, question, onClose }: HintProps) => {
  const [isGenerating, setIsGenerating] = useState(true);
  const [hint, setHint] = useState<string>('');
  const autoCollapseTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const generationCompleteRef = useRef(false);
  const { generateHint } = useHint();
  
  useEffect(() => {
    if (!canvasData) return;
    if (generationCompleteRef.current) return; // Only generate hint once
    
    // Simulate hint generation with a delay
    const timer = setTimeout(() => {
      const hintText = generateHint(canvasData, question);
      setHint(hintText);
      setIsGenerating(false);
      generationCompleteRef.current = true;
      
      // Set auto-collapse timer
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
      }
      
      autoCollapseTimerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 10000); // 10 seconds
    }, 1500);
    
    return () => {
      clearTimeout(timer);
      if (autoCollapseTimerRef.current) {
        clearTimeout(autoCollapseTimerRef.current);
        autoCollapseTimerRef.current = null;
      }
    };
  }, [canvasData, question, generateHint]);
  
  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
    
    // Clear existing timer
    if (autoCollapseTimerRef.current) {
      clearTimeout(autoCollapseTimerRef.current);
      autoCollapseTimerRef.current = null;
    }
    
    // If expanding, set a new auto-collapse timer
    if (isCollapsed) {
      autoCollapseTimerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 10000); // 10 seconds
    }
  };
  
  if (!canvasData) {
    return (
      <AICard onClose={onClose}>
        <div className="p-4">
          <p className="text-gray-700">No work detected. Please write your solution steps on the canvas.</p>
        </div>
      </AICard>
    );
  }
  
  const renderHintCard = () => {
    if (isCollapsed) {
      return (
        <div 
          className="fixed right-28 top-1/2 transform -translate-y-1/2 bg-blue-100 text-blue-800 p-3 rounded-full shadow-md cursor-pointer pointer-events-auto animate-pulse"
          onClick={toggleCollapse}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
          </svg>
        </div>
      );
    }
    
    return (
      <AICard onClose={onClose}>
        <div className="p-4">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-bold text-lg">Hint</h3>
            <button 
              className="text-gray-500 hover:text-gray-700"
              onClick={toggleCollapse}
              aria-label="Collapse hint"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 10a1 1 0 011-1h8a1 1 0 110 2H6a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
          
          {isGenerating ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-3"></div>
              <p>Thinking about a helpful hint...</p>
            </div>
          ) : (
            <div className="bg-blue-50 p-3 rounded-md text-blue-700">
              <p>{hint}</p>
            </div>
          )}
        </div>
      </AICard>
    );
  };
  
  return (
    <div className="fixed right-8 bottom-32 max-w-sm z-20 pointer-events-none">
      {renderHintCard()}
    </div>
  );
};

export default Hint;