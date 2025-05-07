import React from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogTrigger
} from "@/components/ui/dialog";
import { 
  Accordion, 
  AccordionContent, 
  AccordionItem, 
  AccordionTrigger 
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { 
  Info, 
  Play, 
  Clock, 
  ArrowUpDown, 
  Shuffle 
} from "lucide-react";

interface AlgorithmExplanationProps {
  algorithmName: string;
  complexity: {
    worstCase: string;
    averageCase: string;
    bestCase: string;
  };
  steps: string[];
  visualizationTips: string[];
  colorLegend: Array<{color: string, meaning: string}>;
}

const AlgorithmExplanation: React.FC<AlgorithmExplanationProps> = ({
  algorithmName,
  complexity,
  steps,
  visualizationTips,
  colorLegend
}) => {
 // const [activeSection, setActiveSection] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 mx-2">
          <Info className="w-4 h-4" /> Understand {algorithmName}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{algorithmName} Explained</DialogTitle>
          <DialogDescription>
            Comprehensive guide to understanding the {algorithmName} algorithm
          </DialogDescription>
        </DialogHeader>

        {/* Algorithm Overview */}
        <section className="bg-violet-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Play className="w-5 h-5 text-violet-600" /> Algorithm Overview
          </h2>
          <Accordion type="single" collapsible>
            <AccordionItem value="complexity">
              <AccordionTrigger className="hover:no-underline">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Time Complexity
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <h3 className="font-semibold">Worst Case</h3>
                    <p>{complexity.worstCase}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Average Case</h3>
                    <p>{complexity.averageCase}</p>
                  </div>
                  <div>
                    <h3 className="font-semibold">Best Case</h3>
                    <p>{complexity.bestCase}</p>
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>

        {/* Color Legend */}
        <section className="bg-gray-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <ArrowUpDown className="w-5 h-5 text-gray-600" /> Visualization Color Guide
          </h2>
          <div className="grid grid-cols-3 gap-2">
            {colorLegend.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center gap-2 p-2 rounded"
                style={{backgroundColor: item.color + '20'}}
              >
                <div 
                  className="w-4 h-4 rounded" 
                  style={{backgroundColor: item.color}}
                />
                <span>{item.meaning}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sorting Steps */}
        <section className="bg-green-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <Shuffle className="w-5 h-5 text-green-600" /> Sorting Process
          </h2>
          <ol className="space-y-2">
            {steps.map((step, index) => (
              <li 
                key={index} 
                className="bg-white p-3 rounded-lg shadow-sm border"
              >
                <span className="font-semibold mr-2">Step {index + 1}:</span>
                {step}
              </li>
            ))}
          </ol>
        </section>

        {/* Visualization Tips */}
        <section className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-bold mb-3">Visualization Tips</h2>
          <ul className="list-disc list-inside space-y-2">
            {visualizationTips.map((tip, index) => (
              <li key={index} className="text-blue-800">{tip}</li>
            ))}
          </ul>
        </section>
      </DialogContent>
    </Dialog>
  );
};

// Quick Sort Specific Configuration
export const QuickSortExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Quick Sort"
    complexity={{
      worstCase: "O(n²)",
      averageCase: "O(n log n)",
      bestCase: "O(n log n)"
    }}
    steps={[
      "Select the last element as the pivot",
      "Partition the array around the pivot",
      "Move elements smaller than pivot to left",
      "Move elements larger than pivot to right",
      "Recursively apply to sub-arrays",
      "Combine sorted sub-arrays"
    ]}
    visualizationTips={[
      "Watch how the pivot (red) moves elements",
      "Observe green regions expanding as elements get sorted",
      "Notice recursive sorting of smaller regions",
      "Pay attention to element comparisons (yellow)",
      "Track how elements swap positions"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Sorted Elements"},
      {color: "#fbbf24", meaning: "Comparing Elements"},
      {color: "#ef4444", meaning: "Pivot or Swapping"},
      {color: "steelblue", meaning: "Unsorted Elements"}
    ]}
  />
);

