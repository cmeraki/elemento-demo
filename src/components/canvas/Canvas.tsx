// src/components/canvas/Canvas.tsx
// Updated to accept style prop for dynamic sizing

import { useRef, useEffect, useState, MouseEvent, TouchEvent, useCallback, CSSProperties } from 'react';
import DrawingTools from './DrawingTools';
import ColorPicker from './ColorPicker';
import { Question, CanvasData, CanvasStep } from '../../types';

interface CanvasProps {
  question?: Question | null;
  onNewQuestion?: () => void;
  onUpdate?: (data: CanvasData) => void;
  canvasData?: CanvasData | null;
  style?: CSSProperties; // Added style prop for dynamic sizing
}

type DrawingTool = 'pen' | 'marker' | 'highlighter' | 'eraser';
type DrawingColor = string;
type StrokeWidth = number;

interface DrawingState {
  tool: DrawingTool;
  color: DrawingColor;
  width: StrokeWidth;
  isDrawing: boolean;
  paths: Path2D[];
  currentPath: Path2D | null;
  redoStack: Path2D[];
  recognizedSteps: CanvasStep[];
}

interface Path2DWithStyle extends Path2D {
  tool?: DrawingTool;
  color?: DrawingColor;
  width?: StrokeWidth;
}

const Canvas = ({ question, onNewQuestion, onUpdate, canvasData, style }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const initializedRef = useRef(false);
  const shouldUpdateParentRef = useRef(false);
  
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'pen',
    color: '#000000',
    width: 2,
    isDrawing: false,
    paths: [],
    currentPath: null,
    redoStack: [],
    recognizedSteps: []
  });
  
  // Define redrawCanvas as a useCallback to avoid dependency warnings
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Redraw ruled lines
    drawRuledLines();
    
    // Redraw all paths
    drawingState.paths.forEach(path => {
      const pathWithStyle = path as Path2DWithStyle;
      ctx.strokeStyle = pathWithStyle.color || '#000000';
      ctx.lineWidth = pathWithStyle.width || 2;
      
      if (pathWithStyle.tool === 'highlighter') {
        ctx.globalAlpha = 0.3;
      } else {
        ctx.globalAlpha = 1.0;
      }
      
      if (pathWithStyle.tool === 'eraser') {
        ctx.globalCompositeOperation = 'destination-out';
      } else {
        ctx.globalCompositeOperation = 'source-over';
      }
      
      ctx.stroke(path);
    });
    
    // Reset canvas state
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
  }, [drawingState.paths]);
  
  const drawRuledLines = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = '#e6e6e6';
    ctx.lineWidth = 1;
    
    // Draw horizontal ruled lines
    const lineSpacing = 30; // Spacing between lines
    const yStart = lineSpacing;
    
    for (let y = yStart; y < canvas.height; y += lineSpacing) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(canvas.width, y);
      ctx.stroke();
    }
  }, []);
  
  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    
    if (!canvas || !container) return;
    
    // Make canvas responsive to container
    const resizeCanvas = () => {
      const { width, height } = container.getBoundingClientRect();
      canvas.width = width;
      canvas.height = height;
      redrawCanvas();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Add ruled lines to the canvas
    drawRuledLines();
    
    return () => {
      window.removeEventListener('resize', resizeCanvas);
    };
  }, [redrawCanvas, drawRuledLines]);
  
  // Load canvas data only once on initial render
  useEffect(() => {
    if (initializedRef.current) return;
    
    if (canvasData && canvasData.paths && canvasData.paths.length > 0) {
      setDrawingState(prev => ({
        ...prev,
        paths: canvasData.paths,
        recognizedSteps: canvasData.steps || []
      }));
    }
    
    initializedRef.current = true;
  }, [canvasData]);
  
  // Update parent component with canvas data when paths change
  // But only after user actions, not from receiving new canvasData
  useEffect(() => {
    if (!shouldUpdateParentRef.current) return;
    if (!onUpdate) return;
    
    // Mock text recognition - in a real app, you would use a handwriting recognition API
    const mockRecognizeText = () => {
      // These would be actual recognized steps from the canvas
      const recognizedSteps: CanvasStep[] = [
        {
          id: '1',
          content: "f(x) = x³ + 2x² - 4x + 7",
          bbox: { x: 50, y: 100, width: 300, height: 30 }
        },
        {
          id: '2',
          content: "f'(x) = 3x² + 4x - 4",
          bbox: { x: 50, y: 150, width: 300, height: 30 }
        }
      ];
      
      return recognizedSteps;
    };
    
    const recognizedSteps = mockRecognizeText();
    
    // Reset the flag
    shouldUpdateParentRef.current = false;
    
    onUpdate({
      paths: drawingState.paths,
      steps: recognizedSteps
    });
  }, [drawingState.paths, onUpdate]);
  
  // Redraw canvas whenever paths change
  useEffect(() => {
    redrawCanvas();
  }, [drawingState.paths, redrawCanvas]);
  
  const startDrawing = (x: number, y: number) => {
    const newPath = new Path2D() as Path2DWithStyle;
    newPath.tool = drawingState.tool;
    newPath.color = drawingState.color;
    newPath.width = drawingState.width;
    
    newPath.moveTo(x, y);
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: true,
      currentPath: newPath,
      redoStack: [] // Clear redo stack when drawing starts
    }));
  };
  
  const draw = (x: number, y: number) => {
    if (!drawingState.isDrawing || !drawingState.currentPath) return;
    
    const newPath = drawingState.currentPath;
    newPath.lineTo(x, y);
    
    // Get canvas context and draw the current path
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.strokeStyle = drawingState.color;
    ctx.lineWidth = drawingState.width;
    
    if (drawingState.tool === 'highlighter') {
      ctx.globalAlpha = 0.3;
    } else {
      ctx.globalAlpha = 1.0;
    }
    
    if (drawingState.tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }
    
    ctx.stroke(newPath);
    
    // Reset canvas state
    ctx.globalAlpha = 1.0;
    ctx.globalCompositeOperation = 'source-over';
    
    setDrawingState(prev => ({
      ...prev,
      currentPath: newPath
    }));
  };
  
  const endDrawing = () => {
    if (!drawingState.isDrawing || !drawingState.currentPath) return;
    
    // Set the flag to update parent on the next render
    shouldUpdateParentRef.current = true;
    
    setDrawingState(prev => ({
      ...prev,
      isDrawing: false,
      paths: [...prev.paths, prev.currentPath!],
      currentPath: null
    }));
  };
  
  const handleMouseDown = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    startDrawing(x, y);
  };
  
  const handleMouseMove = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawingState.isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    draw(x, y);
  };
  
  const handleMouseUp = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endDrawing();
  };
  
  const handleMouseLeave = (e: MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endDrawing();
  };
  
  const handleTouchStart = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (e.touches.length !== 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    startDrawing(x, y);
  };
  
  const handleTouchMove = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    if (!drawingState.isDrawing || e.touches.length !== 1) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const rect = canvas.getBoundingClientRect();
    const touch = e.touches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    draw(x, y);
  };
  
  const handleTouchEnd = (e: TouchEvent<HTMLCanvasElement>) => {
    e.preventDefault();
    endDrawing();
  };
  
  const handleToolChange = (tool: DrawingTool) => {
    setDrawingState(prev => ({
      ...prev,
      tool
    }));
  };
  
  const handleColorChange = (color: DrawingColor) => {
    setDrawingState(prev => ({
      ...prev,
      color
    }));
  };
  
  const handleStrokeWidthChange = (width: StrokeWidth) => {
    setDrawingState(prev => ({
      ...prev,
      width
    }));
  };
  
  const handleUndo = () => {
    if (drawingState.paths.length === 0) return;
    
    // Set the flag to update parent on the next render
    shouldUpdateParentRef.current = true;
    
    const lastPath = drawingState.paths[drawingState.paths.length - 1];
    const newPaths = drawingState.paths.slice(0, -1);
    
    setDrawingState(prev => ({
      ...prev,
      paths: newPaths,
      redoStack: [...prev.redoStack, lastPath]
    }));
  };
  
  const handleRedo = () => {
    if (drawingState.redoStack.length === 0) return;
    
    // Set the flag to update parent on the next render
    shouldUpdateParentRef.current = true;
    
    const pathToRedo = drawingState.redoStack[drawingState.redoStack.length - 1];
    const newRedoStack = drawingState.redoStack.slice(0, -1);
    
    setDrawingState(prev => ({
      ...prev,
      paths: [...prev.paths, pathToRedo],
      redoStack: newRedoStack
    }));
  };
  
  const handleClear = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Set the flag to update parent on the next render
    shouldUpdateParentRef.current = true;
    
    setDrawingState(prev => ({
      ...prev,
      paths: [],
      redoStack: []
    }));
    
    drawRuledLines();
    
    // Let parent know the canvas was cleared
    if (onUpdate) {
      onUpdate({
        paths: [],
        steps: []
      });
    }
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-grow relative overflow-hidden canvas-component"
        style={style} // Apply dynamic styles from parent
      >
        <canvas
          ref={canvasRef}
          className="touch-none absolute inset-0 bg-white"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{ touchAction: 'none' }}
        />
      </div>
      
      {/* Drawing Tools - Floating bubble style */}
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 toolbar-component">
        <div className="bg-gray-100 bg-opacity-90 rounded-full shadow-lg py-1.5 px-3 flex items-center space-x-2">
          <DrawingTools 
            activeTool={drawingState.tool}
            onToolChange={handleToolChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            canUndo={drawingState.paths.length > 0}
            canRedo={drawingState.redoStack.length > 0}
          />
          
          <div className="border-r border-gray-300 h-6 mx-1.5"></div>
          
          <ColorPicker 
            activeColor={drawingState.color}
            onColorChange={handleColorChange}
            strokeWidth={drawingState.width}
            onStrokeWidthChange={handleStrokeWidthChange}
          />
        </div>
      </div>
    </div>
  );
};

export default Canvas;