import { useArrayStore } from '@/store/useArrayStore';
import React, { useState } from 'react'

const ArrayController = () => {
    const [value, setValue] = useState('');
    const [index, setIndex] = useState('');
  return (
    <div className="fixed top-4 right-4 bg-white p-4 rounded-lg shadow">
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
    </div>
  )
}

export default ArrayController