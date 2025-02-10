// types/WeightedTreeNode.ts
export interface WeightedTreeNode {
  value: number;
  x?: number;
  y?: number;
  z?: number;  // Added z coordinate
  parentValue?: number | null;
  distance?: number;
  previousNode?: WeightedTreeNode | null;
  edges: {
    [key: string]: {
      node: WeightedTreeNode;
      weight: number;
    };
  };
}