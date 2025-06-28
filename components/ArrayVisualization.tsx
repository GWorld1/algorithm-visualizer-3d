// ArrayVisualization.tsx
import { useArrayStore } from '@/store/useArrayStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import ArrayElement from './ArrayElement';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { CustomAlgorithmStep } from '@/types/VisualScripting';
import { ArrayElementState } from '@/lib/sortingAlgorithms';

const DynamicArray = () => {
  const { elements } = useArrayStore();
  const { currentStep, steps, algorithmType } = useAlgorithmStore();
  const { camera } = useThree();

  useEffect(() => {
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Handle different step formats based on algorithm type
  const getCurrentState = () => {
    const currentStepData = steps[currentStep];

    if (!currentStepData) {
      // Fallback to default array elements
      return elements.map((value, index) => ({
        value,
        state: 'default',
        position: index,
        highlightColor: undefined
      }));
    }

    // Handle CustomAlgorithmStep format (from visual scripting)
    if (algorithmType === 'customVisualScript' && 'dataStructureState' in currentStepData) {
      const customStep = currentStepData as CustomAlgorithmStep;
      const arrayState = customStep.dataStructureState as ArrayElementState[];
      const highlightColor = customStep.action === 'highlight' && customStep.metadata?.color
        ? customStep.metadata.color
        : undefined;

      // Apply highlighting and state changes based on action and highlightedElements
      const processedState = arrayState.map((element, index) => {
        let state = element.state;
        let color = undefined;

        // Apply action-specific states
        if (customStep.highlightedElements.includes(index)) {
          switch (customStep.action) {
            case 'compare':
              state = 'comparing';
              break;
            case 'swap':
              state = 'swapping';
              break;
            case 'highlight':
              state = 'comparing'; // Use comparing color for highlighting
              color = highlightColor;
              break;
            default:
              state = 'comparing';
              break;
          }
        }

        return {
          ...element,
          state,
          highlightColor: color
        };
      });

      return processedState;
    }

    // Handle standard sorting algorithm format
    if ('elements' in currentStepData) {
      return (currentStepData as any).elements;
    }

    // Fallback to default array elements
    return elements.map((value, index) => ({
      value,
      state: 'default',
      position: index,
      highlightColor: undefined
    }));
  };

  const currentState = getCurrentState();

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
          highlightColor={element.highlightColor}
        />
      ))}
    </group>
  );
};

export default DynamicArray;