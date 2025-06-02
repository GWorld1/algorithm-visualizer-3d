"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { useLinkedListStore } from '@/store/useLinkedListStore';
import { createLinkedList } from '@/lib/linkedListAlgorithms';
import { Shuffle, Plus, Loader2, Link } from 'lucide-react';

const LinkedListGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [customValues, setCustomValues] = useState<string>('1,2,3,4,5');
  const [listSize, setListSize] = useState<number>(5);
  const [minValue, setMinValue] = useState<number>(1);
  const [maxValue, setMaxValue] = useState<number>(100);
  
  const { linkedList, setLinkedList, setSteps, setCurrentStep, setIsPlaying } = useLinkedListStore();

  const generateRandomList = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Generate random values
      const values = Array.from({ length: listSize }, () => 
        Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
      );
      
      // Create the linked list with animation steps
      const steps = createLinkedList(values);
      
      // Update the store
      setSteps(steps);
      setCurrentStep(0);
      setIsPlaying(false);
      
      // Set the final linked list
      if (steps.length > 0) {
        setLinkedList(steps[steps.length - 1].list);
      }
      
    } catch (error) {
      console.error('Error generating linked list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const createCustomList = async () => {
    setIsGenerating(true);
    
    try {
      // Parse custom values
      const values = customValues
        .split(',')
        .map(v => parseInt(v.trim()))
        .filter(v => !isNaN(v));
      
      if (values.length === 0) {
        alert('Please enter valid numbers separated by commas');
        return;
      }
      
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create the linked list with animation steps
      const steps = createLinkedList(values);
      
      // Update the store
      setSteps(steps);
      setCurrentStep(0);
      setIsPlaying(false);
      
      // Set the final linked list
      if (steps.length > 0) {
        setLinkedList(steps[steps.length - 1].list);
      }
      
    } catch (error) {
      console.error('Error creating custom linked list:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const clearList = () => {
    setLinkedList(null);
    setSteps([]);
    setCurrentStep(0);
    setIsPlaying(false);
  };

  // Convert linked list to array for display
  const getListValues = () => {
    if (!linkedList) return [];
    const values = [];
    let current = linkedList;
    while (current) {
      values.push(current.value);
      current = current.next || null;
    }
    return values;
  };

  const listValues = getListValues();

  return (
    <div className="space-y-4 pr-2 pb-4">
      {/* Random Generation */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-100 flex items-center gap-2">
            <Shuffle className="w-4 h-4" />
            Random Generation
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {/* List Size */}
          <div>
            <label className="text-xs text-gray-300 mb-1 block">List Size</label>
            <Slider
              value={[listSize]}
              onValueChange={(value) => setListSize(value[0])}
              max={20}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>1</span>
              <span className="font-medium">{listSize} nodes</span>
              <span>20</span>
            </div>
          </div>

          {/* Value Range */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs text-gray-300 mb-1 block">Min Value</label>
              <Input
                type="number"
                value={minValue}
                onChange={(e) => setMinValue(parseInt(e.target.value) || 1)}
                className="bg-gray-700 border-gray-600 text-gray-100 text-xs"
              />
            </div>
            <div>
              <label className="text-xs text-gray-300 mb-1 block">Max Value</label>
              <Input
                type="number"
                value={maxValue}
                onChange={(e) => setMaxValue(parseInt(e.target.value) || 100)}
                className="bg-gray-700 border-gray-600 text-gray-100 text-xs"
              />
            </div>
          </div>

          <Button
            onClick={generateRandomList}
            disabled={isGenerating}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Shuffle className="w-3 h-3 mr-2" />
                Generate Random
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Custom Values */}
      <Card className="bg-gray-800 border-gray-700">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-gray-100 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Custom Values
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <label className="text-xs text-gray-300 mb-1 block">
              Values (comma-separated)
            </label>
            <Input
              value={customValues}
              onChange={(e) => setCustomValues(e.target.value)}
              placeholder="1,2,3,4,5"
              className="bg-gray-700 border-gray-600 text-gray-100 text-xs"
            />
          </div>

          <Button
            onClick={createCustomList}
            disabled={isGenerating}
            className="w-full bg-green-600 hover:bg-green-700 text-white"
            size="sm"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-3 h-3 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Plus className="w-3 h-3 mr-2" />
                Create Custom
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Current List Display */}
      {listValues.length > 0 && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-gray-100 flex items-center gap-2">
              <Link className="w-4 h-4" />
              Current List
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-300 max-h-20 overflow-y-auto mb-2">
              {listValues.join(' → ')}
            </div>
            <div className="text-xs text-gray-400 mb-2">
              {listValues.length} nodes
            </div>
            <Button
              onClick={clearList}
              variant="outline"
              size="sm"
              className="w-full bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
            >
              Clear List
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default LinkedListGenerator;
