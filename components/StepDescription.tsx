import React from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';
import { BSTStep } from '@/lib/bstAlgorithms';
import { CustomAlgorithmStep } from '@/types/VisualScripting';

const StepDescription = () => {
  const { currentStep, steps, algorithmType } = useAlgorithmStore();
  // Only show for sorting algorithms, BST operations, and custom visual scripts
  if (!['bubbleSort', 'quickSort', 'insertionSort', 'selectionSort', 'mergeSort', 'bstInsert', 'bstSearch', 'customVisualScript'].includes(algorithmType)) {
    return null;
  }

  let description = '';

  // Handle different step formats based on algorithm type
  if (algorithmType === 'bstInsert' || algorithmType === 'bstSearch') {
    const bstStep = steps[currentStep] as unknown as BSTStep;
    description = bstStep?.description || '';
  } else if (algorithmType === 'customVisualScript') {
    // For custom visual scripts
    const customStep = steps[currentStep] as CustomAlgorithmStep;
    description = customStep?.description || '';
  } else {
    // For sorting algorithms
    description = (steps[currentStep] as any)?.description || '';
  }

  if (!description) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 w-96 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Step {currentStep + 1} of {steps.length}</h3>
            <p className="text-sm text-gray-600 mt-1">{description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDescription;