export type TreeNode = {
    value: number;
    left?: TreeNode;
    right?: TreeNode;
    x?: number; // Calculated X position
    y?: number; // Calculated Y position
  };