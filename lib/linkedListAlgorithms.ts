// lib/linkedListAlgorithms.ts
import { LinkedListNode } from "@/types/LinkedListNode";

// Function to create a linked list from an array of values
export const createLinkedList = (values: number[]): LinkedListNode | null => {
  if (!values.length) return null;

  const head: LinkedListNode = { value: values[0] };
  let current = head;

  for (let i = 1; i < values.length; i++) {
    current.next = { value: values[i] };
    current = current.next;
  }

  return head;
};

// Function to search for a node with a specific value
export const searchLinkedList = (head: LinkedListNode | null, target: number): LinkedListNode | null => {
  let current = head;
  while (current) {
    if (current.value === target) {
      return current;
    }
    current = current.next;
  }
  return null;
};

// Function to insert a new node after a given node
export const insertNode = (head: LinkedListNode | null, after: number, newValue: number): LinkedListNode | null => {
  if (!head) return null;

  let current = head;
  while (current) {
    if (current.value === after) {
      const newNode: LinkedListNode = { value: newValue, next: current.next };
      current.next = newNode;
      return head;
    }
    current = current.next;
  }
  return head; // Node to insert after not found
};

// Function to delete a node with a specific value
export const deleteNode = (head: LinkedListNode | null, valueToDelete: number): LinkedListNode | null => {
  if (!head) return null;

  if (head.value === valueToDelete) {
    return head.next; // Deleting the head node
  }

  let current = head;
  while (current.next) {
    if (current.next.value === valueToDelete) {
      current.next = current.next.next;
      return head;
    }
    current = current.next;
  }
  return head; // Node to delete not found
};