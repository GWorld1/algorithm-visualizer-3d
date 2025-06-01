"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/useUIStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import DataGenerators from '@/components/data/DataGenerators';
import ManualDataInput from '@/components/data/ManualDataInput';
import { Settings, Edit3, Database, TreePine, Link, Network } from 'lucide-react';
import { DataStructureType } from '@/types/DataStructure';
import { AlgorithmType } from '@/types/AlgorithmType';

const DataCustomizationPanel = () => {
  const { activeDataTab, setActiveDataTab } = useUIStore();
  const { dataStructure, setDataStructure, setAlgorithmType } = useAlgorithmStore();

  // Algorithm options for each data structure
  const algorithmOptions = {
    binaryTree: [
      { value: 'create', label: 'Create BST' },
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
    <div className="h-full bg-white/90 backdrop-blur-sm flex flex-col min-h-0">
      <Card className="h-full border-0 rounded-none bg-transparent flex flex-col min-h-0">
        <CardHeader className="pb-3 flex-shrink-0">
          <CardTitle className="text-base lg:text-lg flex items-center gap-2">
            <Settings className="w-4 h-4 lg:w-5 lg:h-5" />
            Data Customization
          </CardTitle>
        </CardHeader>

        <CardContent className="px-4 pb-4 flex-1 min-h-0 overflow-hidden">
          {/* Data Structure Selection */}
          <div className="mb-4 flex-shrink-0">
            <h3 className="text-sm font-semibold mb-2">Data Structure</h3>
            <div className="grid grid-cols-2 gap-2">
              {dataStructureOptions.map((option) => {
                const Icon = option.icon;
                return (
                  <Button
                    key={option.value}
                    variant={dataStructure === option.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleDataStructureChange(option.value)}
                    className="flex flex-col items-center gap-1 h-auto py-2 text-xs"
                  >
                    <Icon className="w-4 h-4" />
                    <span className="text-xs">{option.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          <Tabs
            value={activeDataTab}
            onValueChange={(value) => setActiveDataTab(value as 'generator' | 'manual')}
            className="flex-1 flex flex-col min-h-0"
          >
            <TabsList className="grid w-full grid-cols-2 mb-4 flex-shrink-0">
              <TabsTrigger value="generator" className="text-xs">
                <Settings className="w-3 h-3 mr-1" />
                Generator
              </TabsTrigger>
              <TabsTrigger value="manual" className="text-xs">
                <Edit3 className="w-3 h-3 mr-1" />
                Manual
              </TabsTrigger>
            </TabsList>

            <TabsContent value="generator" className="flex-1 min-h-0 mt-0 overflow-y-auto">
              <DataGenerators />
            </TabsContent>

            <TabsContent value="manual" className="flex-1 min-h-0 mt-0 overflow-y-auto">
              <ManualDataInput />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCustomizationPanel;
