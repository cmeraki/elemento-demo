import { useState, ChangeEvent, DragEvent, useRef } from 'react';
import { Question } from '../../types';
import { extractTextFromImage } from '../../ utils/ocr';

interface UploadQuestionProps {
  onQuestionSelected: (question: Question) => void;
}

const UploadQuestion = ({ onQuestionSelected }: UploadQuestionProps) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [extractedText, setExtractedText] = useState('');
  const [parsedQuestion, setParsedQuestion] = useState<Question | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };
  
  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const handleFileInput = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };
  
  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  const processFile = async (file: File) => {
    setIsLoading(true);
    
    try {
      // Extract text from image using OCR
      const text = await extractTextFromImage(file);
      setExtractedText(text);
      
      // Parse text into question format
      // This is a simplified example - in a real app, you'd need more robust parsing
      const parsedQuestion = parseQuestionFromText(text);
      setParsedQuestion(parsedQuestion);
    } catch (error) {
      console.error('Error processing file:', error);
      // Handle error
    } finally {
      setIsLoading(false);
    }
  };
  
  const parseQuestionFromText = (text: string): Question => {
    // This is a simplified example of parsing
    // In a real app, you'd want more sophisticated parsing logic
    
    // Split by lines
    const lines = text.split('\n').filter(line => line.trim() !== '');
    
    // Assume first line is the question
    const questionText = lines[0];
    
    // Assume subsequent lines with A), B), etc. are options
    const options = lines.slice(1)
      .filter(line => /^[A-D]\)/.test(line))
      .map(line => {
        const optionLetter = line.charAt(0);
        const optionText = line.substring(3).trim();
        return { 
          id: optionLetter, 
          text: optionText,
          isCorrect: false
        };
      });
    
    // For demo purposes, mark the first option as correct
    if (options.length > 0) {
      options[0].isCorrect = true;
    }
    
    return {
      id: Math.random().toString(36).substring(2, 9),
      text: questionText,
      options,
      difficulty: 'medium',
      subject: 'Unknown',
      chapter: 'Unknown'
    };
  };
  
  const handleConfirmQuestion = () => {
    if (parsedQuestion) {
      onQuestionSelected(parsedQuestion);
    }
  };
  
  return (
    <div className="h-full flex flex-col">
      {!parsedQuestion ? (
        <>
          <div
            className={`flex-grow border-2 border-dashed rounded-lg flex flex-col items-center justify-center p-6 ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            
            <p className="text-lg text-gray-600 mb-2">
              {isDragging ? 'Drop your file here' : 'Drag and drop your image here'}
            </p>
            <p className="text-sm text-gray-500 mb-4">or select a method below</p>
            
            <div className="flex space-x-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                onClick={() => fileInputRef.current?.click()}
              >
                Browse Files
              </button>
              
              <button
                className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
                onClick={handleCameraCapture}
              >
                Use Camera
              </button>
            </div>
            
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              capture="environment"
              onChange={handleFileInput}
            />
          </div>
          
          {isLoading && (
            <div className="mt-4 p-4 flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
            </div>
          )}
        </>
      ) : (
        <div className="flex-grow flex flex-col">
          <div className="bg-gray-100 p-4 rounded-lg mb-4">
            <h3 className="font-medium mb-2">Extracted Question:</h3>
            <p className="mb-4">{parsedQuestion.text}</p>
            
            <h3 className="font-medium mb-2">Options:</h3>
            <div className="space-y-2">
              {parsedQuestion.options.map((option) => (
                <div key={option.id} className="flex items-center">
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name="correct-option"
                    checked={option.isCorrect}
                    onChange={() => {
                      const updatedOptions = parsedQuestion.options.map(opt => ({
                        ...opt,
                        isCorrect: opt.id === option.id
                      }));
                      
                      setParsedQuestion({
                        ...parsedQuestion,
                        options: updatedOptions
                      });
                    }}
                    className="mr-2"
                  />
                  <label htmlFor={`option-${option.id}`}>{option.id}) {option.text}</label>
                </div>
              ))}
            </div>
            
            <p className="text-sm text-gray-500 mt-4">
              Select the correct option above. You can edit this question after it's loaded.
            </p>
          </div>
          
          <div className="flex space-x-4">
            <button
              className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
              onClick={() => setParsedQuestion(null)}
            >
              Cancel
            </button>
            
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              onClick={handleConfirmQuestion}
            >
              Confirm Question
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadQuestion;