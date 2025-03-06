import { useEffect, useRef } from 'react';

interface MathRendererProps {
  latex: string;
  display?: boolean;
}

const MathRenderer = ({ latex, display = true }: MathRendererProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // In a real implementation, you would load a math rendering library
    // like KaTeX or MathJax and render the LaTeX
    
    // For simplicity in this example, we'll just style it nicely
    if (containerRef.current) {
      containerRef.current.textContent = latex;
    }
    
    // Example of how you would use KaTeX:
    // if (containerRef.current && typeof katex !== 'undefined') {
    //   katex.render(latex, containerRef.current, {
    //     throwOnError: false,
    //     displayMode: display
    //   });
    // }
    
  }, [latex, display]);
  
  return (
    <div 
      ref={containerRef}
      className={`font-mono text-lg ${display ? 'py-2 text-center' : ''}`}
    ></div>
  );
};

export default MathRenderer;