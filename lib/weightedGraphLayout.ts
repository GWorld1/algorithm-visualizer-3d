import { WeightedTreeNode } from '@/types/WeightedGraphNode';

interface NodePosition {
  x: number;
  y: number;
  z: number;  // Added z coordinate
  vx: number;
  vy: number;
  vz: number;  // Added z velocity
}

export const calculateWeightedTreeLayout = (
  root: WeightedTreeNode,
  width: number = 10,
  height: number = 10,
  depth: number = 10  // Added depth parameter
): WeightedTreeNode => {
  const nodePositions = new Map<number, NodePosition>();
  const visited = new Set<number>();

  // Initialize positions in 3D space
  const initializePositions = (node: WeightedTreeNode) => {
    if (visited.has(node.value)) return;
    visited.add(node.value);

    if (!nodePositions.has(node.value)) {
      nodePositions.set(node.value, {
        x: (Math.random() - 0.5) * width,
        y: (Math.random() - 0.5) * height,
        z: (Math.random() - 0.5) * depth,  // Random z position
        vx: 0,
        vy: 0,
        vz: 0
      });
    }

    Object.values(node.edges).forEach(edge => {
      if (edge.node) {
        initializePositions(edge.node);
      }
    });
  };

  // Enhanced force-directed layout algorithm for 3D
  const applyForces = () => {
    const repulsionForce = 1.5;  // Increased for better spacing
    const attractionForce = 0.1;
    const damping = 0.9;
    const minDistance = 0.1;  // Minimum distance to prevent extreme forces

    // Apply repulsion between all nodes in 3D
    const nodes = Array.from(nodePositions.entries());
    nodes.forEach(([id1, pos1]) => {
      nodes.forEach(([id2, pos2]) => {
        if (id1 !== id2) {
          const dx = pos1.x - pos2.x;
          const dy = pos1.y - pos2.y;
          const dz = pos1.z - pos2.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < minDistance) return;

          const force = repulsionForce / (distance * distance);
          pos1.vx += (dx / distance) * force;
          pos1.vy += (dy / distance) * force;
          pos1.vz += (dz / distance) * force;
        }
      });
    });

    // Apply attraction along edges in 3D
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
          const dz = pos2.z - pos1.z;
          const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
          
          if (distance < minDistance) return;

          // Ideal edge length based on weight
          const idealLength = 2 + edge.weight * 0.5;
          const force = (distance - idealLength) * attractionForce;
          
          pos1.vx += (dx / distance) * force;
          pos1.vy += (dy / distance) * force;
          pos1.vz += (dz / distance) * force;
          pos2.vx -= (dx / distance) * force;
          pos2.vy -= (dy / distance) * force;
          pos2.vz -= (dz / distance) * force;

          applyEdgeAttractions(edge.node);
        }
      });
    };

    // Update positions with 3D velocities
    nodePositions.forEach(pos => {
      pos.vx *= damping;
      pos.vy *= damping;
      pos.vz *= damping;
      
      pos.x += pos.vx;
      pos.y += pos.vy;
      pos.z += pos.vz;

      // Keep within bounds
      pos.x = Math.max(-width/2, Math.min(width/2, pos.x));
      pos.y = Math.max(-height/2, Math.min(height/2, pos.y));
      pos.z = Math.max(-depth/2, Math.min(depth/2, pos.z));
    });
  };

  // Initialize positions
  initializePositions(root);

  // Run force-directed layout with more iterations for better distribution
  for (let i = 0; i < 150; i++) {
    applyForces();
  }

  // Apply calculated 3D positions to nodes
  const applyPositions = (node: WeightedTreeNode, visited: Set<number> = new Set()): WeightedTreeNode => {
    if (visited.has(node.value)) return node;
    visited.add(node.value);

    const position = nodePositions.get(node.value)!;
    node.x = position.x;
    node.y = position.y;
    node.z = position.z;  // Add z coordinate to node

    Object.values(node.edges).forEach(edge => {
      if (edge.node && !visited.has(edge.node.value)) {
        applyPositions(edge.node, visited);
      }
    });

    return node;
  };

  return applyPositions(root);
};