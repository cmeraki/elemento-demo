import { CanvasStep } from '../../types';

interface AnnotationProps {
  step: {
    id: string;
    isCorrect: boolean;
    errorMessage?: string;
  };
  canvasStep?: CanvasStep;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

const Annotation = ({ step, canvasStep, isExpanded, onToggleExpand }: AnnotationProps) => {
  if (!canvasStep) return null;
  
  const { bbox } = canvasStep;
  
  // Position the annotation to the right of the step
  const annotationX = bbox.x + bbox.width + 10;
  const annotationY = bbox.y + (bbox.height / 2) - 12; // Center vertically
  
  const annotationStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotationX}px`,
    top: `${annotationY}px`,
    pointerEvents: 'auto', // Make clickable
  };
  
  // Position error message slightly below the annotation
  const errorMessageStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotationX}px`,
    top: `${annotationY + 30}px`,
    width: '280px',
    pointerEvents: 'auto', // Make clickable
  };
  
  return (
    <>
      <div 
        className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-white
          ${step.isCorrect 
            ? 'bg-green-500 hover:bg-green-600' 
            : 'bg-red-500 hover:bg-red-600'
          }`}
        style={annotationStyle}
        onClick={onToggleExpand}
      >
        {step.isCorrect ? '✓' : '✗'}
      </div>
      
      {!step.isCorrect && isExpanded && (
        <div 
          className="bg-white border border-red-200 rounded-md shadow-lg p-3 z-10 animate-fade-in"
          style={errorMessageStyle}
        >
          <p className="text-red-700 text-sm">{step.errorMessage}</p>
        </div>
      )}
    </>
  );
};

export default Annotation;
