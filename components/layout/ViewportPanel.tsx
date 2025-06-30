/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState, useRef } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3X3, Eye, EyeOff, RotateCcw, HelpCircle, Mouse, Move, ZoomIn, RotateCw, ChevronUp, ChevronDown } from 'lucide-react';
import dynamic from 'next/dynamic';

// Dynamic imports for 3D components
const BinaryTree = dynamic(() => import('@/components/BinaryTree'), {
  suspense: true,
  ssr: false,
});

const WeightedTree = dynamic(() => import('@/components/WeightedGraph'), {
  suspense: true,
  ssr: false,
});

const DynamicArray = dynamic(() => import('@/components/ArrayVisualization'), {
  suspense: true,
  ssr: false,
});

const LinkedList = dynamic(() => import('@/components/LinkedListVisualization'), {
  suspense: true,
  ssr: false,
});

// Camera controller component that runs inside the Canvas
const CameraController = ({ onResetRef }: { onResetRef: React.MutableRefObject<(() => void) | null> }) => {
  const { camera } = useThree();
  const controlsRef = useRef<any>(null);

  // Expose reset function to parent component
  onResetRef.current = () => {
    // Reset camera position
    camera.position.set(0, 0, 15);
    camera.lookAt(0, 0, 0);

    // Reset controls target and update
    if (controlsRef.current) {
      controlsRef.current.target.set(0, 0, 0);
      controlsRef.current.update();
    }
  };

  return (
    <OrbitControls
      ref={controlsRef}
      minDistance={10}
      maxDistance={30}
      enablePan={true}
      enableZoom={true}
    />
  );
};

const ViewportPanel = () => {
  const {
    dataStructure,
    animationSettings: { showGrid, showLabels },
    updateAnimationSettings
  } = useAlgorithmStore();

  const [showNavigationGuide, setShowNavigationGuide] = useState(false);
  const resetCameraRef = useRef<(() => void) | null>(null);

  const renderDataStructure = () => {
    switch (dataStructure) {
      case 'binaryTree':
        return <BinaryTree />;
      case 'weightedGraph':
        return <WeightedTree />;
      case 'array':
        return <DynamicArray />;
      case 'linkedList':
        return <LinkedList />;
      default:
        return null;
    }
  };

  return (
    <div className="relative h-full w-full min-h-0">
      {/* 3D Canvas */}
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }} className="h-full w-full">
        {showGrid && (
          <Grid
            args={[10, 10]}
            cellSize={1}
            cellThickness={1}
            cellColor="#6b7280"
            sectionSize={3}
          />
        )}
        <Environment preset="city" />
        <GizmoHelper alignment="top-right" margin={[80, 80]}>
          <GizmoViewport />
        </GizmoHelper>

        {/* Lights */}
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />

        {/* Data Structure Visualization */}
        {renderDataStructure()}

        {/* Camera Controls */}
        <CameraController onResetRef={resetCameraRef} />
      </Canvas>

      {/* Floating Controls - Semi-transparent overlay */}
      <Card className="absolute top-4 left-4 bg-white/80 backdrop-blur-sm border-white/20 z-10 shadow-lg">
        <div className="p-3 flex flex-col gap-2">
          <h3 className="text-sm font-semibold text-gray-800">View Controls</h3>
          
          <div className="flex flex-col gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateAnimationSettings({ showGrid: !showGrid })}
              className="justify-start text-xs"
            >
              <Grid3X3 className="w-3 h-3 mr-2" />
              {showGrid ? 'Hide Grid' : 'Show Grid'}
            </Button>
            
            {/* <Button
              variant="ghost"
              size="sm"
              onClick={() => updateAnimationSettings({ showLabels: !showLabels })}
              className="justify-start text-xs"
            >
              {showLabels ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </Button> */}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                if (resetCameraRef.current) {
                  resetCameraRef.current();
                }
              }}
              className="justify-start text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-2" />
              Reset View
            </Button>
          </div>
        </div>
      </Card>

      {/* Algorithm State Indicator */}
      <Card className="absolute bottom-4 left-4 bg-white/80 backdrop-blur-sm border-white/20 z-10 shadow-lg">
        <div className="p-3">
          <div className="text-xs text-gray-600">Current Structure</div>
          <div className="text-sm font-semibold capitalize text-gray-800">
            {dataStructure.replace(/([A-Z])/g, ' $1').trim()}
          </div>
        </div>
      </Card>

      {/* Navigation Guide */}
      <Card className="absolute bottom-4 right-4 bg-gray-900/95 backdrop-blur-sm border-gray-700/50 z-10 shadow-lg">
        <div className="p-3">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <HelpCircle className="w-4 h-4 text-blue-400" />
              <span className="text-sm font-semibold text-white">Navigation</span>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowNavigationGuide(!showNavigationGuide)}
              className="h-6 w-6 p-0 text-gray-400 hover:text-white"
            >
              {showNavigationGuide ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
            </Button>
          </div>

          {showNavigationGuide && (
            <div className="space-y-2 text-xs text-gray-300">
              <div className="flex items-center gap-2">
                <Mouse className="w-3 h-3 text-blue-400" />
                <span>Left drag: Rotate view</span>
              </div>
              <div className="flex items-center gap-2">
                <Move className="w-3 h-3 text-green-400" />
                <span>Right drag: Pan view</span>
              </div>
              <div className="flex items-center gap-2">
                <ZoomIn className="w-3 h-3 text-yellow-400" />
                <span>Scroll: Zoom in/out</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCw className="w-3 h-3 text-purple-400" />
                <span>Touch: Pinch to zoom</span>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ViewportPanel;
