import { useState, useEffect } from 'react';
import { AIMode } from '../../types';
import { useVoiceRecognition } from '../../hooks/useVoiceRecognition';

interface AIButtonProps {
  isListening: boolean;
  onClick: () => void;
  onVoiceIntent: (intent: AIMode) => void;
}

const AIButton = ({ isListening, onClick, onVoiceIntent }: AIButtonProps) => {
  const [animationScale, setAnimationScale] = useState(1);
  const { startListening, stopListening, transcript } = useVoiceRecognition();
  
  useEffect(() => {
    let animationInterval: NodeJS.Timeout;
    
    if (isListening) {
      // Start voice recognition
      startListening();
      
      // Start pulsing animation
      animationInterval = setInterval(() => {
        setAnimationScale((scale) => (scale === 1 ? 1.1 : 1));
      }, 600);
    } else {
      stopListening();
      setAnimationScale(1);
      
      // Process the transcript to determine intent
      if (transcript) {
        const lowerTranscript = transcript.toLowerCase();
        
        if (lowerTranscript.includes('check') || lowerTranscript.includes('correct') || lowerTranscript.includes('verify')) {
          onVoiceIntent('checker');
        } else if (lowerTranscript.includes('hint') || lowerTranscript.includes('help') || lowerTranscript.includes('stuck')) {
          onVoiceIntent('hint');
        }
      }
    }
    
    return () => {
      if (animationInterval) {
        clearInterval(animationInterval);
      }
      stopListening();
    };
  }, [isListening, startListening, stopListening, transcript, onVoiceIntent]);
  
  return (
    <button
      className={`fixed right-8 top-1/2 transform -translate-y-1/2 z-20
        ${isListening 
          ? 'bg-gradient-to-r from-blue-500 to-purple-600' 
          : 'bg-gradient-to-r from-blue-400 to-blue-600'
        } 
        text-white rounded-full shadow-lg p-4 transition-all duration-300 ease-in-out`}
      style={{ 
        transform: `translateY(-50%) scale(${animationScale})`,
        boxShadow: isListening 
          ? '0 0 20px rgba(79, 70, 229, 0.6)' 
          : '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}
      onClick={onClick}
      aria-label="AI Assistant"
    >
      <div className="relative">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        
        {isListening && (
          <div className="absolute -right-1 -top-1 w-4 h-4 bg-red-500 rounded-full animate-pulse"></div>
        )}
      </div>
    </button>
  );
};

export default AIButton;