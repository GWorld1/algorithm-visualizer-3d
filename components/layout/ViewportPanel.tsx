"use client"
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Grid, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Grid3X3, Eye, EyeOff, RotateCcw } from 'lucide-react';
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

const ViewportPanel = () => {
  const { 
    dataStructure, 
    animationSettings: { showGrid, showLabels },
    updateAnimationSettings 
  } = useAlgorithmStore();

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
        <OrbitControls 
          minDistance={10}
          maxDistance={30}
          enablePan={true}
          enableZoom={true}
        />
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
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => updateAnimationSettings({ showLabels: !showLabels })}
              className="justify-start text-xs"
            >
              {showLabels ? <EyeOff className="w-3 h-3 mr-2" /> : <Eye className="w-3 h-3 mr-2" />}
              {showLabels ? 'Hide Labels' : 'Show Labels'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                // Reset camera position - this would need to be implemented
                console.log('Reset camera position');
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
    </div>
  );
};

export default ViewportPanel;
