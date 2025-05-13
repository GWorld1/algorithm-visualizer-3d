import { Line } from '@react-three/drei';
import TreeNode from './TreeNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { BSTStep } from '@/lib/bstAlgorithms';
import TreeNodeComponent from './TreeNode';
import { TreeNode as TreeNodeType } from '@/types/Treenode';


const BinaryTree = () => {
  const { camera } = useThree();
  const { currentStep, steps, tree, algorithmType, updateTree } = useAlgorithmStore();
  
  useEffect(() => {
    // Center camera on root node
    camera.position.set(0, 5, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  // Effect to update the main tree when BST insertion is complete
  useEffect(() => {
    // Only update tree for BST insertion when at the last step
    if (algorithmType === 'bstInsert' && currentStep === steps.length - 1 && steps.length > 0) {
      const bstStep = steps[currentStep] as unknown as BSTStep;
      if (bstStep?.tree) {
        updateTree(bstStep.tree);
      }
    }
  }, [algorithmType, currentStep, steps, updateTree]);
  
  // Use the tree from the current step for BST insertion and search, otherwise use the main tree
  let treeToRender = tree;
  
  // For BST insertion and search, use the tree from the current step
  if ((algorithmType === 'bstInsert' || algorithmType === 'bstSearch') && steps[currentStep]) {
    const bstStep = steps[currentStep] as unknown as BSTStep;
    if (bstStep.tree) {
      treeToRender = bstStep.tree;
    }
  }
  
  const renderTree = (node: TreeNodeType, parentPos?: Vector3) => {
    const currentPos = new Vector3(node.x, node.y, 0);
    
    // Determine if node is active based on algorithm type
    let isActive = false;
    
    if (algorithmType === 'bstInsert' || algorithmType === 'bstSearch') {
      // For BST operations, check if this is the current node being examined
      const bstStep = steps[currentStep] as unknown as BSTStep;
      isActive = bstStep?.currentNode === node.value;    } else {
      // For other algorithms like BFS/DFS
      const currentStepNode = steps[currentStep] as TreeNodeType;
      isActive = currentStepNode?.value === node.value;
    }
    
    // Check if this is the edge being traversed
    const prevStepNode = steps[currentStep - 1] as TreeNodeType;
    const isActiveEdge = isActive && parentPos && prevStepNode?.value === node.parentValue;
  
    return (
      <group key={node.value}>        {/* Render current node */}
        <TreeNodeComponent isActive={isActive} node={node} position={currentPos} />

        {/* Draw line to parent */}
        {parentPos && (
          <Line
            points={[parentPos, currentPos]}
            color={isActiveEdge ? "#ef4444" : "gray"} // Red when active, gray otherwise
            lineWidth={isActiveEdge ? 4 : 2} // Thicker when active
          />
        )}
  
        {/* Recursively render children */}
        {node.left && renderTree(node.left, currentPos)}
        {node.right && renderTree(node.right, currentPos)}
      </group>
    );
  };
  
  return treeToRender ? renderTree(treeToRender) : null;
};

export default BinaryTree;