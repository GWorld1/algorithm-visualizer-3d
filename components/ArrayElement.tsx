// ArrayElement.tsx
import React, { useEffect, useRef, useMemo } from 'react';
import { Text } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { useArrayStore } from '@/store/useArrayStore';

const getColorForState = (state: string) => {
  switch (state) {
    case 'comparing':
      return '#fbbf24'; // Yellow
    case 'swapping':
      return '#ef4444'; // Red
    case 'sorted':
      return '#22c55e'; // Green
    default:
      return '#4682b4'; // Steel blue - better contrast for dark theme
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
  const { elements } = useArrayStore();
  const meshRef = useRef<THREE.Mesh>(null);
  const textRef = useRef<THREE.Mesh>(null);
  const indexTextRef = useRef<THREE.Mesh>(null);

  // Calculate bar dimensions based on value
  const barDimensions = useMemo(() => {
    const maxValue = Math.max(...elements, 1); // Avoid division by zero
    const minValue = Math.min(...elements, 0);
    const valueRange = maxValue - minValue || 1; // Avoid division by zero

    // Scale height proportionally with a reasonable max height
    const maxBarHeight = 6; // Maximum bar height in 3D units
    const minBarHeight = 0.2; // Minimum bar height for visibility

    // Normalize value to 0-1 range, then scale to bar height range
    const normalizedValue = Math.max(0, (value - minValue) / valueRange);
    const barHeight = minBarHeight + (normalizedValue * (maxBarHeight - minBarHeight));

    return {
      width: 0.8, // Slightly narrower for better spacing
      height: barHeight,
      depth: 0.8,
      baseY: barHeight / 2 // Position so bar sits on ground
    };
  }, [value, elements]);

  // Interpolation values - bars start from ground level
  const currentPosition = useRef(new THREE.Vector3(index * 2, barDimensions.baseY, 0));
  const targetPos = useRef(new THREE.Vector3(targetPosition * 2, barDimensions.baseY, 0));
  
  // Swapping animation parameters
  const swapProgress = useRef(0);
  const swapDirection = useRef(0);

  useEffect(() => {
    // Update target position when targetPosition changes
    targetPos.current.setX(targetPosition * 2);
    targetPos.current.setY(barDimensions.baseY);

    // Update current position Y to match new bar height
    currentPosition.current.setY(barDimensions.baseY);

    // Reset swap progress if position changes
    if (isSwapping) {
      swapProgress.current = 0;
      swapDirection.current = targetPosition > index ? 1 : -1;
    }
  }, [targetPosition, isSwapping, index, barDimensions.baseY]);

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
      {/* Vertical bar geometry with proportional height */}
      <boxGeometry args={[barDimensions.width, barDimensions.height, barDimensions.depth]} />
      <meshStandardMaterial
        color={getColorForState(state)}
        transparent={false}
        roughness={0.3}
        metalness={0.1}
      />

      {/* Value text positioned at the top of the bar */}
      <Text
        ref={textRef}
        position={[0, barDimensions.height / 2 + 0.3, barDimensions.depth / 2 + 0.1]}
        fontSize={0.4}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
      >
        {value}
      </Text>

      {/* Index text positioned below the bar */}
      <Text
        ref={indexTextRef}
        position={[0, -barDimensions.height / 2 - 0.4, barDimensions.depth / 2 + 0.1]}
        fontSize={0.3}
        color="#9ca3af"
        anchorX="center"
        anchorY="middle"
      >
        [{index}]
      </Text>
    </mesh>
  );
};

export default ArrayElement;