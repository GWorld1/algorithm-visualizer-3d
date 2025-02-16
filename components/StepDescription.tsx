import React from 'react';
import { useAlgorithmStore } from '@/store/useAlgorithmStore';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

const StepDescription = () => {
  const { currentStep, steps, algorithmType } = useAlgorithmStore();

  // Only show for sorting algorithms
  if (!['bubbleSort', 'quickSort', 'insertionSort','selectionSort', 'mergeSort'].includes(algorithmType)) {
    return null;
  }

  const currentStepData = steps[currentStep];
  if (!currentStepData?.description) {
    return null;
  }

  return (
    <Card className="fixed top-4 left-1/2 transform -translate-x-1/2 w-96 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-yellow-500 mt-1 flex-shrink-0" />
          <div>
            <h3 className="font-semibold text-sm text-gray-900">Step {currentStep + 1} of {steps.length}</h3>
            <p className="text-sm text-gray-600 mt-1">{currentStepData.description}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StepDescription;