import { LinkedListNode as LinkedListNodeType } from "@/types/LinkedListNode";
import { calculateLinkedListLayout } from "@/lib/linkedListLayout";
import { Line, Text } from "@react-three/drei";
import { Vector3 } from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";
import { useLinkedListStore } from "@/store/useLinkedListStore";

// Color constants for different node states
const NODE_COLORS = {
  default: "#87CEEB", // Light blue
  current: "#FFB74D", // Orange - currently being traversed
  target: "#4CAF50", // Green - target found
  deleted: "#F44336", // Red - node to be deleted
  new: "#9C27B0", // Purple - newly inserted node
  traversed: "#90CAF9", // Light blue - previously traversed
};

const LinkedListNode = ({ 
  node, 
  highlightedNodes 
}: { 
  node: LinkedListNodeType;
  highlightedNodes: {
    current?: number;
    target?: number;
    new?: number;
    deleted?: number;
    traversed: number[];
  };
}) => {
  // Determine node color based on state
  const getNodeColor = () => {
    if (node.value === highlightedNodes.current) return NODE_COLORS.current;
    if (node.value === highlightedNodes.target) return NODE_COLORS.target;
    if (node.value === highlightedNodes.deleted) return NODE_COLORS.deleted;
    if (node.value === highlightedNodes.new) return NODE_COLORS.new;
    if (highlightedNodes.traversed.includes(node.value)) return NODE_COLORS.traversed;
    return NODE_COLORS.default;
  };

  return (
    <group position={[node.x ?? 0, node.y ?? 0, 0]}>
      <mesh scale={0.5}>
        <sphereGeometry />
        <meshStandardMaterial color={getNodeColor()} />
      </mesh>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.3}
        color="white"
        anchorX="center"
        anchorY="middle"
      >
        {node.value}
      </Text>
    </group>
  );
};

const LinkedList = () => {
  const { linkedList, steps, currentStep, isPlaying } = useLinkedListStore();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const currentStep_ = steps[currentStep];
  const initialList = steps[0]?.list;
  //const initialPositionedList = initialList? calculateLinkedListLayout(initialList) : null;
  const currentList = currentStep_?.list || linkedList || null;
  const positionedLinkedList = currentList ? calculateLinkedListLayout(currentList) : null;

  const renderList = (node: LinkedListNodeType | null): JSX.Element | null => {
    if (!node) return null;

    return (
      <group key={node.value}>
        <LinkedListNode 
          node={node}
          highlightedNodes={currentStep_?.highlightedNodes ?? { traversed: [] }}
        />
        {node.next && (
          <Line
            points={[
              new Vector3(node.x ?? 0, node.y ?? 0, 0),
              new Vector3(node.next.x ?? 0, node.next.y ?? 0, 0)
            ]}
            color="#9CA3AF"
            lineWidth={3}
          />
        )}
        {node.next && renderList(node.next)}
      </group>
    );
  };

  // Add legend
  const Legend = () => (
    <group position={[-5, 3, 0]}>
      <Text position={[0, 0, 0]} fontSize={0.2} color="black">
        Current Node
      </Text>
      <mesh position={[1, 0, 0]} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color={NODE_COLORS.current} />
      </mesh>
      <Text position={[0, -0.4, 0]} fontSize={0.2} color="black">
        Target Found
      </Text>
      <mesh position={[1, -0.4, 0]} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color={NODE_COLORS.target} />
      </mesh>
      <Text position={[0, -0.8, 0]} fontSize={0.2} color="white">
        To Delete
      </Text>
      <mesh position={[1, -0.8, 0]} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color={NODE_COLORS.deleted} />
      </mesh>
      <Text position={[0, -1.2, 0]} fontSize={0.2} color="white">
        New Node
      </Text>
      <mesh position={[1, -1.2, 0]} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color={NODE_COLORS.new} />
      </mesh>
      <Text position={[0, -1.6, 0]} fontSize={0.2} color="white">
        Traversed
      </Text>
      <mesh position={[1, -1.6, 0]} scale={0.2}>
        <sphereGeometry />
        <meshStandardMaterial color={NODE_COLORS.traversed} />
      </mesh>
    </group>
  );

  return (
    <>
      {positionedLinkedList && renderList(positionedLinkedList)}
      <Legend />
      {currentStep_?.description && (
        <Text
          position={[0, -2, 0]}
          fontSize={0.3}
          color="white"
          anchorX="center"
          anchorY="middle"
        >
          {currentStep_.description}
        </Text>
      )}
    </>
  );
};

export default LinkedList;