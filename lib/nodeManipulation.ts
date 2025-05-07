/* eslint-disable @typescript-eslint/no-unused-vars */
// lib/nodeManipulation.ts
import { TreeNode } from "@/types/Treenode";
import { WeightedTreeNode } from "@/types/WeightedGraphNode";
import { calculateTreeLayout } from "./treeLayout";
import { calculateWeightedTreeLayout } from "./weightedGraphLayout";

// Binary Tree Operations
export const addTreeNode = (
  tree: TreeNode,
  _parentValue: number, // Ignored as we'll determine placement automatically
  _side: 'left' | 'right', // Ignored as we'll determine placement automatically
  newValue: number
): TreeNode => {
  const newTree = structuredClone(tree);
  
  const insertNode = (node: TreeNode): boolean => {
    if (newValue === node.value) {
      return false; // Duplicate values not allowed in BST
    }
    
    if (newValue < node.value) {
      if (!node.left) {
        node.left = { value: newValue };
        return true;
      }
      return insertNode(node.left);
    } else {
      if (!node.right) {
        node.right = { value: newValue };
        return true;
      }
      return insertNode(node.right);
    }
  };

  if (insertNode(newTree)) {
    return calculateTreeLayout(newTree);
  }
  return tree;
};

export const deleteTreeNode = (
  tree: TreeNode,
  valueToDelete: number
): TreeNode | null => {
  if (!tree) return null;

  const newTree = structuredClone(tree);

  const findMinValue = (node: TreeNode): number => {
    let current = node;
    while (current.left) {
      current = current.left;
    }
    return current.value;
  };

  const deleteNode = (node: TreeNode | undefined, value: number): TreeNode | undefined => {
    if (!node) return undefined;

    // Search for the node
    if (value < node.value) {
      node.left = deleteNode(node.left, value);
    } else if (value > node.value) {
      node.right = deleteNode(node.right, value);
    } else {
      // Node found, handle deletion
      
      // Case 1: Leaf node
      if (!node.left && !node.right) {
        return undefined;
      }
      
      // Case 2: Node with one child
      if (!node.left) return node.right;
      if (!node.right) return node.left;
      
      // Case 3: Node with two children
      // Find the smallest value in right subtree (successor)
      const minValue = findMinValue(node.right);
      node.value = minValue; // Replace current node's value
      node.right = deleteNode(node.right, minValue); // Delete the successor
    }
    return node;
  };

  const result = deleteNode(newTree, valueToDelete);
  return result ? calculateTreeLayout(result) : null;
};

// Weighted Graph Operations
const findNode = (
  node: WeightedTreeNode, 
  value: number, 
  visited: Set<number> = new Set()
): WeightedTreeNode | null => {
  if (visited.has(node.value)) return null;
  visited.add(node.value);
  
  if (node.value === value) return node;
  
  for (const edge of Object.values(node.edges)) {
    const found = findNode(edge.node, value, visited);
    if (found) return found;
  }
  
  return null;
};

// Helper function to create a deep copy of the graph
const cloneGraph = (
  node: WeightedTreeNode, 
  visited: Set<number> = new Set()
): WeightedTreeNode => {
  if (visited.has(node.value)) {
    return {
      value: node.value,
      edges: {},
      x: node.x,
      y: node.y
    };
  }
  
  visited.add(node.value);
  const clone: WeightedTreeNode = {
    value: node.value,
    edges: {},
    x: node.x,
    y: node.y
  };
  
  Object.entries(node.edges).forEach(([key, edge]) => {
    clone.edges[key] = {
      node: cloneGraph(edge.node, visited),
      weight: edge.weight
    };
  });
  
  return clone;
};

export const addGraphNode = (
  graph: WeightedTreeNode,
  newValue: number,
  connections: Array<{targetValue: number, weight: number}>
): WeightedTreeNode => {
  // Create a deep copy of the graph
  const newGraph = cloneGraph(graph);
  
  // Create the new node
  const newNode: WeightedTreeNode = {
    value: newValue,
    edges: {},
    x: 0,
    y: 0
  };

  // Track if we've successfully added any connections
  let hasConnections = false;
  
  // Add connections between the new node and target nodes
  connections.forEach(({ targetValue, weight }) => {
    const targetNode = findNode(newGraph, targetValue, new Set());
    if (targetNode) {
      hasConnections = true;
      
      // Create bidirectional edges
      const edgeKey = `edge_${targetNode.value}_${newValue}`;
      const reverseEdgeKey = `edge_${newValue}_${targetNode.value}`;
      
      // Add edge from target to new node
      targetNode.edges[edgeKey] = {
        node: newNode,
        weight
      };
      
      // Add edge from new node to target
      newNode.edges[reverseEdgeKey] = {
        node: targetNode,
        weight
      };
    }
  });

  // If we have any successful connections, add the new node to the graph structure
  if (hasConnections) {
    // Find any existing node to attach the new node to the graph structure
    const firstConnection = connections[0];
    if (firstConnection) {
      const attachNode = findNode(newGraph, firstConnection.targetValue, new Set());
      if (attachNode) {
        // We don't need to add any additional edges here since we already created
        // the bidirectional connections above
        return calculateWeightedTreeLayout(newGraph);
      }
    }
  }
  
  return graph; // Return original graph if no connections were made
};

export const deleteGraphNode = (
  graph: WeightedTreeNode,
  valueToDelete: number
): WeightedTreeNode => {
  const visited = new Set<number>();
  
  // Create new graph without the deleted node
  const filterNode = (node: WeightedTreeNode, visited: Set<number>): WeightedTreeNode => {
    if (visited.has(node.value)) {
      return {
        value: node.value,
        edges: {},
        x: node.x,
        y: node.y
      };
    }
    
    visited.add(node.value);
    
    const newNode: WeightedTreeNode = {
      value: node.value,
      edges: {},
      x: node.x,
      y: node.y
    };
    
    // Only keep edges that don't point to the deleted node
    Object.entries(node.edges).forEach(([key, edge]) => {
      if (edge.node.value !== valueToDelete) {
        newNode.edges[key] = {
          node: filterNode(edge.node, visited),
          weight: edge.weight
        };
      }
    });
    
    return newNode;
  };
  
  // If we're deleting the root node, find a new root
  if (graph.value === valueToDelete) {
    const firstEdge = Object.values(graph.edges)[0];
    return firstEdge ? calculateWeightedTreeLayout(firstEdge.node) : graph;
  }
  
  const newGraph = filterNode(graph, new Set());
  return calculateWeightedTreeLayout(newGraph);
};