import { useArrayStore } from '@/store/useArrayStore';
import ArrayElement from './ArrayElement';
const DynamicArray = () => {
  const { elements } = useArrayStore();
  
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