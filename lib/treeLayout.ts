import { TreeNode } from "@/types/Treenode";

export const calculateTreeLayout = (
    node: TreeNode,
    depth: number = 0,
    x: number = 0,
    y: number = 0,
    horizontalSpacing: number = 3,
    verticalSpacing: number = 2
  ): TreeNode => {
    node.x = x;
    node.y = y;
  
    if (node.left) {
      calculateTreeLayout(
        node.left,
        depth + 1,
        x - horizontalSpacing / (depth + 1),
        y - verticalSpacing,
        horizontalSpacing,
        verticalSpacing
      );
    }
  
    if (node.right) {
      calculateTreeLayout(
        node.right,
        depth + 1,
        x + horizontalSpacing / (depth + 1),
        y - verticalSpacing,
        horizontalSpacing,
        verticalSpacing
      );
    }
  
    return node;
  };