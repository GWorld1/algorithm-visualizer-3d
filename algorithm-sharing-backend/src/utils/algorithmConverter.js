/**
 * Utility functions to convert between frontend visual scripting format
 * and backend database format for algorithms
 */

/**
 * Convert frontend CustomAlgorithm to backend Algorithm format
 * @param {Object} frontendAlgorithm - Algorithm from useVisualScriptingStore
 * @param {Object} additionalData - Additional data like title, category, etc.
 * @returns {Object} Backend-compatible algorithm object
 */
const convertToBackendFormat = (frontendAlgorithm, additionalData = {}) => {
  const {
    title = frontendAlgorithm.name || 'Untitled Algorithm',
    description = frontendAlgorithm.description || 'No description provided',
    category = 'custom',
    difficulty = 'beginner',
    tags = [],
    isPublic = true,
  } = additionalData;

  // Ensure all nodes have required fields
  const processedNodes = frontendAlgorithm.nodes.map(node => ({
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
  const processedConnections = frontendAlgorithm.connections.map(connection => ({
    id: connection.id,
    source: connection.source,
    sourceHandle: connection.sourceHandle,
    target: connection.target,
    targetHandle: connection.targetHandle,
  }));

  return {
    title,
    description,
    category,
    difficulty,
    dataStructureType: frontendAlgorithm.dataStructureType || 'array',
    nodes: processedNodes,
    connections: processedConnections,
    tags,
    isPublic,
    metadata: {
      nodeCount: processedNodes.length,
      connectionCount: processedConnections.length,
      estimatedTime: additionalData.estimatedTime || 'Unknown',
      complexity: {
        time: additionalData.timeComplexity || 'O(n)',
        space: additionalData.spaceComplexity || 'O(1)',
        level: difficulty,
      },
      version: '1.0.0',
    },
  };
};

/**
 * Convert backend Algorithm to frontend CustomAlgorithm format
 * @param {Object} backendAlgorithm - Algorithm from database
 * @returns {Object} Frontend-compatible algorithm object
 */
const convertToFrontendFormat = (backendAlgorithm) => {
  return {
    id: backendAlgorithm._id.toString(),
    name: backendAlgorithm.title,
    description: backendAlgorithm.description,
    dataStructureType: backendAlgorithm.dataStructureType,
    nodes: backendAlgorithm.nodes,
    connections: backendAlgorithm.connections,
    isValid: backendAlgorithm.isValid,
    // Additional metadata for frontend use
    category: backendAlgorithm.category,
    difficulty: backendAlgorithm.difficulty,
    tags: backendAlgorithm.tags,
    likes: backendAlgorithm.likes,
    downloads: backendAlgorithm.downloads,
    createdAt: backendAlgorithm.createdAt,
    updatedAt: backendAlgorithm.updatedAt,
    username: backendAlgorithm.username,
    isLikedByUser: backendAlgorithm.isLikedByUser,
  };
};

/**
 * Validate algorithm structure for sharing
 * @param {Object} algorithm - Algorithm to validate
 * @returns {Object} Validation result with isValid and errors
 */
const validateAlgorithmStructure = (algorithm) => {
  const errors = [];
  const warnings = [];

  // Check required fields
  if (!algorithm.nodes || !Array.isArray(algorithm.nodes)) {
    errors.push('Algorithm must have nodes array');
    return { isValid: false, errors, warnings };
  }

  if (algorithm.nodes.length === 0) {
    errors.push('Algorithm must have at least one node');
    return { isValid: false, errors, warnings };
  }

  // Check for start and end nodes
  const hasStart = algorithm.nodes.some(node => node.type === 'start');
  const hasEnd = algorithm.nodes.some(node => node.type === 'end');

  if (!hasStart) errors.push('Algorithm must have a Start node');
  if (!hasEnd) errors.push('Algorithm must have an End node');

  // Check node structure
  const nodeIds = new Set();
  algorithm.nodes.forEach((node, index) => {
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
  if (algorithm.connections && Array.isArray(algorithm.connections)) {
    algorithm.connections.forEach((connection, index) => {
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
 * @param {string} nodeType - Type of the node
 * @returns {string} Default label
 */
const getDefaultLabel = (nodeType) => {
  const labels = {
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
 * Generate algorithm preview data
 * @param {Object} algorithm - Algorithm object
 * @returns {Object} Preview data for thumbnails/cards
 */
const generateAlgorithmPreview = (algorithm) => {
  const nodeTypes = algorithm.nodes.reduce((acc, node) => {
    acc[node.type] = (acc[node.type] || 0) + 1;
    return acc;
  }, {});

  const hasLoops = algorithm.nodes.some(node => node.type === 'for-loop');
  const hasConditions = algorithm.nodes.some(node => node.type === 'if-condition');
  const hasArrayOperations = algorithm.nodes.some(node => 
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
    complexity: estimateComplexity(algorithm),
  };
};

/**
 * Estimate algorithm complexity based on structure
 * @param {Object} algorithm - Algorithm object
 * @returns {Object} Estimated time and space complexity
 */
const estimateComplexity = (algorithm) => {
  const hasNestedLoops = algorithm.connections.some(conn => {
    const sourceNode = algorithm.nodes.find(n => n.id === conn.source);
    const targetNode = algorithm.nodes.find(n => n.id === conn.target);
    return sourceNode?.type === 'for-loop' && targetNode?.type === 'for-loop';
  });

  const loopCount = algorithm.nodes.filter(n => n.type === 'for-loop').length;
  
  let timeComplexity = 'O(1)';
  if (loopCount === 1) timeComplexity = 'O(n)';
  else if (loopCount > 1 || hasNestedLoops) timeComplexity = 'O(n²)';

  return {
    time: timeComplexity,
    space: 'O(1)', // Most visual algorithms use constant space
  };
};

module.exports = {
  convertToBackendFormat,
  convertToFrontendFormat,
  validateAlgorithmStructure,
  generateAlgorithmPreview,
  getDefaultLabel,
};
