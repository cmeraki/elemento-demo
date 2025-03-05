export const extractTextFromImage = async (file: File): Promise<string> => {
    // In a real application, you would use a proper OCR service
    // like Tesseract.js, Google Cloud Vision, or Azure Computer Vision
    
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