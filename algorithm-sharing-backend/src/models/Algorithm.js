const mongoose = require('mongoose');

// Position schema for node positioning
const positionSchema = new mongoose.Schema({
  x: {
    type: Number,
    required: true,
  },
  y: {
    type: Number,
    required: true,
  },
}, { _id: false });

// Node input/output schema
const nodeIOSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ['execution', 'array', 'number', 'boolean', 'any'],
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
}, { _id: false });

// Script node data schema
const scriptNodeDataSchema = new mongoose.Schema({
  label: {
    type: String,
    required: true,
  },
  // Control Flow
  condition: String,
  comparisonOperator: String,
  leftValue: mongoose.Schema.Types.Mixed,
  rightValue: mongoose.Schema.Types.Mixed,
  loopStart: Number,
  loopEnd: Number,
  loopVariable: String,
  
  // Array Operations
  arrayIndex1: Number,
  arrayIndex2: Number,
  highlightColor: String,
  highlightDuration: Number,
  
  // Variables
  variableName: String,
  variableValue: mongoose.Schema.Types.Mixed,
  
  // Visualization
  description: String,
  descriptionTemplate: String,
  pauseDuration: Number,
  
  // Validation
  isValid: {
    type: Boolean,
    default: true,
  },
  errorMessage: String,
}, { _id: false });

// Script node schema
const scriptNodeSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: [
      'start', 'end', 'for-loop', 'if-condition', 'math-operation',
      'array-access', 'array-compare', 'array-swap', 'array-highlight',
      'variable-set', 'variable-get', 'counter-increment',
      'update-description', 'pause-execution'
    ],
    required: true,
  },
  position: {
    type: positionSchema,
    required: true,
  },
  data: {
    type: scriptNodeDataSchema,
    required: true,
  },
  inputs: [nodeIOSchema],
  outputs: [nodeIOSchema],
}, { _id: false });

// Connection schema
const connectionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  source: {
    type: String,
    required: true,
  },
  sourceHandle: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  targetHandle: {
    type: String,
    required: true,
  },
}, { _id: false });

// Algorithm metadata schema
const algorithmMetadataSchema = new mongoose.Schema({
  nodeCount: {
    type: Number,
    required: true,
  },
  connectionCount: {
    type: Number,
    required: true,
  },
  estimatedTime: String,
  complexity: {
    time: String,
    space: String,
    level: {
      type: String,
      enum: ['beginner', 'intermediate', 'advanced'],
      default: 'beginner',
    },
  },
  version: {
    type: String,
    default: '1.0.0',
  },
}, { _id: false });

// Main Algorithm schema
const algorithmSchema = new mongoose.Schema({
  // Basic Information
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    required: true,
    trim: true,
    maxlength: 1000,
  },
  
  // Categorization
  category: {
    type: String,
    enum: ['sorting', 'searching', 'graph', 'array', 'debug', 'custom'],
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'beginner',
  },
  dataStructureType: {
    type: String,
    enum: ['array', 'binaryTree', 'linkedList', 'weightedGraph'],
    default: 'array',
  },
  
  // Visual Scripting Data
  nodes: {
    type: [scriptNodeSchema],
    required: true,
    validate: {
      validator: function(nodes) {
        return nodes.length > 0;
      },
      message: 'Algorithm must have at least one node',
    },
  },
  connections: {
    type: [connectionSchema],
    default: [],
  },
  
  // Community Features
  tags: [{
    type: String,
    trim: true,
    maxlength: 30,
  }],
  likes: {
    type: Number,
    default: 0,
    min: 0,
  },
  likedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  }],
  downloads: {
    type: Number,
    default: 0,
    min: 0,
  },
  
  // Ownership and Visibility
  userId: {
    type: String, // For now, using string ID (can be changed to ObjectId when auth is implemented)
    required: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  isPublic: {
    type: Boolean,
    default: true,
  },
  
  // Metadata
  metadata: {
    type: algorithmMetadataSchema,
    required: true,
  },
  
  // Validation
  isValid: {
    type: Boolean,
    default: false,
  },
  validationErrors: [String],
  
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// Indexes for performance
algorithmSchema.index({ category: 1, difficulty: 1 });
algorithmSchema.index({ tags: 1 });
algorithmSchema.index({ userId: 1 });
algorithmSchema.index({ likes: -1 });
algorithmSchema.index({ createdAt: -1 });
algorithmSchema.index({ title: 'text', description: 'text', tags: 'text' });

// Virtual for like status (will be populated by middleware)
algorithmSchema.virtual('isLikedByUser').get(function() {
  return this._isLikedByUser || false;
});

// Pre-save middleware to update metadata
algorithmSchema.pre('save', function(next) {
  if (this.isModified('nodes') || this.isModified('connections')) {
    this.metadata.nodeCount = this.nodes.length;
    this.metadata.connectionCount = this.connections.length;
  }
  next();
});

// Static methods
algorithmSchema.statics.findPublic = function(filters = {}) {
  return this.find({ isPublic: true, ...filters });
};

algorithmSchema.statics.findByCategory = function(category) {
  return this.findPublic({ category });
};

algorithmSchema.statics.findByDifficulty = function(difficulty) {
  return this.findPublic({ difficulty });
};

// Instance methods
algorithmSchema.methods.toggleLike = function(userId) {
  const index = this.likedBy.indexOf(userId);
  if (index > -1) {
    this.likedBy.splice(index, 1);
    this.likes = Math.max(0, this.likes - 1);
    return false; // unliked
  } else {
    this.likedBy.push(userId);
    this.likes += 1;
    return true; // liked
  }
};

algorithmSchema.methods.incrementDownloads = function() {
  this.downloads += 1;
  return this.save();
};

module.exports = mongoose.model('Algorithm', algorithmSchema);
