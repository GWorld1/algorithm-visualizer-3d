/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useArrayStore } from '@/store/useArrayStore';
import { Shuffle, Loader2, AlertCircle, CheckCircle } from 'lucide-react';

type GenerationPattern = 
  | 'random' 
  | 'sorted' 
  | 'reverse' 
  | 'nearlySorted' 
  | 'duplicates';

interface GeneratorSettings {
  size: number;
  minValue: number;
  maxValue: number;
  pattern: GenerationPattern;
}

const ArrayGenerator = () => {
  const { setElements } = useArrayStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  
  const [settings, setSettings] = useState<GeneratorSettings>({
    size: 10,
    minValue: 1,
    maxValue: 100,
    pattern: 'random'
  });

  // Validation
  const validateSettings = (): { isValid: boolean; error?: string } => {
    if (settings.size < 3 || settings.size > 30) {
      return { isValid: false, error: 'Array size must be between 3 and 30 elements' };
    }
    if (settings.minValue >= settings.maxValue) {
      return { isValid: false, error: 'Minimum value must be less than maximum value' };
    }
    if (settings.maxValue - settings.minValue > 1000) {
      return { isValid: false, error: 'Value range too large (max 1000)' };
    }
    return { isValid: true };
  };

  // Array generation functions
  const generateArray = (pattern: GenerationPattern, size: number, min: number, max: number): number[] => {
    switch (pattern) {
      case 'random':
        return Array.from({ length: size }, () => 
          Math.floor(Math.random() * (max - min + 1)) + min
        );
      
      case 'sorted':
        return Array.from({ length: size }, (_, i) => 
          Math.floor(min + (i / (size - 1)) * (max - min))
        );
      
      case 'reverse':
        return Array.from({ length: size }, (_, i) => 
          Math.floor(max - (i / (size - 1)) * (max - min))
        );
      
      case 'nearlySorted': {
        // Create sorted array first
        const sorted = Array.from({ length: size }, (_, i) => 
          Math.floor(min + (i / (size - 1)) * (max - min))
        );
        // Randomly swap 10-20% of elements
        const swapCount = Math.max(1, Math.floor(size * 0.15));
        for (let i = 0; i < swapCount; i++) {
          const idx1 = Math.floor(Math.random() * size);
          const idx2 = Math.floor(Math.random() * size);
          [sorted[idx1], sorted[idx2]] = [sorted[idx2], sorted[idx1]];
        }
        return sorted;
      }
      
      case 'duplicates': {
        // Generate array with intentional duplicates
        const uniqueValues = Math.max(2, Math.floor(size / 2));
        const values = Array.from({ length: uniqueValues }, () => 
          Math.floor(Math.random() * (max - min + 1)) + min
        );
        const result: number[] = [];
        for (let i = 0; i < size; i++) {
          result.push(values[Math.floor(Math.random() * values.length)]);
        }
        return result;
      }
      
      default:
        return [];
    }
  };

  const handleGenerate = async () => {
    const validation = validateSettings();
    if (!validation.isValid) {
      setFeedback({ type: 'error', message: validation.error! });
      return;
    }

    setIsGenerating(true);
    setFeedback(null);

    try {
      // Add slight delay for better UX
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newArray = generateArray(
        settings.pattern, 
        settings.size, 
        settings.minValue, 
        settings.maxValue
      );
      
      setElements(newArray);
      setFeedback({ 
        type: 'success', 
        message: `Generated ${settings.pattern} array with ${newArray.length} elements` 
      });
      
      // Clear success message after 3 seconds
      setTimeout(() => setFeedback(null), 3000);
      
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to generate array' });
    } finally {
      setIsGenerating(false);
    }
  };

  const patternOptions = [
    { value: 'random', label: 'Random Array' },
    { value: 'sorted', label: 'Sorted (Ascending)' },
    { value: 'reverse', label: 'Reverse Sorted (Descending)' },
    { value: 'nearlySorted', label: 'Nearly Sorted' },
    { value: 'duplicates', label: 'Array with Duplicates' }
  ];

  return (
    <Card className="bg-gray-800/50 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-semibold text-gray-100 flex items-center gap-2">
          <Shuffle className="w-4 h-4" />
          Array Generator
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Pattern Selection */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300 block">Generation Pattern</label>
          <select
            value={settings.pattern}
            onChange={(e) => setSettings(prev => ({ ...prev, pattern: e.target.value as GenerationPattern }))}
            className="w-full text-xs border border-gray-600 rounded px-2 py-2 bg-gray-700 text-gray-100"
          >
            {patternOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* Size Input */}
        <div className="space-y-2">
          <label className="text-xs text-gray-300 block">Array Size (3-30)</label>
          <Input
            type="number"
            min="3"
            max="30"
            value={settings.size}
            onChange={(e) => setSettings(prev => ({
              ...prev,
              size: Math.max(3, Math.min(30, parseInt(e.target.value) || 3))
            }))}
            className="bg-gray-700 border-gray-600 text-gray-100"
          />
        </div>

        {/* Value Range */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-2">
            <label className="text-xs text-gray-300 block">Min Value</label>
            <Input
              type="number"
              value={settings.minValue}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                minValue: parseInt(e.target.value) || 1
              }))}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-gray-300 block">Max Value</label>
            <Input
              type="number"
              value={settings.maxValue}
              onChange={(e) => setSettings(prev => ({
                ...prev,
                maxValue: parseInt(e.target.value) || 100
              }))}
              className="bg-gray-700 border-gray-600 text-gray-100"
            />
          </div>
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div className={`flex items-center gap-2 p-2 rounded text-xs ${
            feedback.type === 'success' 
              ? 'bg-green-900/50 text-green-300 border border-green-700' 
              : 'bg-red-900/50 text-red-300 border border-red-700'
          }`}>
            {feedback.type === 'success' ? (
              <CheckCircle className="w-3 h-3" />
            ) : (
              <AlertCircle className="w-3 h-3" />
            )}
            {feedback.message}
          </div>
        )}

        {/* Generate Button */}
        <Button
          onClick={handleGenerate}
          disabled={isGenerating}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Generating...
            </>
          ) : (
            <>
              <Shuffle className="w-4 h-4 mr-2" />
              Generate Array
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default ArrayGenerator;
