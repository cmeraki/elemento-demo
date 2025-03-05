"use client";
import { useRef, useEffect, useState, MouseEvent, TouchEvent } from 'react';
import DrawingTools from './DrawingTools';
import ColorPicker from './ColorPicker';
import { Question } from '../../types';

interface CanvasProps {
  question?: Question | null;
  onNewQuestion?: () => void;
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
}

interface Path2DWithStyle extends Path2D {
  tool?: DrawingTool;
  color?: DrawingColor;
  width?: StrokeWidth;
}

const Canvas = ({ question, onNewQuestion }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [drawingState, setDrawingState] = useState<DrawingState>({
    tool: 'pen',
    color: '#000000',
    width: 2,
    isDrawing: false,
    paths: [],
    currentPath: null,
    redoStack: []
  });
  
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
  }, []);
  
  // Redraw canvas whenever paths change
  useEffect(() => {
    redrawCanvas();
  }, [drawingState.paths]);
  
  const drawRuledLines = () => {
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
  };
  
  const redrawCanvas = () => {
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
  };
  
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
    
    setDrawingState(prev => ({
      ...prev,
      paths: [],
      redoStack: []
    }));
    
    drawRuledLines();
  };
  
  return (
    <div className="flex flex-col h-full">
      {/* Canvas Area */}
      <div 
        ref={containerRef}
        className="flex-grow relative overflow-hidden"
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
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
        <div className="bg-gray-100 bg-opacity-90 rounded-full shadow-lg py-2 px-4 flex items-center space-x-2">
          <DrawingTools 
            activeTool={drawingState.tool}
            onToolChange={handleToolChange}
            onUndo={handleUndo}
            onRedo={handleRedo}
            onClear={handleClear}
            canUndo={drawingState.paths.length > 0}
            canRedo={drawingState.redoStack.length > 0}
          />
          
          <div className="border-r border-gray-300 h-8 mx-2"></div>
          
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
