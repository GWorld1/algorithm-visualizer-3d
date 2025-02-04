/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client'

import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { validateAndParseTree } from "@/lib/treeParser";
import { calculateTreeLayout } from "@/lib/treeLayout";
import { calculateWeightedTreeLayout } from "@/lib/weightedGraphLayout";

const TreeFileInput = () => {
  const { updateTree, updateWeightedTree, algorithmType } = useAlgorithmStore();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    console.log(file);
    if (!file) return;

    try {
      const content = await file.text();
      const parsedTree = validateAndParseTree(content);

      if ('edges' in parsedTree) {
        // It's a weighted tree
        updateWeightedTree(calculateWeightedTreeLayout(parsedTree));
      } else {
        // It's a binary tree
        updateTree(calculateTreeLayout(parsedTree));
      }
    } catch (error:any) {
      alert('Invalid tree file format: ' + error.message);
    }
  };

  return (
    <div className="fixed top-4 left-4 bg-white p-4 rounded-lg shadow">
      <input
        type="file"
        accept=".json"
        onChange={handleFileUpload}
        className="block w-full text-sm text-slate-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-semibold
          file:bg-violet-50 file:text-violet-700
          hover:file:bg-violet-100"
      />
    </div>
  );
};

export default TreeFileInput;