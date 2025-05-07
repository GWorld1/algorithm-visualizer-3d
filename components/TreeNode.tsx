// components/TreeNode.tsx
import { Mesh, Vector3 } from 'three';
import { useRef, useState } from 'react';
import { Text, Html } from '@react-three/drei';
import { TreeNode as TreeNodeType } from '@/types/Treenode';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { addTreeNode, deleteTreeNode } from '@/lib/nodeManipulation';

const TreeNode = ({
  node,
  position,
  isActive,
}: {
  node: TreeNodeType;
  position: Vector3;
  isActive: boolean;
}) => {
  const meshRef = useRef<Mesh>(null);
  const { updateTree, tree } = useAlgorithmStore();
  const [showMenu, setShowMenu] = useState(false);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newValue, setNewValue] = useState('');

  const handleAddNode = () => {
    const value = parseInt(newValue);
    if (!isNaN(value)) {
      const updatedTree = addTreeNode(tree, node.value, 'left', value); // Side parameter is ignored now
      if (updatedTree) {
        updateTree(updatedTree);
      }
    }
    setShowAddDialog(false);
    setNewValue('');
    setShowMenu(false);
  };

  const handleDelete = () => {
    const updatedTree = deleteTreeNode(tree, node.value);
    if (updatedTree) {
      updateTree(updatedTree);
    }
    setShowMenu(false);
  };

  return (
    <group position={position}>
      {/* Node sphere */}
      <mesh
        ref={meshRef}
        scale={0.5}
        onClick={() => setShowMenu(!showMenu)}
        onPointerOver={() => { document.body.style.cursor = 'pointer' }}
        onPointerOut={() => { document.body.style.cursor = 'default' }}
      >
        <sphereGeometry />
        <meshStandardMaterial color={isActive ? '#ef4444' : '#049ef4'} />
      </mesh>

      {/* Value label */}
      <Text
        position={[0, 0.7, 0]}
        fontSize={0.3}
        color="steelblue"
        anchorX="center"
        anchorY="middle"
      >
        {node.value}
      </Text>

      {/* Context Menu */}
      {showMenu && (
        <Html position={[1, 0, 0]}>
          <div className="bg-white p-2 rounded shadow-lg">
            <button
              className="block w-full text-left px-2 py-1 hover:bg-gray-100"
              onClick={() => setShowAddDialog(true)}
            >
              Add Node
            </button>
            <button
              className="block w-full text-left px-2 py-1 hover:bg-red-100 text-red-600"
              onClick={handleDelete}
            >
              Delete Node
            </button>
          </div>
        </Html>
      )}

      {/* Add Node Dialog */}
      {showAddDialog && (
        <Html position={[1, 1, 0]}>
          <div className="bg-white p-2 rounded shadow-lg">
            <input
              type="number"
              value={newValue}
              onChange={(e) => setNewValue(e.target.value)}
              className="border p-1 mb-2 w-full"
              placeholder="Enter value"
            />
            <div className="flex gap-2">
              <button
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                onClick={handleAddNode}
              >
                Add
              </button>
              <button
                className="px-2 py-1 bg-gray-500 text-white rounded hover:bg-gray-600"
                onClick={() => {
                  setShowAddDialog(false);
                  setNewValue('');
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </Html>
      )}
    </group>
  );
};

export default TreeNode;