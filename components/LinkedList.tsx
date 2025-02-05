"use client"
import { useLinkedListStore } from "@/store/useLinkedListStore";
import {Line,Text} from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useEffect } from "react";


const LinkedList = () => {
    const { nodes } = useLinkedListStore() ;

     const { camera } = useThree();
      
      useEffect(() => {
        camera.position.set(0, 5, 10);
        camera.lookAt(0, 0, 0);
      }, [camera]);
    return( 
      <>
        
        <group position={[0, 0, 0]}>
        {Object.entries(nodes).map(([id, node]) => (
          <group key={id}>
            {/* Node */}
            <mesh position={node.position}>
              <sphereGeometry args={[0.3]} />
              <meshStandardMaterial color="#3b82f6" />
              <Text position={[0, 0.5, 0]} color={"black"} fontSize={0.3}>
                {node.value !== -1 ? node.value : 'Head'}
              </Text>
            </mesh>
  
            {/* Connection arrow */}
            {node.nextId && nodes[node.nextId] && (
              <Line
              points={[node.position, nodes[node.nextId].position]}
              color="#64748b"
              lineWidth={1}
              />
            )}
          </group>
        ))}
      </group>
      </>
    );
};

export default LinkedList;