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
  const previous = new Map<number, number | null>();
  const nodes = new Map<number, WeightedTreeNode>();

  // First find the actual source node in the graph
  const findSourceNode = (node: WeightedTreeNode, visited = new Set<number>()): WeightedTreeNode | null => {
    if (visited.has(node.value)) return null;
    visited.add(node.value);

    if (node.value === sourceValue) return node;

    for (const edge of Object.values(node.edges)) {
      const found = findSourceNode(edge.node, visited);
      if (found) return found;
    }
    return null;
  };

  const sourceNode = findSourceNode(root);
  if (!sourceNode) {
    throw new Error(`Source node ${sourceValue} not found in graph`);
  }

  // Collect all nodes starting from the source node to ensure connectivity
  const collectNodes = (node: WeightedTreeNode, visited = new Set<number>()) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);

    // Store the node
    nodes.set(node.value, node);
    unvisited.add(node.value);
    distances.set(node.value, node.value === sourceValue ? 0 : Infinity);
    previous.set(node.value, null);

    // Continue collecting from connected nodes
    Object.values(node.edges).forEach(edge => {
      if (edge && edge.node) {
        collectNodes(edge.node, visited);
      }
    });
  };

  // Start collecting from the actual source node
  collectNodes(sourceNode);

  // Helper function to reconstruct path from source to target
  const reconstructPath = (targetValue: number): number[] => {
    const path: number[] = [];
    let current: number | null = targetValue;

    while (current !== null) {
      path.unshift(current);
      current = previous.get(current) ?? null;
    }

    return path;
  };

  // Helper function to reconstruct all current paths
  const reconstructAllPaths = (): Map<number, number[]> => {
    const paths = new Map<number, number[]>();

    // Only include paths to nodes that have been reached (distance < Infinity)
    for (const [nodeValue, distance] of distances.entries()) {
      if (distance < Infinity) {
        paths.set(nodeValue, reconstructPath(nodeValue));
      }
    }

    return paths;
  };

  // Main Dijkstra algorithm loop
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

    // Process the current node
    unvisited.delete(currentValue);

    // Update distances to neighbors
    Object.values(current.edges).forEach(edge => {
      if (!edge || !edge.node || !unvisited.has(edge.node.value)) return;

      const neighborValue = edge.node.value;
      const currentDistance = distances.get(current.value) ?? Infinity;
      const newDistance = currentDistance + edge.weight;
      const oldDistance = distances.get(neighborValue) ?? Infinity;

      if (newDistance < oldDistance) {
        distances.set(neighborValue, newDistance);
        previous.set(neighborValue, current.value);
      }
    });

    // Create step AFTER processing the node to show the result
    steps.push({
      currentNode: current,
      paths: reconstructAllPaths(),
      distances: new Map(distances),
      unvisited: new Set(unvisited)
    });
  }

  // Add final step to show the completed state
  steps.push({
    currentNode: sourceNode, // Use source node as the "current" for final state
    paths: reconstructAllPaths(),
    distances: new Map(distances),
    unvisited: new Set(unvisited)
  });

  return steps;
};