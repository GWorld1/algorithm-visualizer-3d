"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useUIStore } from '@/store/useUIStore';
import DataGenerators from '@/components/data/DataGenerators';
import BSTGenerator from '@/components/data/BSTGenerator';
import ArrayGenerator from '@/components/data/ArrayGenerator';
import LinkedListGenerator from '@/components/data/LinkedListGenerator';
import WeightedGraphGenerator from '@/components/data/WeightedGraphGenerator';
import { Settings, Database, TreePine, Link, Network, Code, Maximize2 } from 'lucide-react';
import { DataStructureType } from '@/types/DataStructure';
import { AlgorithmType } from '@/types/AlgorithmType';
import VisualScriptingEditor from '@/components/visual-scripting/VisualScriptingEditor';

const DataCustomizationPanel = () => {
  const { dataStructure, setDataStructure, setAlgorithmType } = useAlgorithmStore();
  const { setVisualScriptingMode } = useUIStore();
  const [activeTab, setActiveTab] = useState<'generator' | 'scripting'>('generator');

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

  // Handle Visual Scripting tab click
  const handleVisualScriptingTabClick = () => {
    setActiveTab('scripting');
    // Optionally auto-enter split-screen mode
    // setVisualScriptingMode(true);
  };

  // Handle generator tab click - exit split-screen mode if active
  const handleGeneratorTabClick = () => {
    setActiveTab('generator');
    setVisualScriptingMode(false);
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
          {/* Tab Navigation */}
          <div className="mb-4 flex-shrink-0">
            <div className="flex gap-1 p-1 bg-gray-800 rounded-lg">
              <Button
                variant={activeTab === 'generator' ? 'default' : 'ghost'}
                size="sm"
                onClick={handleGeneratorTabClick}
                className={`flex-1 text-xs ${
                  activeTab === 'generator'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Database className="w-3 h-3 mr-1" />
                Data Generator
              </Button>
              <Button
                variant={activeTab === 'scripting' ? 'default' : 'ghost'}
                size="sm"
                onClick={handleVisualScriptingTabClick}
                className={`flex-1 text-xs ${
                  activeTab === 'scripting'
                    ? 'bg-blue-600 hover:bg-blue-700 text-white'
                    : 'text-gray-300 hover:text-white hover:bg-gray-700'
                }`}
              >
                <Code className="w-3 h-3 mr-1" />
                Visual Scripting
              </Button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'generator' ? (
            <>
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
            </>
          ) : (
            /* Visual Scripting Tab */
            <div className="flex-1 min-h-0 flex flex-col">
              {/* Split-screen mode button */}
              <div className="flex-shrink-0 mb-3">
                <Button
                  onClick={() => setVisualScriptingMode(true)}
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white text-sm font-medium shadow-lg transition-all duration-200 transform hover:scale-[1.02]"
                  size="sm"
                >
                  <Maximize2 className="w-4 h-4 mr-2" />
                  Open in Split-Screen Mode
                </Button>
                <p className="text-xs text-gray-400 mt-1 text-center">
                  Work with Visual Scripting and 3D Viewport side-by-side
                </p>
              </div>

              {/* Visual Scripting Editor */}
              <div className="flex-1 min-h-0">
                <VisualScriptingEditor />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default DataCustomizationPanel;
