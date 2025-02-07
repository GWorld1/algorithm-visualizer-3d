/* eslint-disable @typescript-eslint/no-unused-vars */
import { WeightedTreeNode } from '@/types/WeightedGraphNode';


export const dijkstra = (root: WeightedTreeNode): WeightedTreeNode[] => {
  const steps: WeightedTreeNode[] = [];
  const unvisited = new Set<WeightedTreeNode>();
  
  // Initialize distances and add parent references
  const initializeDistances = (node: WeightedTreeNode, visited: Set<number> = new Set()) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);
    
    node.distance = node === root ? 0 : Infinity;
    unvisited.add(node);
    
    // Initialize all connected nodes
    Object.entries(node.edges).forEach(([_, edge]) => {
      if (edge && edge.node) {
        edge.node.parentValue = node.value;
        initializeDistances(edge.node, visited);
      }
    });
  };
  
  initializeDistances(root);
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
    steps.push({...current}); // Create a copy to preserve state for animation
    
    // Update all neighbors
    Object.entries(current.edges).forEach(([_, edge]) => {
      if (!edge || !unvisited.has(edge.node)) return;
      
      const distance = (current!.distance ?? 0) + edge.weight;
      if (distance < (edge.node.distance ?? Infinity)) {
        edge.node.distance = distance;
        edge.node.previousNode = current;
      }
    });
  }
  
  return steps;
};
