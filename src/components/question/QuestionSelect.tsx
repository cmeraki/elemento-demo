import { useState } from 'react';
import UploadQuestion from './UploadQuestion';
import LibrarySelect from './LibrarySelect';
import { Question } from '../../types';

interface QuestionSelectProps {
  onQuestionSelected: (question: Question) => void;
}

const QuestionSelect = ({ onQuestionSelected }: QuestionSelectProps) => {
  const [selectedTab, setSelectedTab] = useState<'upload' | 'library'>('upload');
  
  return (
    <div className="h-full flex flex-col p-6">
      <h1 className="text-2xl font-bold mb-6">Select a Question</h1>
      
      <div className="mb-6">
        <div className="flex border-b border-gray-200">
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === 'upload' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('upload')}
          >
            Upload Question
          </button>
          <button
            className={`px-4 py-2 font-medium ${
              selectedTab === 'library' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setSelectedTab('library')}
          >
            Question Library
          </button>
        </div>
      </div>
      
      <div className="flex-grow">
        {selectedTab === 'upload' ? (
          <UploadQuestion onQuestionSelected={onQuestionSelected} />
        ) : (
          <LibrarySelect onQuestionSelected={onQuestionSelected} />
        )}
      </div>
    </div>
  );
};

export default QuestionSelect;