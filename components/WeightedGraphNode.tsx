// components/WeightedGraphNode.tsx
import { Text, Html } from '@react-three/drei';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedGraphNode';
import { Vector3 } from 'three';
import { animated, useSpring } from '@react-spring/three';
import { useState } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { addGraphNode, deleteGraphNode } from '@/lib/nodeManipulation';
import { calculateWeightedTreeLayout } from '@/lib/weightedGraphLayout';

const WeightedTreeNode = ({
  node,
  position,
  isActive,
  distance,
  isCurrentNode
}: {
  node: WeightedTreeNodeType;
  position: Vector3;
  isActive: boolean;
  distance: number | undefined;
  isCurrentNode?: boolean;
}) => {
  const [hovered, setHovered] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const { updateWeightedTree, weightedTree, algorithmType } = useAlgorithmStore();

  const springProps = useSpring({
    scale: hovered ? [0.6, 0.6, 0.6] : [0.5, 0.5, 0.5],
    color: node.isSource ? '#8B5CF6' : // Purple for source node
           isCurrentNode ? '#EF4444' : // Red for current node
           isActive ? '#22c55e' : // Green for active path
           hovered ? '#3b82f6' : '#049ef4' // Blue for hover/default
  });

  const handleAddConnection = () => {
    const targetValue = parseInt(prompt('Enter target node value:') || '');
    if (isNaN(targetValue)) {
      alert('Please enter a valid node value');
      return;
    }
    
    const weight = parseInt(prompt('Enter edge weight:') || '');
    if (isNaN(weight) || weight <= 0) {
      alert('Please enter a valid positive weight');
      return;
    }
    
    if (targetValue === node.value) {
      alert('Cannot connect node to itself');
      return;
    }
    
    if (weightedTree) {
      // Only create connection between the current node and target node
      const updatedGraph = addGraphNode(weightedTree, targetValue, [{
        targetValue: node.value,
        weight
      }]);
      
      if (updatedGraph === weightedTree) {
        alert('Could not create connection. Make sure the target node exists.');
      } else {
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
        scale={springProps.scale.to((x, y, z) => [x, y, z])}
        onClick={() => setShowMenu(!showMenu)}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <sphereGeometry />
        <animated.meshStandardMaterial color={springProps.color} />
      </animated.mesh>

      {/* Value label */}
      <Text
        position={[0, 0.7, 0]}
        color={node.isSource ? "#8B5CF6" : "black"}
        fontSize={0.3}
        anchorX="center"
        anchorY="middle"
      >
        {node.value}
      </Text>

      {/* Distance label (for Dijkstra's algorithm) */}
      {distance !== undefined && (
        <Text
          position={[0, -0.7, 0]}
          fontSize={0.3}
          color={distance === Infinity ? '#9CA3AF' : // Gray for infinity
                 distance === 0 ? '#10B981' : // Green for source
                 '#3B82F6' // Blue for other distances
          }
          anchorX="center"
          anchorY="middle"
        >
          d: {distance === Infinity ? '∞' : distance}
        </Text>
      )}

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
