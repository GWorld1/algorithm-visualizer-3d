import { LinkedListNode } from "@/types/LinkedListNode";

export type LinkedListStep = {
  list: LinkedListNode | null;
  description: string;
  highlightedNodes?: {
    current?: number;
    target?: number;
    new?: number;
    deleted?: number;
    traversed: number[];
  };
};

// Helper to deep copy the linked list for steps
const copyLinkedList = (head: LinkedListNode | null): LinkedListNode | null => {
  if (!head) return null;
  const newHead: LinkedListNode = { value: head.value };
  let current = newHead;
  let oldCurrent = head.next;
  while (oldCurrent) {
    current.next = { value: oldCurrent.value };
    current = current.next;
    oldCurrent = oldCurrent.next;
  }
  return newHead;
};

export const createLinkedList = (values: number[]): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!values.length) return steps;

  let head: LinkedListNode | null = null;
  
  // Initial state
  steps.push({
    list: null,
    description: "Starting to create linked list",
    highlightedNodes: { traversed: [] }
  });

  // Create head node
  head = { value: values[0] };
  steps.push({
    list: copyLinkedList(head),
    description: `Created head node with value ${values[0]}`,
    highlightedNodes: {
      new: values[0],
      traversed: []
    }
  });

  let current = head;
  const traversed = [values[0]];

  for (let i = 1; i < values.length; i++) {
    // Show traversal to last node
    steps.push({
      list: copyLinkedList(head),
      description: `Traversing to insert position for ${values[i]}`,
      highlightedNodes: {
        current: current.value,
        traversed
      }
    });

    // Create and attach new node
    current.next = { value: values[i] };
    current = current.next;
    traversed.push(values[i]);

    steps.push({
      list: copyLinkedList(head),
      description: `Appended node with value ${values[i]}`,
      highlightedNodes: {
        new: values[i],
        traversed: traversed.slice(0, -1)
      }
    });
  }

  return steps;
};

export const searchLinkedList = (head: LinkedListNode | null, target: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!head) {
    steps.push({
      list: null,
      description: "List is empty",
      highlightedNodes: { traversed: [] }
    });
    return steps;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Starting search for value ${target}`,
    highlightedNodes: { traversed: [] }
  });

  let current = head;
  const traversed: number[] = [];

  while (current) {
    steps.push({
      list: copyLinkedList(head),
      description: `Examining node with value ${current.value}`,
      highlightedNodes: {
        current: current.value,
        traversed
      }
    });

    if (current.value === target) {
      steps.push({
        list: copyLinkedList(head),
        description: `Found target value ${target}`,
        highlightedNodes: {
          target: current.value,
          traversed
        }
      });
      return steps;
    }

    traversed.push(current.value);
    current = current.next!;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Value ${target} not found`,
    highlightedNodes: { traversed }
  });

  return steps;
};

export const insertNode = (
  head: LinkedListNode | null,
  after: number,
  newValue: number
): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!head) {
    steps.push({
      list: null,
      description: "List is empty",
      highlightedNodes: { traversed: [] }
    });
    return steps;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Starting to insert ${newValue} after ${after}`,
    highlightedNodes: { traversed: [] }
  });

  let current = head;
  const traversed: number[] = [];

  while (current) {
    steps.push({
      list: copyLinkedList(head),
      description: `Examining node with value ${current.value}`,
      highlightedNodes: {
        current: current.value,
        traversed
      }
    });

    if (current.value === after) {
      // Create new node
      const newNode: LinkedListNode = {
        value: newValue,
        next: current.next
      };
      
      // Show new node creation
      steps.push({
        list: copyLinkedList(head),
        description: `Creating new node with value ${newValue}`,
        highlightedNodes: {
          current: current.value,
          new: newValue,
          traversed
        }
      });

      // Connect new node
      current.next = newNode;
      
      steps.push({
        list: copyLinkedList(head),
        description: `Inserted ${newValue} after ${after}`,
        highlightedNodes: {
          new: newValue,
          traversed: [...traversed, current.value]
        }
      });
      return steps;
    }

    traversed.push(current.value);
    current = current.next!;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Node with value ${after} not found`,
    highlightedNodes: { traversed }
  });

  return steps;
};

export const deleteNode = (head: LinkedListNode | null, valueToDelete: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!head) {
    steps.push({
      list: null,
      description: "List is empty",
      highlightedNodes: { traversed: [] }
    });
    return steps;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Starting to delete node with value ${valueToDelete}`,
    highlightedNodes: { traversed: [] }
  });

  // Special case: deleting head
  if (head.value === valueToDelete) {
    steps.push({
      list: copyLinkedList(head),
      description: `Found node to delete at head`,
      highlightedNodes: {
        deleted: head.value,
        traversed: []
      }
    });

    const newHead = head.next;
    steps.push({
      list: copyLinkedList(newHead ?? null),
      description: newHead 
        ? `Deleted head node, new head is ${newHead.value}`
        : "Deleted head node, list is now empty",
      highlightedNodes: { traversed: [] }
    });
    return steps;
  }

  let current = head;
  const traversed: number[] = [];

  while (current.next) {
    steps.push({
      list: copyLinkedList(head),
      description: `Examining node with value ${current.value}`,
      highlightedNodes: {
        current: current.value,
        traversed
      }
    });

    if (current.next.value === valueToDelete) {
      steps.push({
        list: copyLinkedList(head),
        description: `Found node to delete: ${valueToDelete}`,
        highlightedNodes: {
          current: current.value,
          deleted: valueToDelete,
          traversed
        }
      });

      current.next = current.next.next;
      steps.push({
        list: copyLinkedList(head),
        description: `Deleted node with value ${valueToDelete}`,
        highlightedNodes: {
          traversed: [...traversed, current.value]
        }
      });
      return steps;
    }

    traversed.push(current.value);
    current = current.next;
  }

  steps.push({
    list: copyLinkedList(head),
    description: `Node with value ${valueToDelete} not found`,
    highlightedNodes: { traversed }
  });

  return steps;
};