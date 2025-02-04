// components/WeightedTreeNode.tsx
import { Text } from '@react-three/drei';
import { WeightedTreeNode as WeightedTreeNodeType } from '@/types/WeightedTreeNode';
import { Vector3 } from 'three';

const WeightedTreeNode = ({
  node,
  position,
  isActive
}: {
  node: WeightedTreeNodeType;
  position: Vector3;
  isActive: boolean;
}) => {
  // Existing node rendering code...

  return (
    <group position={position}>
      <mesh scale={0.5}>
        <sphereGeometry />
        <meshStandardMaterial color={isActive ? '#ef4444' : '#049ef4'} />
      </mesh>

      {/* Value label */}
      <Text position={[0, 0.7, 0]} color={"steelblue"} fontSize={0.3}>
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
    </group>
  );
};

export default WeightedTreeNode;