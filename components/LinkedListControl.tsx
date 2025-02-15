// components/LinkedListControls.tsx
"use client";

import { useState } from "react";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { createLinkedList, searchLinkedList, insertNode, deleteNode } from "@/lib/linkedListAlgorithms";


const LinkedListControls = () => {
  const { algorithmType, updateLinkedList, linkedList, setSteps, play } = useAlgorithmStore();
  const [elements, setElements] = useState<number[]>([1, 10, 9]);
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [insertAfterValue, setInsertAfterValue] = useState<number | null>(null);
  const [insertNewValue, setInsertNewValue] = useState<number | null>(null);
  const [deleteValue, setDeleteValue] = useState<number | null>(null);
  
  const handleCreateLinkedList = () => {
    const steps = createLinkedList(elements);
    useAlgorithmStore.getState().setSteps(steps);
    play();
    if (steps.length > 0) {
      updateLinkedList(steps[steps.length - 1].list!);
    }
  };

  const handleSearch = () => {
    if (searchValue === null) {
      alert("Please enter a value to search.");
      return;
    }
    const steps = searchLinkedList(linkedList, searchValue);
    useAlgorithmStore.getState().setSteps(steps);
    play();
  };

  const handleInsert = () => {
    if (insertAfterValue === null || insertNewValue === null) {
      alert("Please enter values for both 'Insert After' and 'New Value'.");
      return;
    }
    const steps = insertNode(linkedList, insertAfterValue, insertNewValue);
    useAlgorithmStore.getState().setSteps(steps);
    play();
  };

  const handleDelete = () => {
    if (deleteValue === null) {
      alert("Please enter a value to delete.");
      return;
    }
    const steps = deleteNode(linkedList, deleteValue);
    useAlgorithmStore.getState().setSteps(steps);
    play();
  };
  
  return (
    <div className="fixed bottom-4 right-4 shadow z-10 flex flex-col gap-2 p-4 bg-white rounded-md">
      {
      algorithmType == 'createLinkedList' &&
      <div className="flex flex-row space-x-2 items-center">
        <label htmlFor="elements">Elements:</label>
        <input
          type="text"
          id="elements"
          className="p-1 border rounded"
          value={elements.join(', ')}
          onChange={(e) => setElements(e.target.value.split(',').map(Number))}
        />
        <button onClick={handleCreateLinkedList} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
          Create Linked List
        </button>
      </div>
      }
      
      {
        algorithmType == 'searchLinkedList' &&
        <div className="flex items-center gap-2">
        <label htmlFor="searchValue">Search Value:</label>
        <input
          type="number"
          id="searchValue"
          className="p-1 border rounded"
          onChange={(e) => setSearchValue(parseInt(e.target.value))}
        />
        <button onClick={handleSearch} className="bg-green-500 text-white p-2 rounded hover:bg-green-700">
          Search
        </button>
      </div>
      }

      {
        algorithmType == 'insertNode' &&
        <div className="flex items-center gap-2">
        <label htmlFor="insertAfterValue">Insert After:</label>
        <input
          type="number"
          id="insertAfterValue"
          className="p-1 border rounded"
          onChange={(e) => setInsertAfterValue(parseInt(e.target.value))}
        />
        <label htmlFor="insertNewValue">New Value:</label>
        <input
          type="number"
          id="insertNewValue"
          className="p-1 border rounded"
          onChange={(e) => setInsertNewValue(parseInt(e.target.value))}
        />
        <button onClick={handleInsert} className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-700">
          Insert
        </button>
      </div>}


      {
        algorithmType == 'deleteNode' &&
        <div className="flex items-center gap-2">
        <label htmlFor="deleteValue">Delete Value:</label>
        <input
          type="number"
          id="deleteValue"
          className="p-1 border rounded"
          onChange={(e) => setDeleteValue(parseInt(e.target.value))}
        />
        <button onClick={handleDelete} className="bg-red-500 text-white p-2 rounded hover:bg-red-700">
          Delete
        </button>
      </div>}
    </div>
  );
};

export default LinkedListControls;