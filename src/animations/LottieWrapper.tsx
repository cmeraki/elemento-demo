// src/animations/LottieWrapper.tsx
import { useEffect, useRef } from 'react';

interface AnimationData {
  v: string;
  fr: number;
  ip: number;
  op: number;
  w: number;
  h: number;
  nm: string;
  ddd: number;
  assets: unknown[];
  layers: unknown[];
}

interface LottieInstance {
  destroy: () => void;
}

interface LottieWrapperProps {
  animationData: AnimationData;
  loop?: boolean;
  autoplay?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const LottieWrapper = ({
  animationData,
  loop = true,
  autoplay = true,
  className = '',
  style = {}
}: LottieWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    let lottieInstance: LottieInstance | null = null;
    
    // In a real app, you would load the Lottie library and create an animation
    // For this example, we'll just simulate it
    const loadLottie = async () => {
      if (containerRef.current) {
        // Mock Lottie loading
        console.log('Lottie animation loaded:', animationData.nm);
        console.log(`Animation settings - loop: ${loop}, autoplay: ${autoplay}`);
        lottieInstance = {
          destroy: () => console.log('Lottie animation destroyed')
        };
      }
    };
    
    loadLottie();
    
    return () => {
      // Clean up animation
      if (lottieInstance) {
        lottieInstance.destroy();
      }
    };
  }, [animationData, loop, autoplay]);
  
  return (
    <div
      ref={containerRef}
      className={className}
      style={style}
    />
  );
};

export default LottieWrapper;