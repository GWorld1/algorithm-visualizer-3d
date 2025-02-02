"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BinaryTree from './BinaryTree'
import { useAlgorithmStore } from '@/store/useAlgorithmStore'
import WeightedTree from './WeightedTree'

const Scene = () => {
  const { algorithmType } = useAlgorithmStore();
  return (
   
      
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={2} />
        <pointLight position={[10, 10, 10]} />

        {/* Objects */}
        {algorithmType === 'dijkstra' ? <WeightedTree /> : <BinaryTree />}
        
        {/* Camera Controls */}
        <OrbitControls 
            minDistance={5}
            maxDistance={20}
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