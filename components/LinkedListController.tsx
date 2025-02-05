import { useLinkedListStore } from '@/store/useLinkedListStore';
import React, { useState } from 'react'

const LinkedListController = () => {
    const [value, setValue] = useState('');
  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow">
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
    </div>
  )
}

export default LinkedListController