import { Mesh, Vector3 } from 'three';
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { TreeNode as TreeNodeType } from '@/types/Treenode';
const TreeNode = ({
  node,
  position,
  onNodeClick
}: {
  node: TreeNodeType;
  position: Vector3;
  onNodeClick?: (node: TreeNodeType) => void;
}) => {
  const meshRef = useRef<Mesh>(null);
  
  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh
        ref={meshRef}
        scale={0.5}
        onClick={() => onNodeClick?.(node)}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <sphereGeometry />
        <meshStandardMaterial color="#4f46e5" />
      </mesh>

      {/* Value label */}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.3}
        color="steelblue"
        anchorX="center"
        anchorY="middle"
      >
        {node.value}
      </Text>
    </group>
  );
};

export default TreeNode;