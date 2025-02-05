import {create} from "zustand";

type LinkedListNode = {
    value: number;
    nextId: string | null;
    position: [number, number,number];
};

type LinkedListState = {
    nodes: Record<string, LinkedListNode>;
    lastNodePosition: [number, number, number];
    addNode: (value:number, prevId?: string) => void;
    removeNode: (id:string) => void;
   // updateNode: (value: number, position: [number, number, number]) => void;
};

export const useLinkedListStore = create<LinkedListState>((set) => ({
    nodes: {
        'head': { value: -1, nextId: null, position: [0, 2, 0] },
    },
    lastNodePosition: [0, 2, 0],
    addNode: (value: number, prevId: string = 'head') => {
        const newNodeId = Math.random().toString();
        
        set((state) => {
            // Validate if prevId exists
            if (!state.nodes[prevId]) {
                throw new Error(`Node with id ${prevId} not found`);
            }
    
            const newNodes = {...state.nodes};
            const prevNode = newNodes[prevId];
            const prevNodePosition = state.lastNodePosition;
            // Calculate new position relative to previous node
            const xOffset = 2; // Consistent spacing between nodes
            const newPosition: [number, number, number] = [
                prevNodePosition[0] + xOffset,
                prevNodePosition[1],
                prevNodePosition[2],
            ]


            
    
            // Create new node
            newNodes[newNodeId] = {
                value,
                nextId: prevNode.nextId,
                position: newPosition,
            };
    
            // Update previous node's next pointer
            newNodes[prevId].nextId = newNodeId;
    
            return { nodes: newNodes, lastNodePosition: newPosition };
        });
    },
    removeNode: (id) => {
        set((state) => {
            const newNodes = { ...state.nodes };
            const prevNode = Object.values(newNodes).find(n => n.nextId === id);
            if (prevNode) prevNode.nextId = newNodes[id].nextId;
            delete newNodes[id];
            return { nodes: newNodes };
          });
    },
}));