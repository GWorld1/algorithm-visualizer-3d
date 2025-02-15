import { LinkedListNode } from "@/types/LinkedListNode";

type LinkedListStep = {
  list: LinkedListNode | null;
  description: string;
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

  const head: LinkedListNode = { value: values[0] };
  steps.push({ list: copyLinkedList(head), description: `Create head node with value ${values[0]}` });

  let current = head;
  for (let i = 1; i < values.length; i++) {
    current.next = { value: values[i] };
    current = current.next;
    steps.push({ list: copyLinkedList(head), description: `Append node with value ${values[i]}` });
  }

  return steps;
};

// Similar modifications for search, insert, delete...
// Example for insertNode:
export const insertNode = (
  head: LinkedListNode | null,
  after: number,
  newValue: number
): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!head) return steps;

  let current = head;
  steps.push({ list: copyLinkedList(head), description: `Start searching for insertion point after ${after}` });

  while (current) {
    if (current.value === after) {
      const newNode: LinkedListNode = { value: newValue, next: current.next };
      current.next = newNode;
      steps.push({ list: copyLinkedList(head), description: `Inserted ${newValue} after ${after}` });
      return steps;
    }
    steps.push({ list: copyLinkedList(head), description: `Traversing to next node` });
    current = current.next!;
  }

  return steps;
};

// Function to search for a node with a specific value
export const searchLinkedList = (head: LinkedListNode | null, target: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  let current = head;
  steps.push({ list: copyLinkedList(head), description: `Searching for value ${target}` });
  while (current) {
    if (current.value === target) {
      steps.push({ list: copyLinkedList(head), description: `Value ${target} found` });
      return steps;
    }
    steps.push({ list: copyLinkedList(head), description: `Traversing to next node` });
    current = current.next!;
  }
  steps.push({ list: copyLinkedList(head), description: `Value ${target} not found` });
  return steps;
};




// Function to delete a node with a specific value
export const deleteNode = (head: LinkedListNode | null, valueToDelete: number): LinkedListStep[] => {
  const steps: LinkedListStep[] = [];
  if (!head) {
    steps.push({ list: copyLinkedList(head), description: `List is empty` });
    return steps;
  }

  if (head.value === valueToDelete) {
    steps.push({ list: copyLinkedList(head), description: `Deleting head node with value ${valueToDelete}` });
    if (head.next) {
      steps.push({ list: copyLinkedList(head.next), description: `New head is ${head.next.value}` });
    } else {
      steps.push({ list: null, description: `List is now empty` });
    }
    return steps; // Deleting the head node
  }

  let current = head;
  steps.push({ list: copyLinkedList(head), description: `Searching for node to delete with value ${valueToDelete}` });
  while (current.next) {
    if (current.next.value === valueToDelete) {
      steps.push({ list: copyLinkedList(head), description: `Found node to delete with value ${valueToDelete}` });
      current.next = current.next.next;
      steps.push({ list: copyLinkedList(head), description: `Deleted node with value ${valueToDelete}` });
      return steps;
    }
    steps.push({ list: copyLinkedList(head), description: `Traversing to next node` });
    current = current.next;
  }
  steps.push({ list: copyLinkedList(head), description: `Node to delete with value ${valueToDelete} not found` });
  return steps; // Node to delete not found
};