export const BubbleSortExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Bubble Sort"
    complexity={{
      worstCase: "O(n²)",
      averageCase: "O(n²)",
      bestCase: "O(n)"
    }}
    steps={[
      "Start with the first two elements of the array",
      "Compare adjacent elements",
      "If they are in the wrong order, swap them",
      "Move to the next pair of adjacent elements",
      "Repeat until the end of the array is reached",
      "After each pass, the largest unsorted element 'bubbles up' to its correct position",
      "Repeat the process for the entire array, reducing the unsorted region each time"
    ]}
    visualizationTips={[
      "Watch how larger elements 'bubble up' to the end of the array",
      "Notice how the green sorted region grows from right to left",
      "Observe the yellow highlighting during element comparisons",
      "Track how elements swap positions when out of order",
      "See how the algorithm makes multiple passes to sort the entire array"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Sorted Elements"},
      {color: "#fbbf24", meaning: "Comparing Elements"},
      {color: "#ef4444", meaning: "Swapping Elements"},
      {color: "steelblue", meaning: "Unsorted Elements"}
    ]}
  />
);

export const DijkstraExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Dijkstra's Algorithm"
    complexity={{
      worstCase: "O((V + E) log V)",
      averageCase: "O((V + E) log V)",
      bestCase: "O((V + E) log V)"
    }}
    steps={[
      "Initialize distances: Set source node distance to 0 and all other nodes to infinity",
      "Create a set of unvisited nodes containing all nodes in the graph",
      "For the current node (starting with source), consider all unvisited neighbors",
      "Calculate tentative distances through the current node to each neighbor",
      "If new calculated distance is less than previously recorded, update the distance",
      "Mark current node as visited and remove from unvisited set",
      "Select unvisited node with smallest tentative distance as new current node",
      "Repeat steps 3-7 until all nodes are visited or destination is reached"
    ]}
    visualizationTips={[
      "Red nodes indicate the current node being processed",
      "Watch how distances update as shorter paths are found",
      "Notice how the algorithm always expands to the closest unvisited node",
      "Edge weights show the cost of moving between nodes",
      "The distance label (d:) shows the current shortest path distance to each node",
      "The algorithm guarantees the shortest path when it visits a node"
    ]}
    colorLegend={[
      {color: "#ef4444", meaning: "Current Node"},
      {color: "#049ef4", meaning: "Unvisited Node"},
      {color: "#22c55e", meaning: "Visited Node"},
      {color: "#fbbf24", meaning: "Being Evaluated"},
      {color: "#808080", meaning: "Edge Weight"}
    ]}
  />
);

export const BFSExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Breadth-First Search"
    complexity={{
      worstCase: "O(V + E)",
      averageCase: "O(V + E)",
      bestCase: "O(V + E)"
    }}
    steps={[
      "Start at the root node and add it to a queue",
      "Remove the first node from the queue and visit it",
      "Add all unvisited children of the current node to the queue from left to right",
      "Mark the current node as visited",
      "Repeat steps 2-4 until the queue is empty",
      "The traversal is complete when all nodes have been visited"
    ]}
    visualizationTips={[
      "Notice how nodes are visited level by level",
      "Watch the queue grow and shrink as nodes are processed",
      "Observe how all nodes at the same depth are visited before moving deeper",
      "Pay attention to the left-to-right order of visiting siblings",
      "Track how the algorithm systematically explores the breadth of the tree before going deeper"
    ]}
    colorLegend={[
      {color: "#ef4444", meaning: "Current Node"},
      {color: "#049ef4", meaning: "Unvisited Node"},
      {color: "#22c55e", meaning: "Visited Node"},
      {color: "#fbbf24", meaning: "Nodes in Queue"},
      {color: "#808080", meaning: "Tree Edges"}
    ]}
  />
);

export const DFSExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Depth-First Search"
    complexity={{
      worstCase: "O(V + E)",
      averageCase: "O(V + E)",
      bestCase: "O(V + E)"
    }}
    steps={[
      "Start at the root node and push it onto a stack",
      "Pop a node from the stack and visit it",
      "Push all unvisited children of the current node onto the stack (right child first, then left)",
      "Mark the current node as visited",
      "Repeat steps 2-4 until the stack is empty",
      "The traversal is complete when all nodes have been visited"
    ]}
    visualizationTips={[
      "Observe how the algorithm explores as far as possible along each branch",
      "Watch the stack grow and shrink as nodes are processed",
      "Notice how the algorithm backtracks only when it reaches a leaf node",
      "Pay attention to the order of pushing children (right first for left-first traversal)",
      "Track the depth-first pattern as the algorithm explores deep into the tree before backtracking"
    ]}
    colorLegend={[
      {color: "#ef4444", meaning: "Current Node"},
      {color: "#049ef4", meaning: "Unvisited Node"},
      {color: "#22c55e", meaning: "Visited Node"},
      {color: "#fbbf24", meaning: "Nodes in Stack"},
      {color: "#808080", meaning: "Tree Edges"}
    ]}
  />
);

