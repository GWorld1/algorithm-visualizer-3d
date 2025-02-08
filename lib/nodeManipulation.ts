// lib/nodeManipulation.ts
import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from "@/types/WeightedGraphNode";
import { calculateTreeLayout } from "./treeLayout";
import { calculateWeightedTreeLayout } from "./weightedGraphLayout";

// Binary Tree Operations
export const addTreeNode = (
  tree: TreeNode,
  parentValue: number,
  side: 'left' | 'right',
  newValue: number
): TreeNode => {
  const newTree = structuredClone(tree);
  
  const findAndAddNode = (node: TreeNode): boolean => {
    if (node.value === parentValue) {
      if (!node[side]) {
        node[side] = { value: newValue };
        return true;
      }
      return false; // Position already occupied
    }
    
    let added = false;
    if (node.left) added = findAndAddNode(node.left);
    if (!added && node.right) added = findAndAddNode(node.right);
    return added;
  };

  if (findAndAddNode(newTree)) {
    return calculateTreeLayout(newTree);
  }
  return tree;
};

export const deleteTreeNode = (
  tree: TreeNode,
  valueToDelete: number
): TreeNode | null => {
  if (tree.value === valueToDelete) {
    return null;
  }

  const newTree = structuredClone(tree);
  
  const findAndDeleteNode = (node: TreeNode): void => {
    if (node.left?.value === valueToDelete) {
      node.left = undefined;
      return;
    }
    if (node.right?.value === valueToDelete) {
      node.right = undefined;
      return;
    }
    
    if (node.left) findAndDeleteNode(node.left);
    if (node.right) findAndDeleteNode(node.right);
  };

  findAndDeleteNode(newTree);
  return calculateTreeLayout(newTree);
};

// Weighted Graph Operations
export const addGraphNode = (
  graph: WeightedTreeNode,
  newValue: number,
  connections: Array<{targetValue: number, weight: number}>
): WeightedTreeNode => {
  const newGraph = structuredClone(graph);
  const newNode: WeightedTreeNode = {
    value: newValue,
    edges: {}
  };

  // Add the new node regardless of connections
  newGraph.edges[newValue] = {
    node: newNode,
    weight: 1
  };

  // Add connections if any
  connections.forEach(({ targetValue, weight }) => {
    const targetNode = findGraphNode(newGraph, targetValue);
    if (targetNode) {
      newNode.edges[targetValue] = { node: targetNode, weight };
      targetNode.edges[newValue] = { node: newNode, weight };
    }
  });

  return calculateWeightedTreeLayout(newGraph);
};

export const deleteGraphNode = (
  graph: WeightedTreeNode,
  valueToDelete: number
): WeightedTreeNode => {
  const newGraph = structuredClone(graph);
  
  // Remove all edges pointing to the node to be deleted
  const removeEdges = (node: WeightedTreeNode, visited: Set<number>) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);
    
    delete node.edges[valueToDelete];
    
    Object.values(node.edges).forEach(edge => {
      removeEdges(edge.node, visited);
    });
  };

  removeEdges(newGraph, new Set());
  return calculateWeightedTreeLayout(newGraph);
};

// Helper function to find a node in the weighted graph
const findGraphNode = (
  graph: WeightedTreeNode,
  value: number,
  visited: Set<number> = new Set()
): WeightedTreeNode | null => {
  if (visited.has(graph.value)) return null;
  visited.add(graph.value);
  
  if (graph.value === value) return graph;
  
  for (const edge of Object.values(graph.edges)) {
    const found = findGraphNode(edge.node, value, visited);
    if (found) return found;
  }
  
  return null;
};