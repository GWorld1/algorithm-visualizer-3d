import { useArrayStore } from '@/store/useArrayStore';
import ArrayElement from './ArrayElement';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
const DynamicArray = () => {
  const { elements } = useArrayStore();
  
   const { camera } = useThree();
    
    useEffect(() => {
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
    }, [camera]);
  return (
    <group position={[-5, 0, 0]}>
      {elements.map((value, index) => (
        <group key={index} position={[index * 2, 0, 0]}>
          <ArrayElement value={value} index={index} />
        </group>
      ))}
    </group>
  );
};

export default DynamicArray;