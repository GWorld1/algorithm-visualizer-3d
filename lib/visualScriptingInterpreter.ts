import { 
  ScriptNode, 
  Connection, 
  CustomAlgorithmStep, 
  ExecutionContext,
  NodeType 
} from '@/types/VisualScripting';
import { ArrayElementState } from './sortingAlgorithms';

export class VisualScriptingInterpreter {
  private nodes: Map<string, ScriptNode>;
  private connections: Connection[];
  private context: ExecutionContext;
  private steps: CustomAlgorithmStep[];
  private currentNodeId: string | null;
  private loopReturnStack: Array<{
    loopNodeId: string;
    returnToLoop: boolean;
  }>;

  constructor(nodes: ScriptNode[], connections: Connection[], inputArray: number[]) {
    this.nodes = new Map(nodes.map(node => [node.id, node]));
    this.connections = connections;
    this.context = {
      variables: new Map(),
      currentArray: [...inputArray],
      currentIndex: 0,
      loopStack: [],
      executionStack: [],
      isComplete: false
    };
    this.steps = [];
    this.currentNodeId = null;
    this.loopReturnStack = [];
  }

  public execute(): CustomAlgorithmStep[] {
    try {
      // Find the start node
      const startNode = Array.from(this.nodes.values()).find(node => node.type === 'start');
      if (!startNode) {
        throw new Error('No start node found');
      }

      this.currentNodeId = startNode.id;
      this.addStep('Starting algorithm execution', 'custom');

      // Execute the algorithm
      while (this.currentNodeId && !this.context.isComplete) {
        const currentNode = this.nodes.get(this.currentNodeId);
        if (!currentNode) {
          throw new Error(`Node ${this.currentNodeId} not found`);
        }

        this.executeNode(currentNode);
      }

      this.addStep('Algorithm execution completed', 'custom');
      return this.steps;

    } catch (error) {
      this.context.error = error instanceof Error ? error.message : 'Unknown error';
      this.addStep(`Error: ${this.context.error}`, 'custom');
      return this.steps;
    }
  }

  private executeNode(node: ScriptNode): void {
    // Check if we should return to a loop after executing this node
    const shouldReturnToLoop = this.checkLoopReturn(node);

    switch (node.type) {
      case 'start':
        this.executeStart(node);
        break;
      case 'end':
        this.executeEnd(node);
        break;
      case 'for-loop':
        this.executeForLoop(node);
        break;
      case 'if-condition':
        this.executeIfCondition(node);
        break;
      case 'array-access':
        this.executeArrayAccess(node);
        break;
      case 'array-compare':
        this.executeArrayCompare(node);
        break;
      case 'array-swap':
        this.executeArraySwap(node);
        break;
      case 'array-highlight':
        this.executeArrayHighlight(node);
        break;
      case 'variable-set':
        this.executeVariableSet(node);
        break;
      case 'variable-get':
        this.executeVariableGet(node);
        break;
      case 'counter-increment':
        this.executeCounterIncrement(node);
        break;
      case 'update-description':
        this.executeUpdateDescription(node);
        break;
      case 'pause-execution':
        this.executePause(node);
        break;
      default:
        throw new Error(`Unknown node type: ${node.type}`);
    }

    // Handle loop return after node execution
    if (shouldReturnToLoop) {
      this.handleLoopReturn();
    }
  }

