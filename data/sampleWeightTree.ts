// data/sampleWeightedTree.ts
import { WeightedTreeNode } from '@/types/WeightedGraphNode';

// Create a comprehensive weighted graph for testing Dijkstra's algorithm
// Graph structure (bidirectional):
//     1 ----4---- 2
//     |           |
//     2           3
//     |           |
//     3 ----1---- 4
//     |           |
//     5           2
//     |           |
//     5 ----3---- 6

// Helper function to create a bidirectional weighted graph
function createWeightedGraph(): WeightedTreeNode {
  // Create all nodes first
  const nodes: { [key: number]: WeightedTreeNode } = {};

  for (let i = 1; i <= 6; i++) {
    nodes[i] = {
      value: i,
      isSource: i === 1, // Only node 1 is source initially
      edges: {}
    };
  }

  // Define edges as [from, to, weight]
  const edges: [number, number, number][] = [
    [1, 2, 4],
    [1, 3, 2],
    [2, 4, 3],
    [3, 4, 1],
    [3, 5, 5],
    [4, 6, 2],
    [5, 6, 3]
  ];

  // Add bidirectional edges - each node references the actual node objects
  edges.forEach(([from, to, weight]) => {
    // Add edge from -> to
    nodes[from].edges[`edge_${from}_${to}`] = {
      node: nodes[to],
      weight: weight
    };

    // Add edge to -> from (bidirectional)
    nodes[to].edges[`edge_${to}_${from}`] = {
      node: nodes[from],
      weight: weight
    };
  });

  return nodes[1]; // Return node 1 as root
}

export const sampleWeightedTree: WeightedTreeNode = createWeightedGraph();