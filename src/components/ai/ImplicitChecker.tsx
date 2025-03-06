// src/components/ai/ImplicitChecker.tsx
import { useEffect, useRef } from 'react';
import { Question, CheckResult, CanvasData } from '../../types';
import { useChecker } from '../../hooks/useChecker';

interface ImplicitCheckerProps {
  canvasData: CanvasData | null;
  question: Question;
  onCheckResult: (result: CheckResult) => void;
}

const ImplicitChecker = ({ canvasData, question, onCheckResult }: ImplicitCheckerProps) => {
  const lastCheckTimeRef = useRef<number>(0);
  const { checkWork } = useChecker();
  const prevCanvasDataRef = useRef<CanvasData | null>(null);
  
  useEffect(() => {
    const CHECK_INTERVAL = 10000; // 10 seconds
    
    if (!canvasData) return;
    
    // Skip checking if canvasData hasn't changed
    if (
      prevCanvasDataRef.current?.paths === canvasData.paths &&
      prevCanvasDataRef.current?.steps?.length === canvasData.steps?.length
    ) {
      return;
    }
    
    // Update the reference to the current canvasData
    prevCanvasDataRef.current = canvasData;
    
    const now = Date.now();
    if (now - lastCheckTimeRef.current > CHECK_INTERVAL) {
      // Only check if there are recognized steps
      if (canvasData.steps && canvasData.steps.length > 0) {
        const checkResult = checkWork(canvasData, question);
        onCheckResult(checkResult);
      }
      
      lastCheckTimeRef.current = now;
    }
    
    // Set up the interval for periodic checks
    const intervalId = setInterval(() => {
      // Skip if nothing to check
      if (!canvasData.steps || canvasData.steps.length === 0) return;
      
      const checkResult = checkWork(canvasData, question);
      onCheckResult(checkResult);
      lastCheckTimeRef.current = Date.now();
    }, CHECK_INTERVAL);
    
    return () => {
      clearInterval(intervalId);
    };
  }, [canvasData, question, checkWork, onCheckResult]);
  
  // This component doesn't render anything
  return null;
};

export default ImplicitChecker;