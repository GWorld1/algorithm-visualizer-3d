import { WeightedTreeNode } from '@/types/WeightedGraphNode';

export interface DijkstraStep {
  currentNode: WeightedTreeNode;
  paths: Map<number, number[]>;  // Maps node value to the path (array of node values)
  distances: Map<number, number>;
  unvisited: Set<number>;  // Added to show which nodes are still unvisited
}

export const dijkstra = (root: WeightedTreeNode, sourceValue: number): DijkstraStep[] => {
  const steps: DijkstraStep[] = [];
  const unvisited = new Set<number>();
  const distances = new Map<number, number>();
  const paths = new Map<number, number[]>();
  const nodes = new Map<number, WeightedTreeNode>();

  // First collect all nodes and their connections
  const collectNodes = (node: WeightedTreeNode, visited = new Set<number>()) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);
    
    // Store the node
    nodes.set(node.value, node);
    unvisited.add(node.value);
    distances.set(node.value, node.value === sourceValue ? 0 : Infinity);
    
    if (node.value === sourceValue) {
      paths.set(node.value, [sourceValue]);
    }
    
    // Continue collecting from connected nodes
    Object.values(node.edges).forEach(edge => {
      if (edge && edge.node) {
        collectNodes(edge.node, visited);
      }
    });
  };

  // Start collecting from wherever the root is
  collectNodes(root);

  // Get the source node from our collected nodes
  const sourceNode = nodes.get(sourceValue);
  if (!sourceNode) {
    throw new Error('Source node not found');
  }

  // Now process nodes starting from the source
  while (unvisited.size > 0) {
    // Find unvisited node with minimum distance
    let currentValue: number | null = null;
    let minDistance = Infinity;
    
    for (const value of unvisited) {
      const distance = distances.get(value) ?? Infinity;
      if (distance < minDistance) {
        minDistance = distance;
        currentValue = value;
      }
    }
    
    if (currentValue === null || minDistance === Infinity) {
      break; // No more reachable nodes
    }
    
    const current = nodes.get(currentValue)!;
    unvisited.delete(currentValue);
    
    // Update distances to neighbors
    Object.values(current.edges).forEach(edge => {
      if (!edge || !unvisited.has(edge.node.value)) return;
      
      const newDistance = (distances.get(current.value) ?? 0) + edge.weight;
      const oldDistance = distances.get(edge.node.value) ?? Infinity;
      
      if (newDistance < oldDistance) {
        distances.set(edge.node.value, newDistance);
        const currentPath = [...(paths.get(current.value) ?? [])];
        paths.set(edge.node.value, [...currentPath, edge.node.value]);
      }
    });
    
    // Create step with current state
    steps.push({
      currentNode: current,
      paths: new Map(paths),
      distances: new Map(distances),
      unvisited: new Set(unvisited)
    });
  }
  
  // If no steps were generated (e.g., isolated source node), add at least one step
  if (steps.length === 0) {
    steps.push({
      currentNode: sourceNode,
      paths: new Map(paths),
      distances: new Map(distances),
      unvisited: new Set(unvisited)
    });
  }
  
  return steps;
};