import { TreeNode } from "./Treenode";

// types/WeightedTreeNode.ts
export interface WeightedTreeNode extends TreeNode {
    distance?: number;
    previousNode?: WeightedTreeNode | null;
    edges: {
      left?: {
        node: WeightedTreeNode;
        weight: number;
      };
      right?: {
        node: WeightedTreeNode;
        weight: number;
      };
    };
  }