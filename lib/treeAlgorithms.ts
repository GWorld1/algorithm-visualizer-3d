import { TreeNode } from "@/types/Treenode";

export const generateBFSSteps = (root: TreeNode): TreeNode[] => {
  const steps: TreeNode[] = [];
  const queue: TreeNode[] = [root];
  
  root.parentValue = null; // Add parent reference
  
  while (queue.length > 0) {
    const node = queue.shift()!;
    steps.push(node);
    
    if (node.left) {
      node.left.parentValue = node.value;
      queue.push(node.left);
    }
    if (node.right) {
      node.right.parentValue = node.value;
      queue.push(node.right);
    }
  }
  
  return steps;
};

export const generateDFSSteps = (root: TreeNode): TreeNode[] => {
  const steps: TreeNode[] = [];
  const stack: TreeNode[] = [root];
  
  root.parentValue = null; // Add parent reference
  
  while (stack.length > 0) {
    const node = stack.pop()!;
    steps.push(node);
    
    if (node.right) {
      node.right.parentValue = node.value;
      stack.push(node.right);
    }
    if (node.left) {
      node.left.parentValue = node.value;
      stack.push(node.left);
    }
  }
  
  return steps;
};

//Old Algorithms

// export const generateDFSSteps = (root: TreeNode): TreeNode[] => {
//   const steps: TreeNode[] = [];
//   const stack: TreeNode[] = [root];
  
//   while (stack.length > 0) {
//     const node = stack.pop()!;
//     steps.push(node);
    
//     // Push right first to process left first (LIFO)
//     if (node.right) stack.push(node.right);
//     if (node.left) stack.push(node.left);
//   }
  
//   return steps;
// };





// export const generateBFSSteps = (root: TreeNode): TreeNode[] => {
//   const steps: TreeNode[] = [];
//   const queue: TreeNode[] = [root];
  
//   while (queue.length > 0) {
//     const node = queue.shift()!;
//     steps.push(node);
    
//     if (node.left) queue.push(node.left);
//     if (node.right) queue.push(node.right);
//   }
  
//   return steps;
// };
