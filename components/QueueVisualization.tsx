"use client"
import * as THREE from "three";
import useStackQueueStore from "@/store/useStackQueueStore";
import { Text } from "@react-three/drei";
import { animated, useSpring } from '@react-spring/three';


interface AnimatedMeshProps {
  index: number;
  element: { value: number; index: number };
  dequeue: () => void;
}

const AnimatedMesh: React.FC<AnimatedMeshProps> = ({ index, element, dequeue }) => {
  const springs = useSpring({
    position: [index * 1.5, 0, 0],
    scale: [1, 1, 1],
    from: { position: [(index + 1) * 1.5, -2, 0], scale: [0, 0, 0] },
    config: { mass: 1, tension: 280, friction: 60 }
  });

  return (
    <animated.mesh
      key={index}
      position={springs.position as unknown as [number, number, number]}
     
      onClick={() => index === 0 && dequeue()}
    >
      <boxGeometry args={[1, 1, 0.3]} />
      <meshStandardMaterial color="#3b82f6" />
      <Text position={[0, 0, 0.2]} fontSize={0.3}>
        {element.value}
      </Text>
    </animated.mesh>
  );
};


const QueueVisualization = () => {
 
  const { elements, enqueue, dequeue } = useStackQueueStore();

  const handleEnqueue = (e: THREE.Event) => {
    e.stopPropagation();
    const randomValue = Math.floor(Math.random() * 100);
    enqueue(randomValue);
  };

  return (
    <group position={[5, 0, 0]}>
      {elements.map((element, index) => (
        <AnimatedMesh key={index} index={index} element={element} dequeue={dequeue} />
      ))}

      <mesh 
        position={[elements.length * 1.5, 0, 0]}
        onClick={handleEnqueue}
      >
        <boxGeometry args={[1, 1, 0.3]} />
        <meshStandardMaterial color="#10b981" />
        <Text 
          position={[0, 0, 0.5]}
          fontSize={0.3}
          color={"black"}>Enqueue</Text>
      </mesh>
    </group>
  );
};

export default QueueVisualization;