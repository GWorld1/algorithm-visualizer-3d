import { TreeNode } from "@/types/Treenode";

export const findNode = (
    node: TreeNode, 
    value: number
  ): TreeNode | undefined => {
    if (node.value === value) return node;
    if (node.left) {
      const leftResult = findNode(node.left, value);
      if (leftResult) return leftResult;
    }
    if (node.right) {
      const rightResult = findNode(node.right, value);
      if (rightResult) return rightResult;
    }
  };