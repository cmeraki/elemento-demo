export const startSpeechRecognition = (
    onResult: (result: string) => void,
    onError: (error: string) => void
  ): { stop: () => void } => {
    console.log('Starting speech recognition...');
    
    // Simulate recognition delay
    const timeoutId = setTimeout(() => {
      const mockPhrases = [
        'Check my answer please',
        'I need a hint',
        'Is this correct?',
        'Help me with this problem',
        'Show me the next step'
      ];
      
      const randomPhrase = mockPhrases[Math.floor(Math.random() * mockPhrases.length)];
      onResult(randomPhrase);
    }, 3000);
    
    return {
      stop: () => {
        clearTimeout(timeoutId);
        console.log('Speech recognition stopped');
      }
    };
  };