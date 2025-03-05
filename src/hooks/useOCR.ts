import { useState } from 'react';
import { extractTextFromImage } from '../ utils/ocr';

export const useOCR = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const processImage = async (file: File) => {
    setIsProcessing(true);
    setError(null);
    
    try {
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      return text;
    } catch (err) {
      setError('Failed to extract text from image');
      throw err;
    } finally {
      setIsProcessing(false);
    }
  };
  
  return {
    isProcessing,
    extractedText,
    error,
    processImage
  };
};