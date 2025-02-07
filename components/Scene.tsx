"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BinaryTree from './BinaryTree'
import { useAlgorithmStore } from '@/store/useAlgorithmStore'
import WeightedTree from './WeightedGraph'
import LinkedList from './LinkedList'
import DynamicArray from './DynamicArray'
import StackVisualization from './StackVisualization'
import QueueVisualization from './QueueVisualization'



const Scene = () => {
  const { dataStructure } = useAlgorithmStore();
  const renderDataStructure = () => {
    switch (dataStructure) {
      case 'binaryTree':
        return <BinaryTree />;
      case 'weightedGraph':
        return <WeightedTree />;
      case 'linkedList':
        return <LinkedList />;
      case 'array':
        return <DynamicArray />;
      case 'stack':
       return <StackVisualization/>;
      case 'queue':
        return <QueueVisualization/>

      default:
        return null;
    }
  };
  return (
      <>
     
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />

        {/* Objects */}
        {renderDataStructure()}
        {/* Camera Controls */}
        <OrbitControls 
            minDistance={5}
            maxDistance={20}
            enablePan={true}
            enableZoom={true}
            />
      </Canvas>
    </>
  )
}

{/* <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
    </mesh> */
}


export default Scene