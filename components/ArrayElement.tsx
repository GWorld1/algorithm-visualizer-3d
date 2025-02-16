// ArrayElement.tsx
import React, { useEffect, useRef } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const getColorForState = (state: string) => {
  switch (state) {
    case 'comparing':
      return '#fbbf24'; // Yellow
    case 'swapping':
      return '#ef4444'; // Red
    case 'sorted':
      return '#22c55e'; // Green
    default:
      return 'steelblue'; // Default teal
  }
};

interface ArrayElementProps {
  value: number;
  index: number;
  state: string;
  targetPosition: number;
  isSwapping: boolean;
}

const ArrayElement: React.FC<ArrayElementProps> = ({ 
  value, 
  index,
  state,
  targetPosition,
  isSwapping
}) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const indexTextRef = useRef<THREE.Mesh>(null);
  
  // Interpolation values
  const currentPosition = useRef(new THREE.Vector3(index * 2, 0, 0));
  const targetPos = useRef(new THREE.Vector3(targetPosition * 2, 0, 0));
  
  // Swapping animation parameters
  const swapProgress = useRef(0);
  const swapDirection = useRef(0);

  useEffect(() => {
    // Update target position when targetPosition changes
    targetPos.current.setX(targetPosition * 2);
    
    // Reset swap progress if position changes
    if (isSwapping) {
      swapProgress.current = 0;
      swapDirection.current = targetPosition > index ? 1 : -1;
    }
  }, [targetPosition, isSwapping, index]);

  useFrame(() => {
    if (!meshRef.current) return;

    // Standard position interpolation
    if (!isSwapping) {
      currentPosition.current.lerp(targetPos.current, 0.1);
      meshRef.current.position.copy(currentPosition.current);
      return;
    }

    // Swap animation
    if (isSwapping) {
      // Ease in-out cubic animation for swap
      swapProgress.current += 0.05;
      
      // Oscillating movement during swap
      const swapOffset = Math.sin(swapProgress.current * Math.PI) * 0.5;
      const horizontalOffset = swapDirection.current * swapOffset;
      
      // Interpolate to target position
      const lerpedPosition = new THREE.Vector3().lerpVectors(
        currentPosition.current, 
        targetPos.current, 
        swapProgress.current
      );
      
      // Apply horizontal oscillation during swap
      lerpedPosition.x += horizontalOffset;
      
      meshRef.current.position.copy(lerpedPosition);
      
      // Reset if animation completes
      if (swapProgress.current >= 1) {
        currentPosition.current.copy(targetPos.current);
      }
    }
  });

  return (
    <mesh ref={meshRef}>
      <boxGeometry args={[1, 1, 0.1]} />
      <meshStandardMaterial color={getColorForState(state)} />
      <Text ref={textRef} position={[0, 0, 0.1]} fontSize={0.5}>
        {value}
      </Text>
      <Text 
        ref={indexTextRef}
        position={[0, -0.7, 0.1]} 
        fontSize={0.3} 
        color="#64748b"
      >
        [{index}]
      </Text>
    </mesh>
  );
};

export default ArrayElement;