  private executeStart(node: ScriptNode): void {
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeEnd(node: ScriptNode): void {
    this.context.isComplete = true;
    this.currentNodeId = null;
  }

  private executeForLoop(node: ScriptNode): void {
    const { loopStart = 0, loopEnd = 10, loopVariable = 'i' } = node.data;

    // Check if we're already in this loop
    const existingLoop = this.context.loopStack.find(loop => loop.nodeId === node.id);

    if (!existingLoop) {
      // Start new loop
      this.context.loopStack.push({
        variable: loopVariable,
        current: loopStart,
        end: loopEnd,
        nodeId: node.id
      });
      this.context.variables.set(loopVariable, loopStart);
      this.addStep(`Starting loop: ${loopVariable} = ${loopStart} to ${loopEnd}`, 'custom', {
        loopStart: true,
        loopVariable: loopVariable,
        loopRange: `${loopStart} to ${loopEnd}`
      });

      // Execute loop body if we have iterations to do
      if (loopStart < loopEnd) {
        // Add step for first iteration
        this.addStep(
          `Loop iteration ${loopStart}: ${loopVariable} = ${loopStart}`,
          'custom',
          {
            loopIteration: true,
            loopVariable: loopVariable,
            loopValue: loopStart,
            iterationNumber: loopStart
          }
        );
        this.currentNodeId = this.getNextNode(node.id, 'exec-out');
      } else {
        // Empty loop, go directly to complete
        this.context.loopStack = this.context.loopStack.filter(loop => loop.nodeId !== node.id);
        this.addStep(`Loop completed (no iterations)`, 'custom', {
          loopComplete: true,
          loopVariable: loopVariable
        });
        this.currentNodeId = this.getNextNode(node.id, 'exec-complete');
      }
    } else {
      // Continue existing loop - this happens when we return from loop body
      existingLoop.current++;
      this.context.variables.set(loopVariable, existingLoop.current);

      if (existingLoop.current < existingLoop.end) {
        // Add detailed step for each iteration
        this.addStep(
          `Loop iteration ${existingLoop.current}: ${loopVariable} = ${existingLoop.current}`,
          'custom',
          {
            loopIteration: true,
            loopVariable: loopVariable,
            loopValue: existingLoop.current,
            iterationNumber: existingLoop.current
          }
        );
        // Re-execute loop body for this iteration
        this.currentNodeId = this.getNextNode(node.id, 'exec-out');
      } else {
        // Loop complete
        this.context.loopStack = this.context.loopStack.filter(loop => loop.nodeId !== node.id);
        this.addStep(`Loop completed: processed ${existingLoop.end - loopStart} iterations`, 'custom', {
          loopComplete: true,
          loopVariable: loopVariable,
          totalIterations: existingLoop.end - loopStart
        });
        this.currentNodeId = this.getNextNode(node.id, 'exec-complete');
      }
    }
  }

  private executeIfCondition(node: ScriptNode): void {
    const {
      comparisonOperator = '==',
      leftValue = 0,
      rightValue = 0
    } = node.data;

    let result = false;
    let leftVal: any;
    let rightVal: any;

    // Check if we have data flow connections for left and right values
    const hasLeftConnection = this.connections.some(conn =>
      conn.target === node.id && conn.targetHandle === 'left-in'
    );
    const hasRightConnection = this.connections.some(conn =>
      conn.target === node.id && conn.targetHandle === 'right-in'
    );

    // Get left and right values (from data flow or default values)
    leftVal = hasLeftConnection ?
      this.resolveValue(leftValue, node.id, 'left-in') :
      this.resolveValue(leftValue);
    rightVal = hasRightConnection ?
      this.resolveValue(rightValue, node.id, 'right-in') :
      this.resolveValue(rightValue);

    // Perform comparison based on operator
    switch (comparisonOperator) {
      case '==':
        result = leftVal == rightVal;
        break;
      case '!=':
        result = leftVal != rightVal;
        break;
      case '>':
        result = Number(leftVal) > Number(rightVal);
        break;
      case '<':
        result = Number(leftVal) < Number(rightVal);
        break;
      case '>=':
        result = Number(leftVal) >= Number(rightVal);
        break;
      case '<=':
        result = Number(leftVal) <= Number(rightVal);
        break;
      default:
        console.warn(`Unknown comparison operator: ${comparisonOperator}`);
        result = false;
    }

    // Add loop context if we're in a loop
    const currentLoop = this.context.loopStack.length > 0 ?
      this.context.loopStack[this.context.loopStack.length - 1] : null;
    const loopContext = currentLoop ?
      ` (Loop iteration ${currentLoop.current}: ${currentLoop.variable} = ${currentLoop.current})` : '';

    const conditionDescription = `Compare: ${leftVal} ${comparisonOperator} ${rightVal} = ${result}`;

    this.addStep(
      `${conditionDescription}${loopContext}`,
      'custom',
      {
        conditionResult: result,
        leftValue: leftVal,
        rightValue: rightVal,
        operator: comparisonOperator,
        isLoopIteration: currentLoop !== null,
        loopVariable: currentLoop?.variable,
        loopValue: currentLoop?.current
      }
    );

    // Store result for potential data flow usage
    this.context.variables.set(`__condition_result_${node.id}`, result);

    if (result) {
      this.currentNodeId = this.getNextNode(node.id, 'exec-true');
    } else {
      this.currentNodeId = this.getNextNode(node.id, 'exec-false');
    }
  }

  private executeArrayAccess(node: ScriptNode): void {
    // Array access is now a data-only operation, but we still need to handle it in execution flow
    // This method should ideally not be called in a pure data flow model
    const { arrayIndex1 = 0 } = node.data;

    // Try to resolve index from data flow connections first
    const index = this.resolveValue(arrayIndex1, node.id, 'index-in');

    // Get array from data flow or use current array
    const arrayValue = this.resolveValue(this.context.currentArray, node.id, 'array-in');
    const targetArray = Array.isArray(arrayValue) ? arrayValue : this.context.currentArray;

    if (index >= 0 && index < targetArray.length) {
      const value = targetArray[index];

      // Check if we're in a loop context for enhanced step description
      const currentLoop = this.context.loopStack.length > 0 ?
        this.context.loopStack[this.context.loopStack.length - 1] : null;

      const loopContext = currentLoop ?
        ` (Loop iteration ${currentLoop.current}: ${currentLoop.variable} = ${currentLoop.current})` : '';

      this.addStep(
        `Accessed array[${index}] = ${value}${loopContext}`,
        'traverse',
        {
          indices: [index],
          value: value,
          isLoopIteration: currentLoop !== null,
          loopVariable: currentLoop?.variable,
          loopValue: currentLoop?.current,
          iterationNumber: currentLoop?.current
        }
      );

      // Store the result for potential data flow usage
      this.context.variables.set(`__array_access_${node.id}`, value);
    } else {
      const currentLoop = this.context.loopStack.length > 0 ?
        this.context.loopStack[this.context.loopStack.length - 1] : null;
      const loopContext = currentLoop ?
        ` (Loop iteration ${currentLoop.current})` : '';

      this.addStep(`Array access failed: index ${index} out of bounds${loopContext}`, 'custom', {
        error: true,
        isLoopIteration: currentLoop !== null,
        loopVariable: currentLoop?.variable,
        loopValue: currentLoop?.current
      });
    }

    // Continue execution flow if this node is still in execution path
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeArrayCompare(node: ScriptNode): void {
    const { arrayIndex1 = 0, arrayIndex2 = 1 } = node.data;
    const index1 = this.resolveValue(arrayIndex1);
    const index2 = this.resolveValue(arrayIndex2);
    
    if (this.isValidIndex(index1) && this.isValidIndex(index2)) {
      const value1 = this.context.currentArray[index1];
      const value2 = this.context.currentArray[index2];
      const result = value1 > value2;
      
      this.addStep(`Comparing array[${index1}] (${value1}) with array[${index2}] (${value2})`, 'compare', {
        indices: [index1, index2]
      });
    }
    
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeArraySwap(node: ScriptNode): void {
    const { arrayIndex1 = 0, arrayIndex2 = 1 } = node.data;
    const index1 = this.resolveValue(arrayIndex1);
    const index2 = this.resolveValue(arrayIndex2);
    
    if (this.isValidIndex(index1) && this.isValidIndex(index2)) {
      const temp = this.context.currentArray[index1];
      this.context.currentArray[index1] = this.context.currentArray[index2];
      this.context.currentArray[index2] = temp;
      
      this.addStep(`Swapped array[${index1}] with array[${index2}]`, 'swap', {
        indices: [index1, index2]
      });
    }
    
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeArrayHighlight(node: ScriptNode): void {
    const { arrayIndex1 = 0, highlightColor = 'yellow' } = node.data;
    const index = this.resolveValue(arrayIndex1);
    
    if (this.isValidIndex(index)) {
      this.addStep(`Highlighting array[${index}]`, 'highlight', {
        indices: [index],
        color: highlightColor
      });
    }
    
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeVariableSet(node: ScriptNode): void {
    const { variableName = 'variable', variableValue = 0 } = node.data;

    // Check if we have a data flow connection for the value
    const hasValueConnection = this.connections.some(conn =>
      conn.target === node.id && conn.targetHandle === 'value-in'
    );

    let value: any;
    let valueSource = '';

    if (hasValueConnection) {
      // Get value from data flow connection
      value = this.resolveValue(variableValue, node.id, 'value-in');
      valueSource = ' (from data flow)';
    } else {
      // Use static value or resolve from variables
      value = this.resolveValue(variableValue);
      valueSource = ' (static value)';
    }

    // Set the variable
    this.context.variables.set(variableName, value);

    // Add loop context if we're in a loop
    const currentLoop = this.context.loopStack.length > 0 ?
      this.context.loopStack[this.context.loopStack.length - 1] : null;
    const loopContext = currentLoop ?
      ` (Loop iteration ${currentLoop.current}: ${currentLoop.variable} = ${currentLoop.current})` : '';

    this.addStep(
      `Set ${variableName} = ${value}${valueSource}${loopContext}`,
      'custom',
      {
        variableName: variableName,
        variableValue: value,
        valueSource: hasValueConnection ? 'dataFlow' : 'static',
        isLoopIteration: currentLoop !== null,
        loopVariable: currentLoop?.variable,
        loopValue: currentLoop?.current
      }
    );

    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeVariableGet(node: ScriptNode): void {
    const { variableName = 'variable' } = node.data;
    const value = this.context.variables.get(variableName) || 0;
    
    this.addStep(`Get ${variableName} = ${value}`, 'custom');
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeCounterIncrement(node: ScriptNode): void {
    const { variableName = 'counter' } = node.data;
    const currentValue = this.context.variables.get(variableName) || 0;
    const newValue = Number(currentValue) + 1;
    
    this.context.variables.set(variableName, newValue);
    this.addStep(`Incremented ${variableName} to ${newValue}`, 'custom');
    
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executeUpdateDescription(node: ScriptNode): void {
    const { description = 'Step description' } = node.data;
    this.addStep(description, 'custom');
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private executePause(node: ScriptNode): void {
    const { pauseDuration = 1000 } = node.data;
    this.addStep(`Pausing for ${pauseDuration}ms`, 'pause', {
      duration: pauseDuration
    });
    this.currentNodeId = this.getNextNode(node.id, 'exec-out');
  }

  private addStep(description: string, action: CustomAlgorithmStep['action'], metadata?: any): void {
    const step: CustomAlgorithmStep = {
      dataStructureState: this.createArrayElementStates(),
      highlightedElements: metadata?.indices || [],
      description,
      action,
      metadata
    };
    this.steps.push(step);
  }

  private createArrayElementStates(): ArrayElementState[] {
    return this.context.currentArray.map((value, index) => ({
      value,
      state: 'default' as const,
      position: index
    }));
  }

  private getNextNode(currentNodeId: string, outputHandle: string): string | null {
    const connection = this.connections.find(
      conn => conn.source === currentNodeId && conn.sourceHandle === outputHandle
    );
    return connection ? connection.target : null;
  }

  private resolveValue(value: any, nodeId?: string, inputHandle?: string): any {
    // First check if this is a data flow connection
    if (nodeId && inputHandle) {
      const dataConnection = this.connections.find(conn =>
        conn.target === nodeId &&
        conn.targetHandle === inputHandle &&
        !conn.sourceHandle.startsWith('exec')
      );

      if (dataConnection) {
        const dataValue = this.getDataValue(dataConnection.source, dataConnection.sourceHandle);
        if (dataValue !== null) {
          return dataValue;
        }
      }
    }

    // Fallback to variable resolution or literal value
    if (typeof value === 'string' && this.context.variables.has(value)) {
      return this.context.variables.get(value);
    }
    return value;
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.context.currentArray.length;
  }

  private checkLoopReturn(node: ScriptNode): boolean {
    // Check if this node is at the end of a loop body and should return to loop
    if (this.context.loopStack.length === 0) return false;

    // Find if this node has no outgoing execution connections (end of path)
    const hasOutgoingExecution = this.connections.some(conn =>
      conn.source === node.id && conn.sourceHandle.startsWith('exec')
    );

    // If no outgoing execution and we're in a loop, we should return
    return !hasOutgoingExecution && this.context.loopStack.length > 0;
  }

  private handleLoopReturn(): void {
    if (this.context.loopStack.length > 0) {
      // Get the most recent loop
      const currentLoop = this.context.loopStack[this.context.loopStack.length - 1];

      // Add step showing loop body completion for current iteration
      this.addStep(
        `Completed loop body for ${currentLoop.variable} = ${currentLoop.current}`,
        'custom',
        {
          loopBodyComplete: true,
          loopVariable: currentLoop.variable,
          loopValue: currentLoop.current,
          iterationNumber: currentLoop.current
        }
      );

      // Return to the loop node to continue iteration
      this.currentNodeId = currentLoop.nodeId;
    }
  }

  private getDataValue(nodeId: string, outputHandle: string): any {
    // Helper method to get data values from nodes for data flow connections
    const node = this.nodes.get(nodeId);
    if (!node) return null;

    switch (node.type) {
      case 'for-loop':
        if (outputHandle === 'index-out') {
          const loop = this.context.loopStack.find(l => l.nodeId === nodeId);
          return loop ? loop.current : 0;
        }
        if (outputHandle === 'array-out') {
          return this.context.currentArray;
        }
        break;
      case 'array-access':
        if (outputHandle === 'value-out') {
          return this.context.variables.get(`__array_access_${nodeId}`) || 0;
        }
        break;
      case 'if-condition':
        if (outputHandle === 'result-out') {
          return this.context.variables.get(`__condition_result_${nodeId}`) || false;
        }
        break;
      case 'variable-get':
        if (outputHandle === 'value-out') {
          const varName = node.data.variableName || 'variable';
          return this.context.variables.get(varName) || 0;
        }
        break;
      case 'variable-set':
        if (outputHandle === 'value-out') {
          const varName = node.data.variableName || 'variable';
          return this.context.variables.get(varName) || 0;
        }
        break;
    }

    return null;
  }
}
