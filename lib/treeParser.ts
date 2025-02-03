/* eslint-disable @typescript-eslint/no-explicit-any */

import { WeightedTreeNode } from "@/types/WeightedTreeNode";
import { TreeNode } from "@/types/Treenode";

interface TreeFile {
  type: 'weighted' | 'binary';
  data: any;
}

export const validateAndParseTree = (fileContent: string): TreeNode | WeightedTreeNode => {
  try {
    const parsedContent: TreeFile = JSON.parse(fileContent);
    
    if (parsedContent.type === 'weighted') {
      return validateWeightedTree(parsedContent.data);
    } else {
      return validateBinaryTree(parsedContent.data);
    }
  } catch (error:any) { 
    console.error('Error parsing tree file:', error.message);
    throw new Error('Invalid tree file format');
  }
};

const validateWeightedTree = (data: any): WeightedTreeNode => {
  if (!data.value || typeof data.value !== 'number') {
    throw new Error('Node must have a numeric value');
  }

  const node: WeightedTreeNode = {
    value: data.value,
    edges: {}
  };

  if (data.edges?.left) {
    if (typeof data.edges.left.weight !== 'number') {
      throw new Error('Edge must have a numeric weight');
    }
    node.edges.left = {
      node: validateWeightedTree(data.edges.left.node),
      weight: data.edges.left.weight
    };
  }

  if (data.edges?.right) {
    if (typeof data.edges.right.weight !== 'number') {
      throw new Error('Edge must have a numeric weight');
    }
    node.edges.right = {
      node: validateWeightedTree(data.edges.right.node),
      weight: data.edges.right.weight
    };
  }

  return node;
};

const validateBinaryTree = (data: any): TreeNode => {
  if (!data.value || typeof data.value !== 'number') {
    throw new Error('Node must have a numeric value');
  }

  const node: TreeNode = {
    value: data.value
  };

  if (data.left) {
    node.left = validateBinaryTree(data.left);
  }
  if (data.right) {
    node.right = validateBinaryTree(data.right);
  }

  return node;
};