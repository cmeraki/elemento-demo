import { useState, useCallback, useEffect } from 'react';

interface UseVoiceRecognitionReturn {
  isListening: boolean;
  transcript: string;
  startListening: () => void;
  stopListening: () => void;
  resetTranscript: () => void;
}

export const useVoiceRecognition = (): UseVoiceRecognitionReturn => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  
  // Mock implementation - in a real app, you would use the Web Speech API
  const startListening = useCallback(() => {
    setIsListening(true);
    
    // Simulate receiving transcript after a delay
    const timer = setTimeout(() => {
      // Mock different types of requests for demonstration
      const mockTranscripts = [
        'Can you check my work please?',
        'Give me a hint on what to do next',
        'I need help with this problem',
        'Check if my solution is correct'
      ];
      
      const randomTranscript = mockTranscripts[Math.floor(Math.random() * mockTranscripts.length)];
      setTranscript(randomTranscript);
    }, 3000);
    
    return () => {
      clearTimeout(timer);
    };
  }, []);
  
  const stopListening = useCallback(() => {
    setIsListening(false);
  }, []);
  
  const resetTranscript = useCallback(() => {
    setTranscript('');
  }, []);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);
  
  return {
    isListening,
    transcript,
    startListening,
    stopListening,
    resetTranscript
  };
};