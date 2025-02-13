// lib/linkedListLayout.ts
import { LinkedListNode } from "@/types/LinkedListNode";

export const calculateLinkedListLayout = (
  head: LinkedListNode | null,
  spacing: number = 3
): LinkedListNode | null => {
  let current = head;
  let x = 0;
  while (current) {
    current.x = x;
    current.y = 0; // Keep nodes on the same horizontal level
    x += spacing;
    current = current.next;
  }
  return head;
};