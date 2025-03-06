export const extractTextFromImage = async (file: File): Promise<string> => {
  // Use the file parameter to actually process it
  console.log(`Processing file: ${file.name}, size: ${file.size} bytes`);
  
  // This is a mock implementation for demonstration purposes
  return new Promise((resolve) => {
    setTimeout(() => {
      // Mock OCR result
      const mockedText = `What is the value of x in the equation 2x + 5 = 15?
A) x = 5
B) x = 10
C) x = -5
D) x = 6`;
      
      resolve(mockedText);
    }, 1500); // Simulate processing time
  });
};

// src/utils/speechRecognition.ts
// This is a mock implementation for speech recognition
// In a real app, you would use the Web Speech API

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
  
  // Simulate an occasional error
  if (Math.random() < 0.1) {
    onError("Couldn't hear you clearly, please try again.");
  }
  
  return {
    stop: () => {
      clearTimeout(timeoutId);
      console.log('Speech recognition stopped');
    }
  };
};