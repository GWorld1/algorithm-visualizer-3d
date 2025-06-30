/* eslint-disable @typescript-eslint/no-unused-vars */
import { Line } from '@react-three/drei';
import TreeNode from './TreeNode';
import { Vector3 } from 'three';
import { useThree } from '@react-three/fiber';
import { useEffect } from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { BSTStep } from '@/lib/bstAlgorithms';
import { TraversalStep } from '@/lib/treeAlgorithms';
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
  
  // Use the tree from the current step for algorithms that provide tree data, otherwise use the main tree
  let treeToRender = tree;

  // For BST insertion and search, use the tree from the current step
  if ((algorithmType === 'bstInsert' || algorithmType === 'bstSearch') && steps[currentStep]) {
    const bstStep = steps[currentStep] as unknown as BSTStep;
    if (bstStep.tree) {
      treeToRender = bstStep.tree;
    }
  }

  // For BFS and DFS, use the tree from the current step
  if ((algorithmType === 'bfs' || algorithmType === 'dfs') && steps[currentStep]) {
    const traversalStep = steps[currentStep] as unknown as TraversalStep;
    if (traversalStep.tree) {
      treeToRender = traversalStep.tree;
    }
  }
  
  const renderTree = (node: TreeNodeType, parentPos?: Vector3) => {
    const currentPos = new Vector3(node.x, node.y, 0);
    
    // Determine if node is active based on algorithm type
    let isActive = false;

    if (algorithmType === 'bstInsert' || algorithmType === 'bstSearch') {
      // For BST operations, check if this is the current node being examined
      const bstStep = steps[currentStep] as unknown as BSTStep;
      isActive = bstStep?.currentNode === node.value;
    } else if (algorithmType === 'bfs' || algorithmType === 'dfs') {
      // For BFS/DFS operations, check if this is the current node being visited
      const traversalStep = steps[currentStep] as unknown as TraversalStep;
      isActive = traversalStep?.currentNode === node.value;
    } else {
      // For other algorithms (legacy format)
      const currentStepNode = steps[currentStep] as TreeNodeType;
      isActive = currentStepNode?.value === node.value;
    }
    
    // Check if this is the edge being traversed
    let isActiveEdge = false;
    if (isActive && parentPos && currentStep > 0) {
      if (algorithmType === 'bfs' || algorithmType === 'dfs') {
        // For BFS/DFS, check the previous traversal step
        const prevTraversalStep = steps[currentStep - 1] as unknown as TraversalStep;
        isActiveEdge = prevTraversalStep?.currentNode === node.parentValue;
      } else {
        // For other algorithms (legacy format)
        const prevStepNode = steps[currentStep - 1] as TreeNodeType;
        isActiveEdge = prevStepNode?.value === node.parentValue;
      }
    }
  
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