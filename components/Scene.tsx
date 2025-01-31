import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'

const Scene = () => {
  return (
    <div className="w-full h-screen">
      <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
        {/* Lights */}
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />

        {/* Objects */}
        <mesh position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="orange" />
        </mesh>

        {/* Camera Controls */}
        <OrbitControls enableZoom={true} />
      </Canvas>
    </div>
  )
}

export default Scene