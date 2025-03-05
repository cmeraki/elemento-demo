import { useState, useRef, useEffect } from 'react';

interface DrawingState {
  isDrawing: boolean;
  lastX: number;
  lastY: number;
}

interface CanvasOptions {
  lineWidth?: number;
  strokeStyle?: string;
  lineCap?: CanvasLineCap;
  lineJoin?: CanvasLineJoin;
}

export const useCanvas = (options: CanvasOptions = {}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [drawingState, setDrawingState] = useState<DrawingState>({
    isDrawing: false,
    lastX: 0,
    lastY: 0
  });
  
  const [canvasOptions, setCanvasOptions] = useState({
    lineWidth: options.lineWidth || 2,
    strokeStyle: options.strokeStyle || '#000000',
    lineCap: options.lineCap || 'round',
    lineJoin: options.lineJoin || 'round'
  });
  
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    // Apply canvas options
    ctx.lineWidth = canvasOptions.lineWidth;
    ctx.strokeStyle = canvasOptions.strokeStyle;
    ctx.lineCap = canvasOptions.lineCap;
    ctx.lineJoin = canvasOptions.lineJoin;
  }, [canvasOptions]);
  
  const startDrawing = (x: number, y: number) => {
    setDrawingState({
      isDrawing: true,
      lastX: x,
      lastY: y
    });
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  
  const draw = (x: number, y: number) => {
    if (!drawingState.isDrawing) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.beginPath();
    ctx.moveTo(drawingState.lastX, drawingState.lastY);
    ctx.lineTo(x, y);
    ctx.stroke();
    
    setDrawingState({
      ...drawingState,
      lastX: x,
      lastY: y
    });
  };
  
  const stopDrawing = () => {
    setDrawingState({
      ...drawingState,
      isDrawing: false
    });
  };
  
  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };
  
  const updateOptions = (newOptions: Partial<CanvasOptions>) => {
    setCanvasOptions({
      ...canvasOptions,
      ...newOptions
    });
  };
  
  return {
    canvasRef,
    isDrawing: drawingState.isDrawing,
    startDrawing,
    draw,
    stopDrawing,
    clearCanvas,
    updateOptions
  };
};