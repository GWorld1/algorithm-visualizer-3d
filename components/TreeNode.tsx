import { Mesh, Vector3 } from 'three';
import { useRef } from 'react';
import { Text } from '@react-three/drei';
import { TreeNode as TreeNodeType } from '@/types/Treenode';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { calculateTreeLayout } from '@/lib/treeLayout';
import { findNode } from '@/lib/treeUtils';

const TreeNode = ({
  node,
  position,
  isActive,
  onNodeClick
}: {
  node: TreeNodeType;
  position: Vector3;
  isActive: boolean;
  onNodeClick?: (node: TreeNodeType) => void;
}) => {
  const meshRef = useRef<Mesh>(null);
  const { updateTree, tree } = useAlgorithmStore();

  const handleAddChild = (side: 'left' | 'right') => {
    const newNode = {
      value: Math.floor(Math.random() * 100),
    };
    
    console.log('newNode', newNode);

    const cloneTree = structuredClone(tree);
    const targetNode = findNode(cloneTree, node.value);
    
    console.log('targetNode', targetNode);
    console.log('targetNode ' + side, targetNode && targetNode[side]);

    if (targetNode && !targetNode[side]) {
      targetNode[side] = newNode;
      const updatedTree = calculateTreeLayout(cloneTree);
      console.log('updatedTree', updatedTree);
      updateTree(updatedTree);
    }
  };

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
        <meshStandardMaterial color={isActive ? '#ef4444' : '#4f46e5'} />
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

      {/* Add child buttons */}
      <Text
        position={[0, -0.7, 0]}
        fontSize={0.4}
        color={'#4f46e5'}
        onClick={(e) => {
          e.stopPropagation();
          const side = prompt('Add to left or right? (l/r)');
          if (side === 'l') handleAddChild('left');
          if (side === 'r') handleAddChild('right');
        }}
      >
        [+]
      </Text>
    </group>
  );
};

export default TreeNode;
