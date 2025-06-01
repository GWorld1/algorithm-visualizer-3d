"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { useUIStore } from '@/store/useUIStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useArrayStore } from '@/store/useArrayStore';
import { Shuffle, Loader2 } from 'lucide-react';

const DataGenerators = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const { generatorSettings, updateGeneratorSettings } = useUIStore();
  const { dataStructure } = useAlgorithmStore();
  const { elements: currentElements } = useArrayStore();

  const generateRandomData = async () => {
    setIsGenerating(true);
    
    try {
      // Simulate generation delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const { size, minValue, maxValue, distribution } = generatorSettings;
      let newData: number[] = [];

      switch (distribution) {
        case 'uniform':
          newData = Array.from({ length: size }, () => 
            Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue
          );
          break;
        
        case 'normal':
          // Simple normal distribution approximation using Box-Muller transform
          newData = Array.from({ length: size }, () => {
            const u1 = Math.random();
            const u2 = Math.random();
            const z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
            const value = Math.round(z0 * 15 + (maxValue + minValue) / 2);
            return Math.max(minValue, Math.min(maxValue, value));
          });
          break;
        
        case 'sorted':
          newData = Array.from({ length: size }, (_, i) => 
            Math.floor(minValue + (i / (size - 1)) * (maxValue - minValue))
          );
          break;
        
        case 'reverse':
          newData = Array.from({ length: size }, (_, i) => 
            Math.floor(maxValue - (i / (size - 1)) * (maxValue - minValue))
          );
          break;
      }

      // Apply the generated data based on data structure
      if (dataStructure === 'array') {
        useArrayStore.setState({ elements: newData });
      }
      // Add other data structure handling here as needed
      
    } catch (error) {
      console.error('Error generating data:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Size Control */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Data Size</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <Slider
              value={[generatorSettings.size]}
              onValueChange={(value) => updateGeneratorSettings({ size: value[0] })}
              max={100}
              min={5}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-gray-500">
              <span>5</span>
              <span className="font-medium">{generatorSettings.size} elements</span>
              <span>100</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Value Range Controls */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Value Range</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Minimum Value</label>
            <Slider
              value={[generatorSettings.minValue]}
              onValueChange={(value) => updateGeneratorSettings({ minValue: value[0] })}
              max={generatorSettings.maxValue - 1}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{generatorSettings.minValue}</div>
          </div>
          
          <div>
            <label className="text-xs text-gray-600 mb-1 block">Maximum Value</label>
            <Slider
              value={[generatorSettings.maxValue]}
              onValueChange={(value) => updateGeneratorSettings({ maxValue: value[0] })}
              max={1000}
              min={generatorSettings.minValue + 1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-500 mt-1">{generatorSettings.maxValue}</div>
          </div>
        </CardContent>
      </Card>

      {/* Distribution Type */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Distribution</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="grid grid-cols-2 gap-2">
            {[
              { value: 'uniform', label: 'Random' },
              { value: 'normal', label: 'Normal' },
              { value: 'sorted', label: 'Sorted' },
              { value: 'reverse', label: 'Reverse' },
            ].map((option) => (
              <Button
                key={option.value}
                variant={generatorSettings.distribution === option.value ? 'default' : 'outline'}
                size="sm"
                onClick={() => updateGeneratorSettings({ distribution: option.value as any })}
                className="text-xs"
              >
                {option.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Generate Button */}
      <Button
        onClick={generateRandomData}
        disabled={isGenerating}
        className="w-full"
        size="lg"
      >
        {isGenerating ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Generating...
          </>
        ) : (
          <>
            <Shuffle className="w-4 h-4 mr-2" />
            Generate Data
          </>
        )}
      </Button>

      {/* Current Data Preview */}
      {dataStructure === 'array' && currentElements.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Current Data</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="text-xs text-gray-600 max-h-20 overflow-y-auto">
              [{currentElements.slice(0, 20).join(', ')}
              {currentElements.length > 20 && '...'} ]
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {currentElements.length} elements
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default DataGenerators;
