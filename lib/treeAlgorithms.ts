import { TreeNode } from "@/types/Treenode";
import { calculateTreeLayout } from "./treeLayout";

export interface TraversalStep {
  tree: TreeNode;
  currentNode?: number;
  description: string;
  queueState?: number[];
  stackState?: number[];
}

export const generateBFSSteps = (root: TreeNode): TraversalStep[] => {
  const steps: TraversalStep[] = [];
  const queue: TreeNode[] = [root];

  // Clone the tree to avoid modifying the original
  const tree = structuredClone(root);
  tree.parentValue = null; // Add parent reference

  // Initial step
  steps.push({
    tree: calculateTreeLayout(structuredClone(tree)),
    description: `Starting BFS traversal from root node ${root.value}`,
    queueState: [root.value]
  });

  let stepCount = 1;

  while (queue.length > 0) {
    const node = queue.shift()!;
    const currentQueueValues = queue.map(n => n.value);

    // Step: Visiting current node
    steps.push({
      tree: calculateTreeLayout(structuredClone(tree)),
      currentNode: node.value,
      description: `Step ${stepCount}: Visiting node ${node.value} (dequeued from front)`,
      queueState: currentQueueValues
    });

    const childrenToAdd: number[] = [];

    // Add left child to queue
    if (node.left) {
      node.left.parentValue = node.value;
      queue.push(node.left);
      childrenToAdd.push(node.left.value);
    }

    // Add right child to queue
    if (node.right) {
      node.right.parentValue = node.value;
      queue.push(node.right);
      childrenToAdd.push(node.right.value);
    }

    // Step: Adding children to queue (if any)
    if (childrenToAdd.length > 0) {
      const newQueueValues = queue.map(n => n.value);
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Adding children of ${node.value} to queue: [${childrenToAdd.join(', ')}]`,
        queueState: newQueueValues
      });
    } else if (queue.length === 0) {
      // No children and queue is empty
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Node ${node.value} has no children. Queue is now empty.`,
        queueState: []
      });
    } else {
      // No children but queue has more nodes
      const remainingQueueValues = queue.map(n => n.value);
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Node ${node.value} has no children. Queue contains: [${remainingQueueValues.join(', ')}]`,
        queueState: remainingQueueValues
      });
    }

    stepCount++;
  }

  // Final step
  steps.push({
    tree: calculateTreeLayout(structuredClone(tree)),
    description: `BFS traversal complete! All nodes have been visited level by level.`,
    queueState: []
  });

  return steps;
};

export const generateDFSSteps = (root: TreeNode): TraversalStep[] => {
  const steps: TraversalStep[] = [];
  const stack: TreeNode[] = [root];

  // Clone the tree to avoid modifying the original
  const tree = structuredClone(root);
  tree.parentValue = null; // Add parent reference

  // Initial step
  steps.push({
    tree: calculateTreeLayout(structuredClone(tree)),
    description: `Starting DFS traversal from root node ${root.value}`,
    stackState: [root.value]
  });

  let stepCount = 1;

  while (stack.length > 0) {
    const node = stack.pop()!;
    const currentStackValues = stack.map(n => n.value);

    // Step: Visiting current node
    steps.push({
      tree: calculateTreeLayout(structuredClone(tree)),
      currentNode: node.value,
      description: `Step ${stepCount}: Visiting node ${node.value} (popped from stack)`,
      stackState: currentStackValues
    });

    const childrenToAdd: number[] = [];

    // Add right child first (so left is processed first due to LIFO)
    if (node.right) {
      node.right.parentValue = node.value;
      stack.push(node.right);
      childrenToAdd.unshift(node.right.value); // Add to front for display order
    }

    // Add left child second (will be processed first due to LIFO)
    if (node.left) {
      node.left.parentValue = node.value;
      stack.push(node.left);
      childrenToAdd.unshift(node.left.value); // Add to front for display order
    }

    // Step: Adding children to stack (if any)
    if (childrenToAdd.length > 0) {
      const newStackValues = stack.map(n => n.value);
      const childOrder = node.left && node.right ?
        `left (${node.left.value}) and right (${node.right.value})` :
        node.left ? `left (${node.left.value})` : `right (${node.right.value})`;

      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Pushing ${childOrder} children of ${node.value} to stack (left will be processed first)`,
        stackState: newStackValues
      });
    } else if (stack.length === 0) {
      // No children and stack is empty
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Node ${node.value} has no children. Stack is now empty.`,
        stackState: []
      });
    } else {
      // No children but stack has more nodes
      const remainingStackValues = stack.map(n => n.value);
      const nextNode = stack[stack.length - 1];
      steps.push({
        tree: calculateTreeLayout(structuredClone(tree)),
        currentNode: node.value,
        description: `Node ${node.value} has no children. Backtracking to ${nextNode.value}`,
        stackState: remainingStackValues
      });
    }

    stepCount++;
  }

  // Final step
  steps.push({
    tree: calculateTreeLayout(structuredClone(tree)),
    description: `DFS traversal complete! All nodes have been visited depth-first.`,
    stackState: []
  });

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
