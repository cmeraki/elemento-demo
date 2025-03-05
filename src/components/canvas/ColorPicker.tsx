interface ColorPickerProps {
    activeColor: string;
    onColorChange: (color: string) => void;
    strokeWidth: number;
    onStrokeWidthChange: (width: number) => void;
  }
  
  const ColorPicker = ({ 
    activeColor, 
    onColorChange,
    strokeWidth,
    onStrokeWidthChange
  }: ColorPickerProps) => {
    const colors = [
      "#000000", // black
      "#FF0000", // red
      "#0000FF", // blue
      "#008000", // green
      "#FFA500", // orange
      "#800080", // purple
      "#FFC0CB", // pink
      "#FFFF00"  // yellow
    ];
  
    const strokeWidths = [1, 2, 4, 6, 8];
    
    return (
      <div className="flex items-center space-x-2">
        <div className="flex space-x-1">
          {colors.map((color) => (
            <button
              key={color}
              className={`w-6 h-6 rounded-full ${
                activeColor === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''
              }`}
              style={{ backgroundColor: color }}
              onClick={() => onColorChange(color)}
            />
          ))}
        </div>
        
        <div className="border-r border-gray-300 h-8 mx-2"></div>
        
        <div className="flex space-x-1">
          {strokeWidths.map((width) => (
            <button
              key={width}
              className={`w-8 h-8 flex items-center justify-center rounded ${
                strokeWidth === width ? 'bg-blue-100' : 'bg-white hover:bg-gray-100'
              }`}
              onClick={() => onStrokeWidthChange(width)}
            >
              <div 
                className="rounded-full bg-black" 
                style={{ 
                  width: `${width * 2}px`, 
                  height: `${width * 2}px` 
                }}
              />
            </button>
          ))}
        </div>
      </div>
    );
  };
  
  export default ColorPicker;