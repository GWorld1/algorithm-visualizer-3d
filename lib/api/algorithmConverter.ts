/**
 * Utility functions to convert between frontend visual scripting format
 * and backend database format for algorithms
 */

import { CustomAlgorithm, ScriptNode, Connection } from '@/types/VisualScripting';
import { ShareAlgorithmData, CommunityAlgorithm } from './algorithmSharingClient';

export interface ShareMetadata {
  title: string;
  description: string;
  category: 'sorting' | 'searching' | 'graph' | 'array' | 'debug' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublic: boolean;
  estimatedTime?: string;
  timeComplexity?: string;
  spaceComplexity?: string;
}

/**
 * Convert frontend CustomAlgorithm to backend ShareAlgorithmData format
 */
export const convertToShareFormat = (
  frontendAlgorithm: CustomAlgorithm,
  nodes: ScriptNode[],
  connections: Connection[],
  metadata: ShareMetadata
): ShareAlgorithmData => {
  // Ensure all nodes have required fields
  const processedNodes = nodes.map(node => ({
    id: node.id,
    type: node.type,
    position: {
      x: node.position.x,
      y: node.position.y,
    },
    data: {
      label: node.data.label || getDefaultLabel(node.type),
      ...node.data,
      isValid: node.data.isValid !== false, // Default to true if not specified
    },
    inputs: node.inputs || [],
    outputs: node.outputs || [],
  }));

  // Ensure all connections have required fields
  const processedConnections = connections.map(connection => ({
    id: connection.id,
    source: connection.source,
    sourceHandle: connection.sourceHandle,
    target: connection.target,
    targetHandle: connection.targetHandle,
  }));

  return {
    title: metadata.title,
    description: metadata.description,
    category: metadata.category,
    difficulty: metadata.difficulty,
    dataStructureType: frontendAlgorithm.dataStructureType || 'array',
    nodes: processedNodes,
    connections: processedConnections,
    tags: metadata.tags.filter(tag => tag.trim().length > 0),
    isPublic: metadata.isPublic,
    metadata: {
      estimatedTime: metadata.estimatedTime || 'Unknown',
      complexity: {
        time: metadata.timeComplexity || 'O(n)',
        space: metadata.spaceComplexity || 'O(1)',
      },
    },
  };
};

/**
 * Convert backend CommunityAlgorithm to frontend CustomAlgorithm format
 */
export const convertToCustomAlgorithm = (backendAlgorithm: CommunityAlgorithm): CustomAlgorithm => {
  return {
    id: backendAlgorithm._id,
    name: backendAlgorithm.title,
    description: backendAlgorithm.description,
    dataStructureType: backendAlgorithm.dataStructureType as 'array' | 'binaryTree' | 'linkedList' | 'weightedGraph',
    nodes: backendAlgorithm.nodes as ScriptNode[],
    connections: backendAlgorithm.connections as Connection[],
    isValid: true, // Assume community algorithms are valid
  };
};

/**
 * Validate algorithm structure for sharing
 */
export const validateAlgorithmForSharing = (
  nodes: ScriptNode[],
  connections: Connection[]
): { isValid: boolean; errors: string[]; warnings: string[] } => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Check required fields
  if (!nodes || !Array.isArray(nodes)) {
    errors.push('Algorithm must have nodes array');
    return { isValid: false, errors, warnings };
  }

  if (nodes.length === 0) {
    errors.push('Algorithm must have at least one node');
    return { isValid: false, errors, warnings };
  }

  // Check for start and end nodes
  const hasStart = nodes.some(node => node.type === 'start');
  const hasEnd = nodes.some(node => node.type === 'end');

  if (!hasStart) errors.push('Algorithm must have a Start node');
  if (!hasEnd) errors.push('Algorithm must have an End node');

  // Check node structure
  const nodeIds = new Set<string>();
  nodes.forEach((node, index) => {
    if (!node.id) {
      errors.push(`Node at index ${index} is missing ID`);
    } else if (nodeIds.has(node.id)) {
      errors.push(`Duplicate node ID: ${node.id}`);
    } else {
      nodeIds.add(node.id);
    }

    if (!node.type) {
      errors.push(`Node ${node.id || index} is missing type`);
    }

    if (!node.position || typeof node.position.x !== 'number' || typeof node.position.y !== 'number') {
      errors.push(`Node ${node.id || index} has invalid position`);
    }

    if (!node.data || !node.data.label) {
      warnings.push(`Node ${node.id || index} is missing label`);
    }
  });

  // Check connections
  if (connections && Array.isArray(connections)) {
    connections.forEach((connection, index) => {
      if (!connection.source || !nodeIds.has(connection.source)) {
        errors.push(`Connection at index ${index} has invalid source: ${connection.source}`);
      }
      if (!connection.target || !nodeIds.has(connection.target)) {
        errors.push(`Connection at index ${index} has invalid target: ${connection.target}`);
      }
      if (!connection.sourceHandle || !connection.targetHandle) {
        errors.push(`Connection at index ${index} is missing handle information`);
      }
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
};

/**
 * Get default label for node type
 */
export const getDefaultLabel = (nodeType: string): string => {
  const labels: Record<string, string> = {
    'start': 'Start',
    'end': 'End',
    'for-loop': 'For Loop',
    'if-condition': 'If Condition',
    'math-operation': 'Math Operation',
    'array-access': 'Array Access',
    'array-compare': 'Compare Elements',
    'array-swap': 'Swap Elements',
    'array-highlight': 'Highlight Elements',
    'variable-set': 'Set Variable',
    'variable-get': 'Get Variable',
    'counter-increment': 'Increment Counter',
    'update-description': 'Update Description',
    'pause-execution': 'Pause',
  };

  return labels[nodeType] || nodeType;
};

/**
 * Generate algorithm preview data for display
 */
export const generateAlgorithmPreview = (algorithm: CommunityAlgorithm) => {
  const nodeTypes = algorithm.nodes.reduce((acc: Record<string, number>, node: any) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  const hasLoops = algorithm.nodes.some((node: any) => node.type === 'for-loop');
  const hasConditions = algorithm.nodes.some((node: any) => node.type === 'if-condition');
  const hasArrayOperations = algorithm.nodes.some((node: any) => 
    ['array-access', 'array-compare', 'array-swap', 'array-highlight'].includes(node.type)
  );

  return {
    nodeCount: algorithm.nodes.length,
    connectionCount: algorithm.connections.length,
    features: {
      hasLoops,
      hasConditions,
      hasArrayOperations,
    },
    nodeTypes,
    complexity: algorithm.metadata.complexity,
  };
};

/**
 * Estimate algorithm complexity based on structure
 */
export const estimateComplexity = (nodes: ScriptNode[], connections: Connection[]) => {
  const hasNestedLoops = connections.some(conn => {
    const sourceNode = nodes.find(n => n.id === conn.source);
    const targetNode = nodes.find(n => n.id === conn.target);
    return sourceNode?.type === 'for-loop' && targetNode?.type === 'for-loop';
  });

  const loopCount = nodes.filter(n => n.type === 'for-loop').length;
  
  let timeComplexity = 'O(1)';
  if (loopCount === 1) timeComplexity = 'O(n)';
  else if (loopCount > 1 || hasNestedLoops) timeComplexity = 'O(n²)';

  return {
    time: timeComplexity,
    space: 'O(1)', // Most visual algorithms use constant space
  };
};
