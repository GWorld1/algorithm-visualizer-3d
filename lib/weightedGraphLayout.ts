import { WeightedTreeNode } from '@/types/WeightedGraphNode';

interface NodePosition {
  x: number;
  y: number;
  vx: number;
  vy: number;
}

export const calculateWeightedTreeLayout = (
  root: WeightedTreeNode,
  width: number = 10,
  height: number = 10
): WeightedTreeNode => {
  // Track all nodes and their positions
  const nodePositions = new Map<number, NodePosition>();
  const visited = new Set<number>();

  // Initialize positions for all nodes
  const initializePositions = (node: WeightedTreeNode) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);

    if (!nodePositions.has(node.value)) {
      nodePositions.set(node.value, {
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        vx: 0,
        vy: 0
      });
    }

    Object.values(node.edges).forEach(edge => {
      if (edge.node) {
        initializePositions(edge.node);
      }
    });
  };

  // Force-directed layout algorithm
  const applyForces = () => {
    const repulsionForce = 1;
    const attractionForce = 0.1;
    const damping = 0.9;

    // Apply repulsion between all nodes
    const nodes = Array.from(nodePositions.entries());
    nodes.forEach(([id1, pos1]) => {
      nodes.forEach(([id2, pos2]) => {
        if (id1 !== id2) {
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < 0.01) return; // Avoid division by zero

          const force = repulsionForce / (distance * distance);
          pos1.vx += (dx / distance) * force;
          pos1.vy += (dy / distance) * force;
        }
      });
    });

    // Apply attraction along edges
    visited.clear();
    const applyEdgeAttractions = (node: WeightedTreeNode) => {
      if (visited.has(node.value)) return;
      visited.add(node.value);

      const pos1 = nodePositions.get(node.value)!;
      Object.values(node.edges).forEach(edge => {
        if (edge.node && !visited.has(edge.node.value)) {
          const pos2 = nodePositions.get(edge.node.value)!;
          const dx = pos2.x - pos1.x;
          const dy = pos2.y - pos1.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          const force = (distance - 2) * attractionForce; // 2 is ideal edge length
          pos1.vx += (dx / distance) * force;
          pos1.vy += (dy / distance) * force;
          pos2.vx -= (dx / distance) * force;
          pos2.vy -= (dy / distance) * force;

          applyEdgeAttractions(edge.node);
        }
      });
    };

    // Update positions
    nodePositions.forEach(pos => {
      pos.vx *= damping;
      pos.vy *= damping;
      pos.x += pos.vx;
      pos.y += pos.vy;

      // Keep within bounds
      pos.x = Math.max(-width/2, Math.min(width/2, pos.x));
      pos.y = Math.max(-height/2, Math.min(height/2, pos.y));
    });
  };

  // Initialize positions
  initializePositions(root);

  // Run force-directed layout
  for (let i = 0; i < 100; i++) {
    applyForces();
  }

  // Apply calculated positions to nodes
  const applyPositions = (node: WeightedTreeNode, visited: Set<number> = new Set()): WeightedTreeNode => {
    if (visited.has(node.value)) return node;
    visited.add(node.value);

    const position = nodePositions.get(node.value)!;
    node.x = position.x;
    node.y = position.y;

    Object.values(node.edges).forEach(edge => {
      if (edge.node && !visited.has(edge.node.value)) {
        applyPositions(edge.node, visited);
      }
    });

    return node;
  };

  return applyPositions(root);
};