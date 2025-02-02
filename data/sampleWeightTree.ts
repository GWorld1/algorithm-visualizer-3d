// data/sampleWeightedTree.ts
import { WeightedTreeNode } from '@/types/WeightedTreeNode';

export const sampleWeightedTree: WeightedTreeNode = {
  value: 1,
  edges: {
    left: {
      node: {
        value: 2,
        edges: {
          left: { node: { value: 4, edges: {} }, weight: 3 },
          right: { node: { value: 5, edges: {} }, weight: 2 }
        }
      },
      weight: 4
    },
    right: {
      node: {
        value: 3,
        edges: {
          left: { node: { value: 6, edges: {} }, weight: 1 },
          right: { node: { value: 7, edges: {} }, weight: 5 }
        }
      },
      weight: 2
    }
  }
};