export const InsertionSortExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Insertion Sort"
    complexity={{
      worstCase: "O(n²)",
      averageCase: "O(n²)",
      bestCase: "O(n)"
    }}
    steps={[
      "Start from the second element, considering first element as sorted",
      "Take current element and store it as key",
      "Compare key with each element in sorted portion from right to left",
      "If element is greater than key, shift it one position ahead",
      "Place key in its correct position in sorted portion",
      "Repeat for all unsorted elements"
    ]}
    visualizationTips={[
      "Watch how the sorted portion grows from left to right",
      "Notice how elements shift to make space for insertion",
      "Observe the comparison process within sorted portion",
      "See how each element finds its correct position",
      "Pay attention to how fewer comparisons are needed for nearly sorted arrays"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Sorted Elements"},
      {color: "#fbbf24", meaning: "Comparing Elements"},
      {color: "#ef4444", meaning: "Element Being Inserted"},
      {color: "steelblue", meaning: "Unsorted Elements"}
    ]}
  />
);

export const SelectionSortExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Selection Sort"
    complexity={{
      worstCase: "O(n²)",
      averageCase: "O(n²)",
      bestCase: "O(n²)"
    }}
    steps={[
      "Start with the first unsorted element",
      "Find the minimum element in the remaining unsorted array",
      "Compare each element with the current minimum",
      "Update minimum if a smaller element is found",
      "Swap the found minimum with the first unsorted position",
      "Repeat until all elements are sorted"
    ]}
    visualizationTips={[
      "Watch how the algorithm finds the minimum element in each pass",
      "Notice the growing sorted region on the left side",
      "Observe how elements are compared against the current minimum",
      "Track how the minimum element 'bubbles' to its correct position",
      "See how the algorithm makes exactly one swap per pass"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Sorted Elements"},
      {color: "#fbbf24", meaning: "Comparing Elements"},
      {color: "#ef4444", meaning: "Current Minimum/Swapping"},
      {color: "steelblue", meaning: "Unsorted Elements"}
    ]}
  />
);


export const MergeSortExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Merge Sort"
    complexity={{
      worstCase: "O(n log n)",
      averageCase: "O(n log n)",
      bestCase: "O(n log n)"
    }}
    steps={[
      "Divide the array into two halves recursively until we have single elements",
      "Compare elements from both halves and merge them in sorted order",
      "Place smaller element first in the merged array",
      "Continue until all elements are merged",
      "Repeat the process up the recursion tree",
      "Finally merge all sorted subarrays into one sorted array"
    ]}
    visualizationTips={[
      "Watch how the array is divided into smaller subarrays",
      "Notice the comparing and merging of elements in sorted order",
      "Observe how smaller sorted arrays are combined into larger sorted arrays",
      "Pay attention to the divide-and-conquer strategy in action",
      "See how the sorted portions grow and combine"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Sorted Subarrays"},
      {color: "#fbbf24", meaning: "Comparing Elements"},
      {color: "#ef4444", meaning: "Merging Elements"},
      {color: "steelblue", meaning: "Unsorted Elements"}
    ]}
  />
);

// Add these exports at the end of the file

export const LinkedListInsertExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Linked List Insertion"
    complexity={{
      worstCase: "O(n)",
      averageCase: "O(n)",
      bestCase: "O(1)"
    }}
    steps={[
      "Start at the head of the linked list",
      "Traverse the list until finding the node after which to insert",
      "Create a new node with the given value",
      "Set the new node's next pointer to the current node's next",
      "Set the current node's next pointer to the new node"
    ]}
    visualizationTips={[
      "Watch how the algorithm traverses the list to find the insertion point",
      "Notice how the new node (green) is created and linked into the list",
      "Observe how the pointers are updated to maintain the list structure",
      "Pay attention to the special case when inserting at the head"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "New Node"},
      {color: "#fbbf24", meaning: "Current Node"},
      {color: "#ef4444", meaning: "Target Node"},
      {color: "steelblue", meaning: "Traversed Nodes"}
    ]}
  />
);

