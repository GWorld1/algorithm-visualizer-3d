import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from '@/types/WeightedTreeNode';


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



// lib/algorithm.ts
export const dijkstra = (root: WeightedTreeNode): WeightedTreeNode[] => {
  const steps: WeightedTreeNode[] = [];
  const unvisited = new Set<WeightedTreeNode>();
  const distances = new Map<WeightedTreeNode, number>();
  
  // Initialize distances and add parent references
  const initializeDistances = (node: WeightedTreeNode) => {
    distances.set(node, node === root ? 0 : Infinity);
    unvisited.add(node);
    
    if (node.edges.left) {
      node.edges.left.node.parentValue = node.value;
      initializeDistances(node.edges.left.node);
    }
    if (node.edges.right) {
      node.edges.right.node.parentValue = node.value;
      initializeDistances(node.edges.right.node);
    }
  };
  
  initializeDistances(root);
  
  // Start with root
  root.distance = 0;
  
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: WeightedTreeNode | null = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      if ((node.distance ?? Infinity) < minDistance) {
        minDistance = node.distance ?? Infinity;
        current = node;
      }
    }
    
    if (!current || minDistance === Infinity) break;
    
    unvisited.delete(current);
    steps.push(current);
    console.log(`Visited node ${current.value} with distance ${current.distance}`);
    // Update neighbors
    const updateNeighbor = (edge: { node: WeightedTreeNode; weight: number }) => {
      if (!unvisited.has(edge.node)) return;
      
      const distance = (current!.distance ?? 0) + edge.weight;
      if (distance < (edge.node.distance ?? Infinity)) {
        edge.node.distance = distance;
        edge.node.previousNode = current;
      }
    };
    
    if (current.edges.left) updateNeighbor(current.edges.left);
    if (current.edges.right) updateNeighbor(current.edges.right);
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
