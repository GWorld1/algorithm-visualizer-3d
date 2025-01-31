"use client";
import { Canvas, useFrame } from '@react-three/fiber';

const Node = ({ position, value }: { position: [number, number, number], value: number }) => {
  return (
    <mesh position={position}>
      <sphereGeometry args={[0.2]} />
      <meshStandardMaterial color="orange" />
    </mesh>
  );
};

const BinaryTree = ({ nodes }: { nodes: Array<{ id: number, value: number }> }) => {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      {nodes.map((node, index) => (
        <Node key={node.id} position={[index * 0.5, 0, 0]} value={node.value} />
      ))}
    </Canvas>
  );
};

export default BinaryTree;