"use client"
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import BinaryTree from './BinaryTree'

const Scene = () => {
  return (
    <div className="w-full h-screen">
      
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <pointLight position={[10, 10, 10]} />

        {/* Objects */}
        <BinaryTree/>
        
        {/* Camera Controls */}
        <OrbitControls 
            minDistance={5}
            maxDistance={20}
            enablePan={true}
            enableZoom={true}
         />
      </Canvas>
    </div>
  )
}

{/* <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
    </mesh> */
}


export default Scene