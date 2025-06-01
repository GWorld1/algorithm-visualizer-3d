"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls,Grid, Environment, GizmoHelper, GizmoViewport } from '@react-three/drei'
import dynamic from 'next/dynamic'
import { useAlgorithmStore } from '@/store/useAlgorithmStore'


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


const Scene = () => {
  const { dataStructure,animationSettings:{showGrid} } = useAlgorithmStore();
   // or set this based on your logic

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
      <Canvas camera={{ position: [0, 0, 15], fov: 50 }}>
      {showGrid && <Grid
              args={[10, 10]}
              cellSize={1}
              cellThickness={1}
              cellColor="#6b7280"
              sectionSize={3}
          />}
          <Environment preset="city" />
          <GizmoHelper alignment="top-right" margin={[80, 80]}>
            <GizmoViewport />
          </GizmoHelper>
        {/* Lights */}
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />

        {/* Objects */}
        {renderDataStructure()}
        {/* Camera Controls */}
        <OrbitControls
            minDistance={10}
            maxDistance={30}
            enablePan={true}
            enableZoom={true}
            />

      </Canvas>
  )
}

{/* <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
    </mesh> */
}


export default Scene