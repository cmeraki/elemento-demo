import { useEffect } from 'react';
import { AIMode } from '../../types';

interface ClassificationProps {
  transcript: string;
  onClassificationComplete: (intent: AIMode | null) => void;
}

const Classification = ({ transcript, onClassificationComplete }: ClassificationProps) => {
  useEffect(() => {
    if (!transcript) return;
    
    // Simulate processing delay
    const timer = setTimeout(() => {
      const lowerTranscript = transcript.toLowerCase();
      
      if (lowerTranscript.includes('check') || lowerTranscript.includes('verify') || lowerTranscript.includes('correct')) {
        onClassificationComplete('checker');
      } else if (lowerTranscript.includes('hint') || lowerTranscript.includes('help') || lowerTranscript.includes('stuck')) {
        onClassificationComplete('hint');
      } else {
        onClassificationComplete(null);
      }
    }, 1000);
    
    return () => {
      clearTimeout(timer);
    };
  }, [transcript, onClassificationComplete]);
  
  // This component doesn't render anything visible
  return null;
};

export default Classification;
