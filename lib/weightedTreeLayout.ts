// lib/weightedTreeLayout.ts
import { WeightedTreeNode } from '@/types/WeightedTreeNode';

export const calculateWeightedTreeLayout = (
  node: WeightedTreeNode,
  depth: number = 0,
  x: number = 0,
  y: number = 0,
  horizontalSpacing: number = 3,
  verticalSpacing: number = 2
): WeightedTreeNode => {
  node.x = x;
  node.y = y;

  if (node.edges.left) {
    calculateWeightedTreeLayout(
      node.edges.left.node,
      depth + 1,
      x - horizontalSpacing / (depth + 1),
      y - verticalSpacing,
      horizontalSpacing,
      verticalSpacing
    );
  }

  if (node.edges.right) {
    calculateWeightedTreeLayout(
      node.edges.right.node,
      depth + 1,
      x + horizontalSpacing / (depth + 1),
      y - verticalSpacing,
      horizontalSpacing,
      verticalSpacing
    );
  }

  return node;
};