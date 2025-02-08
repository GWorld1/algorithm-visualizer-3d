// ArrayVisualization.tsx
import { useArrayStore } from '@/store/useArrayStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import ArrayElement from './ArrayElement';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';

const DynamicArray = () => {
  const { elements } = useArrayStore();
  const { currentStep, steps } = useAlgorithmStore();
  const { camera } = useThree();
  
  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  const currentState = steps[currentStep]?.elements || 
    elements.map((value, index) => ({
      value,
      state: 'default',
      position: index,
    }));

  return (
    <group position={[-5, 0, 0]}>
      {currentState.map((element, index) => (
        <ArrayElement
          key={index}
          value={element.value}
          index={index}
          state={element.state}
          targetPosition={element.position}
          isSwapping={element.state === 'swapping'}
        />
      ))}
    </group>
  );
};

export default DynamicArray;