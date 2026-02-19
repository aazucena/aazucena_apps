'use client';

import * as React from 'react';
import type { SceneObjectType } from '@aazucena/types';
import type { PresetsType } from '@react-three/drei/helpers/environment-assets.js';

interface ObjectViewerContextType {
  // State
  objectKey: SceneObjectType;
  showGrid: boolean;
  autoRotate: boolean;
  wireframe: boolean;
  intensity: number;
  envPreset: PresetsType;
  showStats: boolean;
  showBBox: boolean;
  showAxes: boolean;
  isSlowMo: boolean;
  
  // Feedback States
  isCapturing: boolean;
  isResetting: boolean;
  actionStatus: string | null;
  
  // Setters/Actions
  setShowGrid: (val: boolean) => void;
  setAutoRotate: (val: boolean) => void;
  setWireframe: (val: boolean) => void;
  setIntensity: (val: number) => void;
  setEnvPreset: (val: PresetsType) => void;
  setShowStats: (val: boolean) => void;
  setShowBBox: (val: boolean) => void;
  setShowAxes: (val: boolean) => void;
  setIsSlowMo: (val: boolean) => void;
  
  // Logic
  resetCamera: () => void;
  takeScreenshot: () => void;
  controlsRef: React.RefObject<any>;
}

const ObjectViewerContext = React.createContext<ObjectViewerContextType | undefined>(undefined);

export function useObjectViewer() {
  const context = React.useContext(ObjectViewerContext);
  if (!context) {
    throw new Error('useObjectViewer must be used within an ObjectViewerProvider');
  }
  return context;
}

export const ObjectViewerProvider = ({ 
  children, 
  objectKey,
  initialShowGrid = true,
  initialAutoRotate = true,
}: { 
  children: React.ReactNode;
  objectKey: SceneObjectType;
  initialShowGrid?: boolean;
  initialAutoRotate?: boolean;
}) => {
  const [showGrid, setShowGrid] = React.useState(initialShowGrid);
  const [autoRotate, setAutoRotate] = React.useState(initialAutoRotate);
  const [wireframe, setWireframe] = React.useState(false);
  const [intensity, setIntensity] = React.useState(1);
  const [envPreset, setEnvPreset] = React.useState<PresetsType>('city');
  const [showStats, setShowStats] = React.useState(false);
  const [showBBox, setShowBBox] = React.useState(false);
  const [showAxes, setShowAxes] = React.useState(false);
  const [isSlowMo, setIsSlowMo] = React.useState(false);
  
  const [isCapturing, setIsCapturing] = React.useState(false);
  const [isResetting, setIsResetting] = React.useState(false);
  const [actionStatus, setActionStatus] = React.useState<string | null>(null);
  
  const controlsRef = React.useRef<any>(null);

  const resetCamera = () => {
    setIsResetting(true);
    setActionStatus('CAMERA_RESET');
    controlsRef.current?.reset();
    setTimeout(() => {
      setIsResetting(false);
      setActionStatus(null);
    }, 1000);
  };

  const takeScreenshot = () => {
    setIsCapturing(true);
    setActionStatus('CAPTURING_FRAME');
    
    setTimeout(() => {
      const canvas = document.querySelector('canvas');
      if (canvas) {
        const link = document.createElement('a');
        link.download = `inspect-${objectKey}-${new Date().getTime()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
      }
      
      setActionStatus('IMAGE_SAVED');
      setTimeout(() => {
        setIsCapturing(false);
        setActionStatus(null);
      }, 500);
    }, 100);
  };

  const value = {
    objectKey,
    showGrid,
    autoRotate,
    wireframe,
    intensity,
    envPreset,
    showStats,
    showBBox,
    showAxes,
    isSlowMo,
    isCapturing,
    isResetting,
    actionStatus,
    setShowGrid,
    setAutoRotate,
    setWireframe,
    setIntensity,
    setEnvPreset,
    setShowStats,
    setShowBBox,
    setShowAxes,
    setIsSlowMo,
    resetCamera,
    takeScreenshot,
    controlsRef
  };

  return (
    <ObjectViewerContext.Provider value={value}>
      {children}
    </ObjectViewerContext.Provider>
  );
};
