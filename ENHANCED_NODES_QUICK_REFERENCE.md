# Enhanced Visual Scripting Nodes - Quick Reference

## 🎯 **Enhanced If-Condition Node**

### **New Capabilities**
- **Dynamic Value Comparison**: Compare values from data flow connections
- **Multiple Operators**: ==, !=, >, <, >=, <=
- **Data Output**: Provides boolean result for chaining
- **Loop Context**: Includes loop iteration info in animation steps

### **Inputs**
- `exec-in` (execution): Previous step
- `left-in` (any): Left value for comparison
- `right-in` (any): Right value for comparison  
- `condition-in` (boolean): Direct boolean input (optional)

### **Outputs**
- `exec-true` (execution): Path when condition is true
- `exec-false` (execution): Path when condition is false
- `result-out` (boolean): Boolean result of comparison

### **Configuration**
- **Comparison Operator**: Set in node properties (==, !=, >, <, >=, <=)
- **Left Value**: Default value if no data connection
- **Right Value**: Default value if no data connection

### **Common Usage Patterns**
```
Array Access → If-Condition (left-in)
Variable Get → If-Condition (right-in)
If-Condition (exec-true) → Variable Set
```

---

## 🎯 **Enhanced Variable-Set Node**

### **New Capabilities**
- **Dynamic Value Setting**: Accept values from data flow connections
- **Data Output**: Provides set value for chaining operations
- **Loop Context**: Includes loop iteration info in animation steps
- **Source Tracking**: Shows whether value came from data flow or static input

### **Inputs**
- `exec-in` (execution): Previous step
- `value-in` (any): Value to set (from data flow)

### **Outputs**
- `exec-out` (execution): Next step
- `value-out` (any): The value that was set

### **Configuration**
- **Variable Name**: Name of variable to set
- **Variable Value**: Default value if no data connection

### **Common Usage Patterns**
```
Array Access → Variable Set (value-in)
Loop Index → Variable Set (value-in)
Variable Set → Variable Get (same variable name)
```

---

## 🔧 **Algorithm Implementation Patterns**

### **Linear Search Pattern**
```
1. Initialize: Variable Set (foundIndex = -1)
2. Initialize: Variable Set (searchTarget = value)
3. Loop: For Loop (0 to array.length)
4. Access: Array Access (index from loop)
5. Compare: If-Condition (array value == search target)
6. Update: Variable Set (foundIndex = loop index) [on true branch]
```

**Key Connections**:
- Loop `index-out` → Array Access `index-in`
- Array Access `value-out` → If-Condition `left-in`
- Search Target `value-out` → If-Condition `right-in`
- Loop `index-out` → Variable Set `value-in` (for found index)

### **Find Maximum Pattern**
```
1. Initialize: Variable Set (maxValue = -999)
2. Initialize: Variable Set (maxIndex = -1)
3. Loop: For Loop (0 to array.length)
4. Access: Array Access (index from loop)
5. Get Current Max: Variable Get (maxValue)
6. Compare: If-Condition (array value > current max)
7. Update Max: Variable Set (maxValue = array value) [on true branch]
8. Update Index: Variable Set (maxIndex = loop index) [on true branch]
```

**Key Connections**:
- Loop `index-out` → Array Access `index-in`
- Array Access `value-out` → If-Condition `left-in`
- Variable Get `value-out` → If-Condition `right-in`
- Array Access `value-out` → Variable Set `value-in` (for max value)
- Loop `index-out` → Variable Set `value-in` (for max index)

---

## 🎨 **Visual Connection Guide**

### **Handle Colors**
- **Green**: Execution flow (what happens next)
- **Blue**: Data flow (values passed between nodes)

### **Connection Rules**
- **Execution to Execution**: Green handles only connect to green handles
- **Data to Data**: Blue handles connect to blue handles
- **One-to-One**: Each execution output can only connect to one input
- **One-to-Many**: Data outputs can connect to multiple inputs

### **Best Practices**
1. **Plan Data Flow First**: Identify what values need to flow between nodes
2. **Connect Execution Flow**: Ensure proper sequence of operations
3. **Use Descriptive Names**: Set meaningful variable names
4. **Test Incrementally**: Build and test small parts before combining

---

## 🚨 **Common Troubleshooting**

### **Condition Always False**
- ✅ Check data flow connections are made
- ✅ Verify comparison operator is correct
- ✅ Ensure values are being resolved properly

### **Variable Not Updating**
- ✅ Check `value-in` connection for dynamic values
- ✅ Verify variable name matches between set and get
- ✅ Ensure execution flow reaches the variable-set node

### **Missing Animation Steps**
- ✅ Verify all nodes have execution connections
- ✅ Check that loop body is properly connected
- ✅ Ensure enhanced node templates are being used

### **Data Flow Issues**
- ✅ Confirm output handle connects to correct input handle
- ✅ Check handle types match (any type is compatible with all)
- ✅ Verify source node has executed before target node needs the value

---

## 📚 **Quick Start Examples**

### **Simple Comparison**
```
Array Access → If-Condition (left-in)
Static Value → If-Condition (right-in)
If-Condition (exec-true) → Action Node
```

### **Variable Update in Loop**
```
For Loop → Array Access → If-Condition → Variable Set
    ↓           ↓              ↓
    └─ index ──→ index    value → left
                          target → right
                          index → value
```

### **Chain Multiple Conditions**
```
If-Condition 1 (exec-true) → If-Condition 2 → Final Action
If-Condition 1 (result-out) → If-Condition 2 (left-in)
```

---

## 🎉 **Success Tips**

1. **Start Simple**: Begin with basic comparisons before complex algorithms
2. **Use Console**: Check browser console for execution details
3. **Step Through**: Use animation controls to verify each step
4. **Test Edge Cases**: Try empty arrays, single elements, no matches
5. **Verify Variables**: Check that variables have expected values after execution

The enhanced visual scripting system now supports sophisticated algorithm implementation with intuitive data flow and detailed animation feedback!
