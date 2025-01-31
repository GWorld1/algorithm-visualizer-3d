import { TreeNode } from "@/types/Treenode";

export const generateBFSSteps = (root: TreeNode): TreeNode[] => {
    const steps: TreeNode[] = [];
    const queue: TreeNode[] = [root];
    
    while (queue.length > 0) {
      const node = queue.shift()!;
      steps.push(node);
      
      if (node.left) queue.push(node.left);
      if (node.right) queue.push(node.right);
    }
    
    return steps;
  };