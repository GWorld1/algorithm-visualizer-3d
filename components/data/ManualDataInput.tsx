"use client"
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/store/useUIStore';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { useArrayStore } from '@/store/useArrayStore';
import { Check, AlertCircle, Copy, RotateCcw } from 'lucide-react';

const ManualDataInput = () => {
  const { manualInput, updateManualInput } = useUIStore();
  const { dataStructure } = useAlgorithmStore();
  const [localValue, setLocalValue] = useState(manualInput.value);

  // Validation function
  const validateInput = (input: string): { isValid: boolean; errorMessage: string; parsedData?: number[] } => {
    if (!input.trim()) {
      return { isValid: true, errorMessage: '' };
    }

    try {
      // Remove brackets and split by comma
      const cleanInput = input.replace(/[\[\]]/g, '').trim();
      if (!cleanInput) {
        return { isValid: true, errorMessage: '' };
      }

      const values = cleanInput.split(',').map(val => {
        const num = parseFloat(val.trim());
        if (isNaN(num)) {
          throw new Error(`"${val.trim()}" is not a valid number`);
        }
        return Math.round(num); // Convert to integer
      });

      if (values.length === 0) {
        return { isValid: false, errorMessage: 'Please enter at least one number' };
      }

      if (values.length > 100) {
        return { isValid: false, errorMessage: 'Maximum 100 elements allowed' };
      }

      return { isValid: true, errorMessage: '', parsedData: values };
    } catch (error) {
      return { isValid: false, errorMessage: error instanceof Error ? error.message : 'Invalid format' };
    }
  };

  // Real-time validation
  useEffect(() => {
    const validation = validateInput(localValue);
    updateManualInput({
      value: localValue,
      isValid: validation.isValid,
      errorMessage: validation.errorMessage,
    });
  }, [localValue, updateManualInput]);

  const handleApplyData = () => {
    const validation = validateInput(localValue);
    if (validation.isValid && validation.parsedData) {
      if (dataStructure === 'array') {
        useArrayStore.setState({ elements: validation.parsedData });
      }
      // Add other data structure handling here
    }
  };

  const handleCopyExample = (example: string) => {
    setLocalValue(example);
  };

  const handleClear = () => {
    setLocalValue('');
  };

  const examples = [
    { label: 'Small Array', value: '5, 2, 8, 1, 9' },
    { label: 'Sorted Array', value: '1, 3, 5, 7, 9, 11, 13' },
    { label: 'Reverse Sorted', value: '20, 15, 10, 5, 1' },
    { label: 'With Duplicates', value: '3, 7, 3, 1, 7, 5, 3' },
  ];

  return (
    <div className="space-y-4">
      {/* Input Area */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center justify-between">
            Manual Input
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="h-6 px-2 text-xs"
            >
              <RotateCcw className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            <textarea
              value={localValue}
              onChange={(e) => setLocalValue(e.target.value)}
              placeholder="Enter numbers separated by commas&#10;Example: 5, 2, 8, 1, 9"
              className={`w-full h-24 p-3 text-sm border rounded-md resize-none font-mono ${
                !manualInput.isValid 
                  ? 'border-red-300 bg-red-50' 
                  : 'border-gray-300 bg-white'
              }`}
            />
            
            {/* Validation Status */}
            <div className="flex items-center gap-2 text-xs">
              {manualInput.isValid ? (
                <div className="flex items-center text-green-600">
                  <Check className="w-3 h-3 mr-1" />
                  Valid format
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  {manualInput.errorMessage}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Format Examples */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Quick Templates</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="space-y-2">
            {examples.map((example, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-xs">
                <div>
                  <div className="font-medium text-gray-700">{example.label}</div>
                  <div className="text-gray-500 font-mono">{example.value}</div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleCopyExample(example.value)}
                  className="h-6 px-2"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Format Help */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Format Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-xs text-gray-600 space-y-1">
            <div>• Separate numbers with commas</div>
            <div>• Brackets are optional: [1,2,3] or 1,2,3</div>
            <div>• Spaces are ignored</div>
            <div>• Maximum 100 elements</div>
            <div>• Decimals will be rounded to integers</div>
          </div>
        </CardContent>
      </Card>

      {/* Apply Button */}
      <Button
        onClick={handleApplyData}
        disabled={!manualInput.isValid || !localValue.trim()}
        className="w-full"
        size="lg"
      >
        Apply Data
      </Button>
    </div>
  );
};

export default ManualDataInput;
