interface SortStep {
    action: 'compare' | 'swap' | 'complete';
    indices: [number, number]; // Tuple type requiring exactly 2 numbers
    array: number[];
  }
  
  export const bubbleSort = (inputArr: number[]): SortStep[] => {
    const arr = [...inputArr];
    const steps: SortStep[] = [];
    let swapped: boolean;
  
    for (let i = 0; i < arr.length - 1; i++) {
      swapped = false;
  
      for (let j = 0; j < arr.length - i - 1; j++) {
        steps.push({ 
          action: 'compare', 
          indices: [j, j + 1], 
          array: [...arr] 
        });
        
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          swapped = true;
          steps.push({ 
            action: 'complete', 
            indices: [j, j + 1], // Changed to include both indices
            array: [...arr] 
          });
        }
      }
      
      // For the 'complete' action, include both the final position and the previous position
      steps.push({ 
        action: 'complete', 
        indices: [arr.length - i - 2, arr.length - i - 1], 
        array: [...arr] 
      });
  
      if (!swapped) break;
    }
  
    return steps;
  };
  