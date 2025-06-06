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
      this.addStep(`Starting loop: ${loopVariable} = ${loopStart} to ${loopEnd}`, 'custom');
      this.currentNodeId = this.getNextNode(node.id, 'exec-out');
    } else {
      // Continue existing loop
      existingLoop.current++;
      this.context.variables.set(loopVariable, existingLoop.current);
      
      if (existingLoop.current < existingLoop.end) {
        this.addStep(`Loop iteration: ${loopVariable} = ${existingLoop.current}`, 'custom');
        this.currentNodeId = this.getNextNode(node.id, 'exec-out');
      } else {
        // Loop complete
        this.context.loopStack = this.context.loopStack.filter(loop => loop.nodeId !== node.id);
        this.addStep(`Loop completed`, 'custom');
        this.currentNodeId = this.getNextNode(node.id, 'exec-complete');
      }
    }
  }

  private executeIfCondition(node: ScriptNode): void {
    const { condition = 'true' } = node.data;
    
    // Simple condition evaluation (can be enhanced)
    let result = false;
    try {
      // Replace variables in condition
      let evaluatedCondition = condition;
      for (const [varName, varValue] of this.context.variables.entries()) {
        evaluatedCondition = evaluatedCondition.replace(new RegExp(`\\b${varName}\\b`, 'g'), String(varValue));
      }
      
      // Simple evaluation (unsafe but for demo purposes)
      result = eval(evaluatedCondition);
    } catch (error) {
      console.warn('Condition evaluation error:', error);
    }

    this.addStep(`Condition "${condition}" evaluated to ${result}`, 'custom');
    
    if (result) {
      this.currentNodeId = this.getNextNode(node.id, 'exec-true');
    } else {
      this.currentNodeId = this.getNextNode(node.id, 'exec-false');
    }
  }

  private executeArrayAccess(node: ScriptNode): void {
    const { arrayIndex1 = 0 } = node.data;
    const index = this.resolveValue(arrayIndex1);
    
    if (index >= 0 && index < this.context.currentArray.length) {
      const value = this.context.currentArray[index];
      this.addStep(`Accessed array[${index}] = ${value}`, 'traverse', {
        indices: [index]
      });
    }
    
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
    const value = this.resolveValue(variableValue);
    
    this.context.variables.set(variableName, value);
    this.addStep(`Set ${variableName} = ${value}`, 'custom');
    
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

  private resolveValue(value: any): any {
    if (typeof value === 'string' && this.context.variables.has(value)) {
      return this.context.variables.get(value);
    }
    return value;
  }

  private isValidIndex(index: number): boolean {
    return index >= 0 && index < this.context.currentArray.length;
  }
}
