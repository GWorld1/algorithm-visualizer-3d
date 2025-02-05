import { useEffect, useState } from 'react';
import { Text } from '@react-three/drei';
const ArrayElement = ({ value, index }: { value: number, index: number }) => {
  const [highlight, setHighlight] = useState(false);

  useEffect(() => {
    setHighlight(true);
    const timer = setTimeout(() => setHighlight(false), 500);
    return () => clearTimeout(timer);
  }, [value]); // Animate on value change

  return (
    <mesh scale={highlight ? [1.2, 1.2, 1.2] : [1, 1, 1]}>
      <boxGeometry args={[1, 1, 0.1]} />
        <meshStandardMaterial color="#10b981" />
            <Text position={[0, 0, 0.1]} fontSize={0.5}>
              {value}
            </Text>
            <Text 
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