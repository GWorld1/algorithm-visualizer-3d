/* eslint-disable @typescript-eslint/no-unused-vars */
import { WeightedTreeNode } from '@/types/WeightedGraphNode';


export interface DijkstraStep {
  currentNode: WeightedTreeNode;
  paths: Map<number, number[]>;  // Maps node value to the path (array of node values)
  distances: Map<number, number>;
}

export const dijkstra = (root: WeightedTreeNode, sourceValue: number): DijkstraStep[] => {
  const steps: DijkstraStep[] = [];
  const unvisited = new Set<WeightedTreeNode>();
  const distances = new Map<number, number>();
  const paths = new Map<number, number[]>();
  
  // Initialize distances and collect nodes
  const initializeNodes = (node: WeightedTreeNode, visited: Set<number> = new Set()) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);
    
    distances.set(node.value, node.value === sourceValue ? 0 : Infinity);
    paths.set(node.value, []); // Initialize path as empty for all nodes

    unvisited.add(node);
    
    Object.values(node.edges).forEach(edge => {
      if (edge && edge.node) {
        initializeNodes(edge.node, visited);
      }
    });
  };
  
  // Find source node
  const findSourceNode = (node: WeightedTreeNode, visited: Set<number> = new Set()): WeightedTreeNode | null => {
    if (visited.has(node.value)) return null;
    visited.add(node.value);
    
    if (node.value === sourceValue) return node;
    
    for (const edge of Object.values(node.edges)) {
      const found = findSourceNode(edge.node, visited);
      if (found) return found;
    }
    
    return null;
  };
  
    const sourceNode = findSourceNode(root); // Find the source node
    if (!sourceNode) {
        throw new Error('Source node not found');
    }
    
    // Initialize paths for all nodes
    initializeNodes(root);

  if (!sourceNode) {
    throw new Error('Source node not found');
  }
  
  initializeNodes(root);
  
  while (unvisited.size > 0) {
    // Find node with minimum distance
    let current: WeightedTreeNode | null = null;
    let minDistance = Infinity;
    
    for (const node of unvisited) {
      const distance = distances.get(node.value) ?? Infinity;
      if (distance < minDistance) {
        minDistance = distance;
        current = node;
      }
    }
    
    if (!current || minDistance === Infinity) break;
    
    unvisited.delete(current);
    
    // Update distances to neighbors
    Object.entries(current.edges).forEach(([_, edge]) => {
      if (!edge || !unvisited.has(edge.node)) return;
      
      const distance = (distances.get(current!.value) ?? 0) + edge.weight;
      if (distance < (distances.get(edge.node.value) ?? Infinity)) {
        distances.set(edge.node.value, distance);
        // Update path by copying the path to the current node and adding the neighbor
        const newPath = [...(paths.get(current!.value) ?? []), edge.node.value];
        paths.set(edge.node.value, newPath);
      }
    });
    
    // Create a deep copy of the maps for this step
    steps.push({
      currentNode: current,
      paths: new Map(paths),
      distances: new Map(distances)
    });
  }
  
  return steps;
};
