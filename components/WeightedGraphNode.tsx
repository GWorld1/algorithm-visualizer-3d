// components/WeightedGraphNode.tsx
import { Text, Html } from '@react-three/drei';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedGraphNode';
import { Vector3 } from 'three';
import { animated, useSpring } from '@react-spring/three';
import { useState } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { addGraphNode, deleteGraphNode } from '@/lib/nodeManipulation';

const WeightedTreeNode = ({
  node,
  position,
  isActive
}: {
  node: WeightedTreeNodeType;
  position: Vector3;
  isActive: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { updateWeightedTree, weightedTree } = useAlgorithmStore();

  const springProps = useSpring({
    scale: hovered ? 0.6 : 0.5,
    color: isActive ? '#ef4444' : hovered ? '#3b82f6' : '#049ef4'
  });

  const handleAddConnection = () => {
    const targetValue = parseInt(prompt('Enter target node value:') || '0');
    const weight = parseInt(prompt('Enter edge weight:') || '1');
    
    if (targetValue && weight && weightedTree) {
      console.log('Adding node:', { targetValue, weight });
      const updatedGraph = addGraphNode(weightedTree, node.value + 1, [{
        targetValue: node.value,
        weight
      }]);
      if (updatedGraph) {
        console.log('Updated graph:', updatedGraph);
        updateWeightedTree(updatedGraph);
      }
    }
    setShowMenu(false);
  };

  const handleDelete = () => {
    if (weightedTree) {
      const updatedGraph = deleteGraphNode(weightedTree, node.value);
      if (updatedGraph) {
        updateWeightedTree(updatedGraph);
      }
    }
    setShowMenu(false);
  };

  return (
    <group position={position}>
      <animated.mesh
        {...springProps}
        onClick={() => setShowMenu(!showMenu)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry />
        <meshStandardMaterial color={isActive ? '#ef4444' : '#049ef4'} />
      </animated.mesh>

      {/* Value label */}
      <Text position={[0, 0.7, 0]} color="steelblue" fontSize={0.3}>
        {node.value}
      </Text>

      {/* Distance label */}
      {node.distance !== undefined && (
        <Text position={[0, -0.7, 0]} fontSize={0.3} color="gray">
          d: {node.distance}
        </Text>
      )}

      {/* Edge weights */}
      {Object.entries(node.edges).map(([key, edge], index) => {
        const angle = (2 * Math.PI * index) / Object.keys(node.edges).length;
        const radius = 1.5;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <Text
            key={key}
            position={[x, y, 0.2]}
            fontSize={0.3}
            color="gray"
          >
            {edge.weight}
          </Text>
        );
      })}

      {/* Context Menu */}
      {showMenu && (
        <Html position={[1, 0, 0]}>
          <div className="bg-white p-2 rounded shadow-lg">
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              onClick={handleAddConnection}
            >
              Add Connection
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-red-100 text-red-600"
              onClick={handleDelete}
            >
              Delete Node
            </button>
          </div>
        </Html>
      )}
    </group>
  );
};

export default WeightedTreeNode;