export const LinkedListDeleteExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Linked List Deletion"
    complexity={{
      worstCase: "O(n)",
      averageCase: "O(n)",
      bestCase: "O(1)"
    }}
    steps={[
      "Start at the head of the linked list",
      "If deleting the head, update the head pointer to the next node",
      "Otherwise, traverse the list until finding the node before the one to delete",
      "Update the previous node's next pointer to skip the node to be deleted",
      "The skipped node will be garbage collected"
    ]}
    visualizationTips={[
      "Watch how the algorithm traverses to find the node to delete",
      "Notice the red highlighting of the node to be deleted",
      "Observe how the pointers are updated to bypass the deleted node",
      "Pay attention to the special case when deleting the head node"
    ]}
    colorLegend={[
      {color: "#ef4444", meaning: "Node to Delete"},
      {color: "#fbbf24", meaning: "Current Node"},
      {color: "#22c55e", meaning: "Updated Pointer"},
      {color: "steelblue", meaning: "Traversed Nodes"}
    ]}
  />
);

export const LinkedListSearchExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Linked List Search"
    complexity={{
      worstCase: "O(n)",
      averageCase: "O(n)",
      bestCase: "O(1)"
    }}
    steps={[
      "Start at the head of the linked list",
      "Compare the current node's value with the target value",
      "If they match, the search is successful",
      "If not, move to the next node and repeat",
      "If the end of the list is reached without finding the value, the search is unsuccessful"
    ]}
    visualizationTips={[
      "Watch how the algorithm traverses the list node by node",
      "Notice the yellow highlighting of the current node being examined",
      "Observe how the target node is highlighted in green when found",
      "Pay attention to the traversal path through the list"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "Target Found"},
      {color: "#fbbf24", meaning: "Current Node"},
      {color: "steelblue", meaning: "Traversed Nodes"}
    ]}
  />
);

export const LinkedListCreateExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Linked List Creation"
    complexity={{
      worstCase: "O(n)",
      averageCase: "O(n)",
      bestCase: "O(n)"
    }}
    steps={[
      "Create the head node with the first value",
      "For each remaining value, create a new node",
      "Set the current node's next pointer to the new node",
      "Move the current pointer to the new node",
      "Repeat until all values are added to the list"
    ]}
    visualizationTips={[
      "Watch how the list grows as each new node is added",
      "Notice the green highlighting of newly created nodes",
      "Observe how the current pointer moves through the list",
      "Pay attention to how the list structure forms step by step"
    ]}
    colorLegend={[
      {color: "#22c55e", meaning: "New Node"},
      {color: "#fbbf24", meaning: "Current Node"},
      {color: "steelblue", meaning: "Existing Nodes"}
    ]}
  />
);

export const CreateBSTExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="Binary Search Tree Creation"
    complexity={{
      worstCase: "O(n log n)",
      averageCase: "O(n log n)",
      bestCase: "O(n log n)"
    }}
    steps={[
      "Specify the desired size of the binary search tree",
      "Generate random unique values for each node",
      "Insert values maintaining BST property: left subtree values < node value < right subtree values",
      "Layout tree for visualization"
    ]}
    visualizationTips={[
      "The tree automatically maintains BST property during creation",
      "Left children are always smaller than their parent",
      "Right children are always larger than their parent",
      "Notice how the tree remains balanced due to random value distribution"
    ]}
    colorLegend={[
      {color: "#049ef4", meaning: "Tree Nodes"},
      {color: "#808080", meaning: "Tree Edges"}
    ]}
  />
);

export const BSTInsertExplanation = () => (
  <AlgorithmExplanation 
    algorithmName="BST Insertion"
    complexity={{
      worstCase: "O(h)",
      averageCase: "O(log n)",
      bestCase: "O(1)"
    }}
    steps={[
      "Start at the root of the tree",
      "Compare the value to be inserted with the current node",
      "If the value is less than the current node, go to the left subtree",
      "If the value is greater than the current node, go to the right subtree",
      "If we reach a null pointer (empty spot), insert the new node there",
      "If the value already exists in the tree, do nothing (BSTs don't allow duplicates)"
    ]}
    visualizationTips={[
      "Watch how the algorithm traverses the tree to find the insertion point",
      "Notice how the BST property is maintained (smaller values to the left, larger to the right)",
      "Observe how the new node (highlighted in red) is inserted at the correct position",
      "Pay attention to the path taken to find the insertion point"
    ]}
    colorLegend={[
      {color: "#ef4444", meaning: "Current Node Being Examined"},
      {color: "#22c55e", meaning: "Newly Inserted Node"},
      {color: "#049ef4", meaning: "Regular Tree Nodes"},
      {color: "gray", meaning: "Tree Edges"}
    ]}
  />
);

export default AlgorithmExplanation;