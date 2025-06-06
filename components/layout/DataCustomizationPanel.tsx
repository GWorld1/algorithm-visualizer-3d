"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import DataGenerators from '@/components/data/DataGenerators';
import BSTGenerator from '@/components/data/BSTGenerator';
import ArrayGenerator from '@/components/data/ArrayGenerator';
import LinkedListGenerator from '@/components/data/LinkedListGenerator';
import WeightedGraphGenerator from '@/components/data/WeightedGraphGenerator';
import { Settings, Database, TreePine, Link, Network } from 'lucide-react';
import { DataStructureType } from '@/types/DataStructure';
import { AlgorithmType } from '@/types/AlgorithmType';

const DataCustomizationPanel = () => {
  const { dataStructure, setDataStructure, setAlgorithmType } = useAlgorithmStore();

  // Algorithm options for each data structure
  const algorithmOptions = {
    binaryTree: [
      { value: 'bfs', label: 'BFS' },
      { value: 'dfs', label: 'DFS' },
      { value: 'bstInsert', label: 'Insert Node' },
      { value: 'bstSearch', label: 'Search Node' }
    ],
    weightedGraph: [
      { value: 'dijkstra', label: 'Dijkstra' }
    ],
    array: [
      { value: 'bubbleSort', label: 'Bubble Sort' },
      { value: 'quickSort', label: 'Quick Sort' },
      { value: 'insertionSort', label: 'Insertion Sort' },
      { value: 'selectionSort', label: 'Selection Sort' },
      { value: 'mergeSort', label: 'Merge Sort' }
    ],
    linkedList: [
      { value: 'createLinkedList', label: 'Create Linked List' },
      { value: 'searchLinkedList', label: 'Search Node' },
      { value: 'insertNode', label: 'Insert Node' },
      { value: 'deleteNode', label: 'Delete Node' }
    ]
  };

  // Data structure options
  const dataStructureOptions = [
    { value: 'array', label: 'Array', icon: Database },
    { value: 'binaryTree', label: 'Binary Tree', icon: TreePine },
    { value: 'linkedList', label: 'Linked List', icon: Link },
    { value: 'weightedGraph', label: 'Weighted Graph', icon: Network },
  ];

  // Handle data structure change
  const handleDataStructureChange = (value: string) => {
    setDataStructure(value as DataStructureType);
    // Set first algorithm of the selected data structure as default
    const firstAlgorithm = algorithmOptions[value as keyof typeof algorithmOptions][0].value;
    setAlgorithmType(firstAlgorithm as AlgorithmType);
  };

  return (
    <div className="h-full bg-gray-900/95 backdrop-blur-sm flex flex-col min-h-0">
      <Card className="h-full border-0 rounded-none bg-transparent flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base lg:text-lg flex items-center gap-2 text-white">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            Data Customization
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 min-h-0 flex flex-col">
          {/* Data Structure Selection */}
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-sm font-semibold mb-2 text-gray-100">Data Structure</h3>
            <div className="grid grid-cols-2 gap-2">
              {dataStructureOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={dataStructure === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDataStructureChange(option.value)}
                    className={`flex flex-col items-center gap-1 h-auto py-2 text-xs ${
                      dataStructure === option.value
                        ? 'bg-blue-600 text-white border-blue-600'
                        : 'bg-gray-800 text-gray-300 border-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Data Generation Section */}
          <div className="flex-1 min-h-0 overflow-y-auto overflow-x-hidden">
            {dataStructure === 'binaryTree' ? (
              <BSTGenerator />
            ) : dataStructure === 'array' ? (
              <ArrayGenerator />
            ) : dataStructure === 'linkedList' ? (
              <LinkedListGenerator />
            ) : dataStructure === 'weightedGraph' ? (
              <WeightedGraphGenerator />
            ) : (
              <DataGenerators />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCustomizationPanel;
