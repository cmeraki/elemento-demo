import { ReactNode } from 'react';

interface DrawingToolsProps {
  activeTool: 'pen' | 'marker' | 'highlighter' | 'eraser';
  onToolChange: (tool: 'pen' | 'marker' | 'highlighter' | 'eraser') => void;
  onUndo: () => void;
  onRedo: () => void;
  onClear: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

interface ToolButtonProps {
  active: boolean;
  onClick: () => void;
  children: ReactNode;
  title: string;
}

const ToolButton = ({ active, onClick, children, title }: ToolButtonProps) => (
  <button
    className={`p-2 rounded-full ${active ? 'bg-white shadow-md' : 'text-gray-700 hover:bg-gray-200'}`}
    onClick={onClick}
    title={title}
  >
    {children}
  </button>
);

const DrawingTools = ({
  activeTool,
  onToolChange,
  onUndo,
  onRedo,
  onClear,
  canUndo,
  canRedo
}: DrawingToolsProps) => {
  return (
    <div className="flex space-x-2">
      <ToolButton
        active={activeTool === 'pen'}
        onClick={() => onToolChange('pen')}
        title="Pen"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 19l7-7 3 3-7 7-3-3z"></path>
          <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"></path>
          <path d="M2 2l7.586 7.586"></path>
          <circle cx="11" cy="11" r="2"></circle>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={activeTool === 'marker'}
        onClick={() => onToolChange('marker')}
        title="Marker"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 14h3a2 2 0 0 1 2 2v3a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-7a9 9 0 0 1 18 0v7a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3"></path>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={activeTool === 'highlighter'}
        onClick={() => onToolChange('highlighter')}
        title="Highlighter"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l-6 6v3h9l3-3"></path>
          <path d="M22 12l-4.6 4.6a2 2 0 0 1-2.8 0l-5.2-5.2a2 2 0 0 1 0-2.8L14 4"></path>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={activeTool === 'eraser'}
        onClick={() => onToolChange('eraser')}
        title="Eraser"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 20H7L3 16C2.5 15.5 2.5 14.5 3 14L13 4C13.5 3.5 14.5 3.5 15 4L21 10C21.5 10.5 21.5 11.5 21 12L11 22"></path>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={false}
        onClick={onUndo}
        title="Undo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={canUndo ? "currentColor" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 7v6h6"></path>
          <path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={false}
        onClick={onRedo}
        title="Redo"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={canRedo ? "currentColor" : "#ccc"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 7v6h-6"></path>
          <path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path>
        </svg>
      </ToolButton>
      
      <ToolButton
        active={false}
        onClick={onClear}
        title="Clear Canvas"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 6h18"></path>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
        </svg>
      </ToolButton>
    </div>
  );
};

export default DrawingTools;