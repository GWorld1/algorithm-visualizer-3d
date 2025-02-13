// components/LinkedList.tsx
import { LinkedListNode as LinkedListNodeType } from "@/types/LinkedListNode";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { calculateLinkedListLayout } from "@/lib/linkedListLayout";
import { Line, Text } from "@react-three/drei";
import { Vector3 } from "three";
import { useEffect } from "react";
import { useThree } from "@react-three/fiber";

const LinkedListNode = ({ node }: { node: LinkedListNodeType }) => {
  return (
    <group position={[node.x ?? 0, node.y ?? 0, 0]}>
      <mesh scale={0.5}>
        <sphereGeometry />
        <meshStandardMaterial color="skyblue" />
      </mesh>
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
      >
        {node.value}
      </Text>
    </group>
  );
};

const LinkedList = () => {
  const { linkedList } = useAlgorithmStore();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const positionedLinkedList = linkedList ? calculateLinkedListLayout(linkedList) : null;

  const renderList = (node: LinkedListNodeType | null): JSX.Element | null => {
    if (!node) return null;

    return (
      <group key={node.value}>
        <LinkedListNode node={node} />
        {node.next && (
          <Line
            points={[new Vector3(node.x ?? 0, node.y ?? 0, 0), new Vector3(node.next.x ?? 0, node.next.y ?? 0, 0)]}
            color="gray"
            lineWidth={2}
          />
        )}
        {node.next && renderList(node.next)}
      </group>
    );
  };

  return positionedLinkedList ? renderList(positionedLinkedList) : null;
};

export default LinkedList;