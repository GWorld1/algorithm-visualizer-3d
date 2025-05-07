import { TreeNode } from "@/types/Treenode";
import { calculateTreeLayout } from "./treeLayout";

export interface BSTStep {
  tree: TreeNode;
  currentNode?: number;
  description: string;
}

export const generateBSTInsertSteps = (
  originalTree: TreeNode,
  valueToInsert: number
): BSTStep[] => {
  const steps: BSTStep[] = [];
  
  // Clone the tree to avoid modifying the original
  const tree = structuredClone(originalTree);
  
  // Add initial step
  steps.push({
    tree: structuredClone(tree),
    description: `Starting BST insertion for value ${valueToInsert}`
  });

  // Recursive function to insert and generate steps
  const insertWithSteps = (node: TreeNode, value: number, path: string = ""): boolean => {
    // Highlight current node being examined
    steps.push({
      tree: calculateTreeLayout(structuredClone(tree)),
      currentNode: node.value,
      description: `Examining node ${node.value}${path}`
    });
    
    // Check for duplicate
    if (value === node.value) {
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Value ${value} already exists in the tree. BST doesn't allow duplicates.`
      });
      return false;
    }
    
    // Go left
    if (value < node.value) {
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `${value} < ${node.value}, moving to the left child`
      });
      
      if (!node.left) {
        // Insert as left child
        node.left = { value };
        steps.push({
          tree: calculateTreeLayout(structuredClone(tree)),
          currentNode: value,
          description: `Inserted ${value} as left child of ${node.value}`
        });
        return true;
      }
      
      return insertWithSteps(node.left, value, ` → left of ${node.value}`);
    } 
    // Go right
    else {
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `${value} > ${node.value}, moving to the right child`
      });
      
      if (!node.right) {
        // Insert as right child
        node.right = { value };
        steps.push({
          tree: calculateTreeLayout(structuredClone(tree)),
          currentNode: value,
          description: `Inserted ${value} as right child of ${node.value}`
        });
        return true;
      }
      
      return insertWithSteps(node.right, value, ` → right of ${node.value}`);
    }
  };
  
  // Start insertion process
  const success = insertWithSteps(tree, valueToInsert);
  
  // Add final step
  if (success) {
    steps.push({
      tree: calculateTreeLayout(structuredClone(tree)),
      description: `Insertion complete: ${valueToInsert} has been added to the BST`
    });
  } else {
    steps.push({
      tree: calculateTreeLayout(structuredClone(tree)),
      description: `Insertion failed: ${valueToInsert} could not be added to the BST`
    });
  }
  
  return steps;
};