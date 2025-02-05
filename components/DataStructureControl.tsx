"use client"
import { useState } from 'react';
import { useLinkedListStore } from '@/store/useLinkedListStore';
import { useArrayStore } from '@/store/useArrayStore';

const DataStructureControls = () => {
  const [activeTab, setActiveTab] = useState<'array'|'linkedlist'>('array');
  const [value, setValue] = useState('');
  const [index, setIndex] = useState('');

  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow">
      <div className="flex gap-2 mb-4">
        <button onClick={() => setActiveTab('array')}>Array</button>
        <button onClick={() => setActiveTab('linkedlist')}>Linked List</button>
      </div>

      {activeTab === 'array' && (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <input
            type="number"
            placeholder="Index"
            value={index}
            onChange={(e) => setIndex(e.target.value)}
          />
          <button onClick={() => 
            useArrayStore.getState().insert(Number(index), Number(value))
          }>
            Insert
          </button>
          <button onClick={() => 
            useArrayStore.getState().remove(Number(index))
          }>
            Remove
          </button>
        </div>
      )}

      {activeTab === 'linkedlist' && (
        <div className="flex flex-col gap-2">
          <input
            type="number"
            placeholder="Value"
            value={value}
            onChange={(e) => setValue(e.target.value)}
          />
          <button onClick={() => 
            useLinkedListStore.getState().addNode(Number(value))
          }>
            Add Node
          </button>
          <button onClick={() => 
            useLinkedListStore.getState().removeNode('head')
          }>
            Remove
          </button>
        </div>
      )}
    </div>
  );
};

export default DataStructureControls;