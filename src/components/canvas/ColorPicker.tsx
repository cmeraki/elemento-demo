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
            className={`w-6 h-6 rounded-full shadow ${
              activeColor === color ? 'ring-2 ring-offset-1 ring-blue-500' : ''
            }`}
            style={{ backgroundColor: color }}
            onClick={() => onColorChange(color)}
            aria-label={`Color ${color}`}
          />
        ))}
      </div>
      
      <div className="flex space-x-1 ml-2">
        {strokeWidths.map((width) => (
          <button
            key={width}
            className={`w-6 h-6 flex items-center justify-center rounded-full ${
              strokeWidth === width ? 'bg-white shadow-md' : 'bg-gray-100 hover:bg-gray-200'
            }`}
            onClick={() => onStrokeWidthChange(width)}
            aria-label={`Stroke width ${width}`}
          >
            <div 
              className="rounded-full" 
              style={{ 
                width: `${width * 1.5}px`, 
                height: `${width * 1.5}px`,
                backgroundColor: activeColor
              }}
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default ColorPicker;