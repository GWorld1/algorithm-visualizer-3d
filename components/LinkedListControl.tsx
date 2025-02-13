// components/LinkedListControls.tsx
"use client";

import { useState } from "react";
import { useAlgorithmStore } from "@/store/useAlgorithmStore";
import { createLinkedList, searchLinkedList, insertNode, deleteNode } from "@/lib/linkedListAlgorithms";
import { useArrayStore } from "@/store/useArrayStore";

const LinkedListControls = () => {
  const { updateLinkedList, linkedList } = useAlgorithmStore();
  const { elements } = useArrayStore();
  const [searchValue, setSearchValue] = useState<number | null>(null);
  const [insertAfterValue, setInsertAfterValue] = useState<number | null>(null);
  const [insertNewValue, setInsertNewValue] = useState<number | null>(null);
  const [deleteValue, setDeleteValue] = useState<number | null>(null);

  const handleCreateLinkedList = () => {
    const newList = createLinkedList(elements);
    updateLinkedList(newList);
  };

  const handleSearch = () => {
    if (searchValue === null) {
      alert("Please enter a value to search.");
      return;
    }
    const searchedNode = searchLinkedList(linkedList, searchValue);
    if (searchedNode) {
      alert(`Node with value ${searchValue} found!`);
    } else {
      alert(`Node with value ${searchValue} not found.`);
    }
  };

  const handleInsert = () => {
    if (insertAfterValue === null || insertNewValue === null) {
      alert("Please enter values for both 'Insert After' and 'New Value'.");
      return;
    }
    const insertedList = insertNode(linkedList, insertAfterValue, insertNewValue);
    updateLinkedList(insertedList);
  };

  const handleDelete = () => {
    if (deleteValue === null) {
      alert("Please enter a value to delete.");
      return;
    }
    const deletedList = deleteNode(linkedList, deleteValue);
    updateLinkedList(deletedList);
  };

  return (
    <div className="fixed bottom-4 right-4 shadow z-10flex flex-col gap-2 p-4 bg-gray-100 rounded-md">
      <h3 className="text-lg font-semibold">Linked List Operations</h3>

      <button onClick={handleCreateLinkedList} className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700">
        Create Linked List
      </button>

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
      </div>

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
      </div>
    </div>
  );
};

export default LinkedListControls;