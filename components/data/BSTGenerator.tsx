"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { generateRandomBST } from '@/lib/nodeManipulation';
import { TreePine, Loader2 } from 'lucide-react';

const BSTGenerator = () => {
  const [treeSize, setTreeSize] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { updateTree } = useAlgorithmStore();

  const handleGenerateBST = async () => {
    const size = parseInt(treeSize);
    
    // Validation
    if (isNaN(size) || size <= 0) {
      alert("Please enter a valid tree size (positive number)");
      return;
    }
    
    if (size > 50) {
      alert("Tree size should be 50 or less for optimal visualization");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newTree = generateRandomBST(size);
      if (newTree) {
        updateTree(newTree);
        useAlgorithmStore.setState(state => ({
          ...state,
          currentStep: 0,
          steps: [newTree]
        }));
        setTreeSize(''); // Clear input after successful generation
      } else {
        alert("Failed to generate BST. Please try again.");
      }
    } catch (error) {
      console.error('Error generating BST:', error);
      alert("An error occurred while generating the BST.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isGenerating) {
      handleGenerateBST();
    }
  };

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm flex items-center gap-2 text-gray-100">
          <TreePine className="w-4 h-4" />
          Binary Search Tree Generator
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0 space-y-4">
        {/* Tree Size Input */}
        <div>
          <label className="text-xs text-gray-300 mb-2 block">
            Number of Nodes
          </label>
          <Input
            type="number"
            placeholder="Enter tree size (1-50)"
            value={treeSize}
            onChange={(e) => setTreeSize(e.target.value)}
            onKeyPress={handleKeyPress}
            min="1"
            max="50"
            className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-blue-500"
            disabled={isGenerating}
          />
          <div className="text-xs text-gray-400 mt-1">
            Recommended: 5-20 nodes for best visualization
          </div>
        </div>

        {/* Generate Button */}
        <Button
          onClick={handleGenerateBST}
          disabled={isGenerating || !treeSize.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-600 disabled:text-gray-400"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating BST...
            </>
          ) : (
            <>
              <TreePine className="w-4 h-4 mr-2" />
              Generate Random BST
            </>
          )}
        </Button>

        {/* Info Section */}
        <div className="text-xs text-gray-400 space-y-1">
          <div className="font-medium text-gray-300">BST Properties:</div>
          <ul className="list-disc list-inside space-y-0.5 ml-2">
            <li>Left subtree values &lt; node value</li>
            <li>Right subtree values &gt; node value</li>
            <li>No duplicate values allowed</li>
            <li>Random values ensure balanced structure</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default BSTGenerator;
