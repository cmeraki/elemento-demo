// src/hooks/useTabletLayout.ts
import { useState, useEffect } from 'react';

interface TabletLayoutValues {
  isTablet: boolean;
  isLandscape: boolean;
  questionBarHeight: number;
  toolbarHeight: number;
  sidebarWidth: number;
  canvasHeight: string;
  canvasWidth: string;
  safeAreaInsets: {
    top: string;
    right: string;
    bottom: string;
    left: string;
  };
}

/**
 * A custom hook for tablet-specific layout calculations
 * Detects device type, orientation, and calculates appropriate dimensions
 * for various UI elements.
 */
export function useTabletLayout(): TabletLayoutValues {
  const [layoutValues, setLayoutValues] = useState<TabletLayoutValues>({
    isTablet: false,
    isLandscape: false,
    questionBarHeight: 36, // Default collapsed question bar height
    toolbarHeight: 60,     // Default toolbar height
    sidebarWidth: 12,      // Default sidebar width
    canvasHeight: 'calc(100dvh - 36px - 60px)',
    canvasWidth: 'calc(100% - 12px)',
    safeAreaInsets: {
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px'
    }
  });

  useEffect(() => {
    // Function to detect if device is a tablet
    const detectTablet = () => {
      // Check if running in a browser environment
      if (typeof window === 'undefined' || typeof navigator === 'undefined') {
        return false;
      }

      // iPad detection (both older and newer models with iPadOS)
      const isIPad = /iPad|iPhone|iPod/.test(navigator.userAgent) || 
                   (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
      
      // Android tablet detection
      const isAndroidTablet = /Android/.test(navigator.userAgent) && 
                            !/Mobile/.test(navigator.userAgent);
      
      // Windows tablet detection
      const isWindowsTablet = /Windows/.test(navigator.userAgent) && 
                            /Touch/.test(navigator.userAgent);
      
      // Screen size-based tablet detection (for browsers that mask user agent)
      const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
      const screenHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
      
      // Consider it a tablet if either dimension is between tablet thresholds
      // and neither dimension is phone-sized
      const isTabletDimensions = (
        (screenWidth >= 600 && screenWidth <= 1366) && 
        (screenHeight >= 600 && screenHeight <= 1366)
      );
      
      return isIPad || isAndroidTablet || isWindowsTablet || isTabletDimensions;
    };
    
    // Function to detect landscape mode
    const isLandscapeMode = () => {
      if (typeof window === 'undefined') {
        return false;
      }
      
      // First try screen orientation API
      if (window.screen && window.screen.orientation) {
        return window.screen.orientation.type.includes('landscape');
      }
      
      // Fallback to window dimensions
      return window.innerWidth > window.innerHeight;
    };
    
    // Get safe area insets if available
    const getSafeAreaInsets = () => {
      if (typeof window === 'undefined' || !window.CSS || !CSS.supports('padding-top: env(safe-area-inset-top)')) {
        return {
          top: '0px',
          right: '0px',
          bottom: '0px',
          left: '0px'
        };
      }
      
      // For devices that support it, get the actual CSS env values
      return {
        top: 'env(safe-area-inset-top, 0px)',
        right: 'env(safe-area-inset-right, 0px)',
        bottom: 'env(safe-area-inset-bottom, 0px)',
        left: 'env(safe-area-inset-left, 0px)'
      };
    };
    
    // Calculate all the layout values based on device and orientation
    const calculateLayoutValues = () => {
      const isTablet = detectTablet();
      const isLandscape = isLandscapeMode();
      const safeAreaInsets = getSafeAreaInsets();
      
      // Default values for desktop
      let questionBarHeight = 36;
      let toolbarHeight = 60;
      let sidebarWidth = 12;
      
      // Adjust based on device and orientation
      if (isTablet) {
        // Check for specific iPad models based on screen dimensions
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        const isIpadPro = screenWidth >= 1024 || screenHeight >= 1024;
        
        if (isLandscape) {
          // Landscape adjustments
          questionBarHeight = isIpadPro ? 36 : 30;
          toolbarHeight = isIpadPro ? 56 : 50;
          sidebarWidth = 12; // Keep sidebar narrow in landscape
        } else {
          // Portrait adjustments
          questionBarHeight = isIpadPro ? 40 : 36;
          toolbarHeight = isIpadPro ? 60 : 54;
          sidebarWidth = 12;
        }
      }
      
      // Calculate canvas dimensions
      const canvasHeight = `calc(100dvh - ${questionBarHeight}px - ${toolbarHeight}px - ${safeAreaInsets.bottom === '0px' ? '0px' : safeAreaInsets.bottom})`;
      const canvasWidth = `calc(100% - ${sidebarWidth}px)`;
      
      setLayoutValues({
        isTablet,
        isLandscape,
        questionBarHeight,
        toolbarHeight,
        sidebarWidth,
        canvasHeight,
        canvasWidth,
        safeAreaInsets
      });
    };
    
    // Calculate on mount
    calculateLayoutValues();
    
    // Set up event listeners for when dimensions change
    window.addEventListener('resize', calculateLayoutValues);
    window.addEventListener('orientationchange', calculateLayoutValues);
    
    // Also set up a dynamic viewport height helper
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };
    
    setVh();
    window.addEventListener('resize', setVh);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', calculateLayoutValues);
      window.removeEventListener('orientationchange', calculateLayoutValues);
      window.removeEventListener('resize', setVh);
    };
  }, []);
  
  return layoutValues;
}