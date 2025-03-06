// src/components/ai/Annotation.tsx - Fixed version
import { CanvasStep } from '../../types';

interface AnnotationProps {
  step: {
    id: string;
    isCorrect: boolean;
    errorMessage?: string;
    warningMessage?: string;
  };
  canvasStep: CanvasStep; // Made required since we check in parent component
  isExpanded: boolean;
  onToggleExpand: () => void;
  isWarning?: boolean;
}

const Annotation = ({ step, canvasStep, isExpanded, onToggleExpand, isWarning = false }: AnnotationProps) => {
  // Safely extract the bounding box
  const { bbox } = canvasStep;
  
  if (!bbox) {
    console.warn(`Missing bbox for step ${step.id}`);
    return null;
  }
  
  // Position the annotation to the right of the step
  const annotationX = bbox.x + bbox.width + 10;
  const annotationY = bbox.y + (bbox.height / 2) - 12; // Center vertically
  
  const annotationStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotationX}px`,
    top: `${annotationY}px`,
    pointerEvents: 'auto', // Make clickable
    zIndex: 10, // Ensure it's above the canvas
  };
  
  // Position error/warning message slightly below the annotation
  const messageStyle: React.CSSProperties = {
    position: 'absolute',
    left: `${annotationX}px`,
    top: `${annotationY + 30}px`,
    width: '280px',
    pointerEvents: 'auto', // Make clickable
    zIndex: 11, // Ensure it's above other elements
  };
  
  // Determine which icon and colors to use based on correctness and warning status
  let backgroundColor, hoverColor, icon, messageType, messageBorder, messageText, message;
  
  if (isWarning) {
    // Warning annotation (step may be affected by previous errors)
    backgroundColor = 'bg-yellow-500';
    hoverColor = 'hover:bg-yellow-600';
    icon = '!';
    messageType = 'bg-white';
    messageBorder = 'border-yellow-200';
    messageText = 'text-yellow-700';
    message = step.warningMessage || "This step may be affected by errors in previous steps.";
  } else if (!step.isCorrect) {
    // Error annotation
    backgroundColor = 'bg-red-500';
    hoverColor = 'hover:bg-red-600';
    icon = '✗';
    messageType = 'bg-white';
    messageBorder = 'border-red-200';
    messageText = 'text-red-700';
    message = step.errorMessage || "There's an error in this step.";
  } else {
    // Correct step annotation
    backgroundColor = 'bg-green-500';
    hoverColor = 'hover:bg-green-600';
    icon = '✓';
    messageType = 'bg-white';
    messageBorder = 'border-green-200';
    messageText = 'text-green-700';
    message = "This step looks correct!";
  }
  
  return (
    <>
      <div 
        className={`w-6 h-6 rounded-full flex items-center justify-center cursor-pointer text-white shadow-sm
          ${backgroundColor} ${hoverColor} transition-colors duration-150`}
        style={annotationStyle}
        onClick={onToggleExpand}
        role="button"
        aria-label={isWarning ? "Warning" : step.isCorrect ? "Correct step" : "Error in step"}
        aria-expanded={isExpanded}
      >
        {icon}
      </div>
      
      {isExpanded && (
        <div 
          className={`${messageType} border ${messageBorder} rounded-md shadow-lg p-3 z-10`}
          style={messageStyle}
          role="tooltip"
        >
          <p className={`${messageText} text-sm`}>{message}</p>
          
          {/* Add context-specific advice based on the type of message */}
          {!step.isCorrect && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
              Try reviewing your calculation and checking for errors.
            </div>
          )}
          
          {isWarning && (
            <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
              This step may be correct in isolation, but could be impacted by errors in previous steps.
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Annotation;