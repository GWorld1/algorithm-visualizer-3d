// lib/weightedTreeLayout.ts
import { WeightedTreeNode } from '@/types/WeightedTreeNode';

export const calculateWeightedTreeLayout = (
  node: WeightedTreeNode,
  depth: number = 0,
  x: number = 0,
  y: number = 0,
  horizontalSpacing: number = 3,
  verticalSpacing: number = 2,
  visited: Set<number> = new Set()
): WeightedTreeNode => {
  if (visited.has(node.value)) {
    return node;
  }
  
  visited.add(node.value);
  node.x = x;
  node.y = y;

  const edges = Object.entries(node.edges);
  const totalEdges = edges.length;
  
  edges.forEach(([_, edge], index) => {
    if (edge && !visited.has(edge.node.value)) {
      const angle = (2 * Math.PI * index) / totalEdges;
      const newX = x + horizontalSpacing * Math.cos(angle) / (depth + 1);
      const newY = y + verticalSpacing * Math.sin(angle) / (depth + 1);
      
      calculateWeightedTreeLayout(
        edge.node,
        depth + 1,
        newX,
        newY,
        horizontalSpacing,
        verticalSpacing,
        visited
      );
    }
  });

  return node;
};