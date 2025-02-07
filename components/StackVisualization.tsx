import * as THREE from "three";
import { useEffect } from 'react';
import { animated, useSpring } from '@react-spring/three';
import { useThree } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import useStackQueueStore from '@/store/useStackQueueStore';

const StackVisualization = () => {
  const { camera } = useThree();
  const { elements, push ,pop } = useStackQueueStore();
  
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  interface SpringElement {
    idx: number;
    element: { value: number; index: number };
    
  }
  

  const SpringElement = ({ idx, element}: SpringElement) => {
    const spring = useSpring({
      to: {
        position: [0, idx * 0.5, 0],
        scale: [1, 1, 1],
      },
      from: {
        position: [0, -1, 0],
        scale: [0, 0, 0],
      },
      config: { mass: 1, tension: 280, friction: 60 }
    });

    

  
    return (
      <animated.mesh
        key={element.index}
        position={spring.position as unknown as [number, number, number]}
        scale={spring.scale as unknown as [number, number, number]}
      >
        <boxGeometry args={[1, 0.5, 1]} />
        <meshStandardMaterial color="royalblue" />
        <Text
          position={[0, 0, 0.6]}
          fontSize={0.3}
          color="white"
        >
          {element.value}
        </Text>
      </animated.mesh>
    );
  };

  const handlePush = (e: THREE.Event) => {
    e.stopPropagation();
    const randomValue = Math.floor(Math.random() * 100);
    push(randomValue);
  };

  const handlePop = (e: THREE.Event) => {
    e.stopPropagation();
    pop();
  };

  // Create individual springs for each element
  return (
    <group position={[-5, 0, 0]}>
      {elements.map((element, idx) => (
         <SpringElement key={element.index} idx={idx} element={element} />
      )
        
      )}

      <mesh 
        position={[0, elements.length * 0.5, 0]} 
        onClick={handlePush}
      >
        <boxGeometry args={[1, 0.5, 0.3]} />
        <meshStandardMaterial color="#10b981" />
        <Text
          position={[0, 0, 0.5]}
          fontSize={0.3}
          color="white"
        >
          Push
        </Text>
      </mesh>
      <mesh 
        position={[-1.5, elements.length * 0.5, 0]}
        onClick={handlePop}
      >
        <boxGeometry args={[1.2, 0.5, 0.3]} />
        <meshStandardMaterial color="#ef4444" />
        <Text 
          position={[0, 0, 0.5]}
          fontSize={0.3}
          color="white"
        >
          Pop
        </Text>
      </mesh>
    </group>
  );
};

export default StackVisualization;