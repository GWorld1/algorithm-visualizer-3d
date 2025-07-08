const { body, param, query, validationResult } = require('express-validator');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value,
      })),
    });
  }
  next();
};

// Algorithm validation rules
const validateAlgorithmShare = [
  body('title')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .isIn(['sorting', 'searching', 'graph', 'array', 'debug', 'custom'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  
  body('dataStructureType')
    .optional()
    .isIn(['array', 'binaryTree', 'linkedList', 'weightedGraph'])
    .withMessage('Invalid data structure type'),
  
  body('nodes')
    .isArray({ min: 1 })
    .withMessage('Algorithm must have at least one node'),
  
  body('nodes.*.id')
    .isString()
    .notEmpty()
    .withMessage('Node ID is required'),
  
  body('nodes.*.type')
    .isIn([
      'start', 'end', 'for-loop', 'if-condition', 'math-operation',
      'array-access', 'array-compare', 'array-swap', 'array-highlight',
      'variable-set', 'variable-get', 'counter-increment',
      'update-description', 'pause-execution'
    ])
    .withMessage('Invalid node type'),
  
  body('nodes.*.position')
    .isObject()
    .withMessage('Node position is required'),
  
  body('nodes.*.position.x')
    .isNumeric()
    .withMessage('Node position x must be a number'),
  
  body('nodes.*.position.y')
    .isNumeric()
    .withMessage('Node position y must be a number'),
  
  body('nodes.*.data')
    .isObject()
    .withMessage('Node data is required'),
  
  body('nodes.*.data.label')
    .isString()
    .notEmpty()
    .withMessage('Node label is required'),
  
  body('connections')
    .optional()
    .isArray()
    .withMessage('Connections must be an array'),
  
  body('connections.*.id')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('Connection ID is required'),
  
  body('connections.*.source')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('Connection source is required'),
  
  body('connections.*.target')
    .optional()
    .isString()
    .notEmpty()
    .withMessage('Connection target is required'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  
  body('metadata')
    .optional()
    .isObject()
    .withMessage('Metadata must be an object'),
  
  body('metadata.estimatedTime')
    .optional()
    .isString()
    .withMessage('Estimated time must be a string'),
  
  handleValidationErrors,
];

// Algorithm update validation (similar but optional fields)
const validateAlgorithmUpdate = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ min: 10, max: 1000 })
    .withMessage('Description must be between 10 and 1000 characters'),
  
  body('category')
    .optional()
    .isIn(['sorting', 'searching', 'graph', 'array', 'debug', 'custom'])
    .withMessage('Invalid category'),
  
  body('difficulty')
    .optional()
    .isIn(['beginner', 'intermediate', 'advanced'])
    .withMessage('Invalid difficulty level'),
  
  body('tags')
    .optional()
    .isArray()
    .withMessage('Tags must be an array'),
  
  body('tags.*')
    .optional()
    .trim()
    .isLength({ min: 1, max: 30 })
    .withMessage('Each tag must be between 1 and 30 characters'),
  
  body('isPublic')
    .optional()
    .isBoolean()
    .withMessage('isPublic must be a boolean'),
  
  handleValidationErrors,
];

// Query parameter validation for community algorithms
const validateCommunityQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 50 })
    .withMessage('Limit must be between 1 and 50'),
  
  query('category')
    .optional()
    .custom((value) => {
      return value === '' || ['sorting', 'searching', 'graph', 'array', 'debug', 'custom'].includes(value);
    })
    .withMessage('Invalid category'),

  query('difficulty')
    .optional()
    .custom((value) => {
      return value === '' || ['beginner', 'intermediate', 'advanced'].includes(value);
    })
    .withMessage('Invalid difficulty level'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'likes', 'downloads', 'title'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  query('search')
    .optional()
    .trim()
    .custom((value) => {
      // Allow empty string or valid length
      return value === '' || (value.length >= 1 && value.length <= 100);
    })
    .withMessage('Search query must be between 1 and 100 characters'),
  
  query('tags')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') {
        return true; // Single tag
      }
      if (Array.isArray(value)) {
        return value.every(tag => typeof tag === 'string' && tag.length <= 30);
      }
      return false;
    })
    .withMessage('Tags must be strings with max 30 characters'),
  
  handleValidationErrors,
];

// MongoDB ObjectId validation
const validateObjectId = (paramName = 'id') => [
  param(paramName)
    .isMongoId()
    .withMessage(`Invalid ${paramName} format`),
  
  handleValidationErrors,
];

// User registration validation
const validateUserRegistration = [
  body('username')
    .trim()
    .isLength({ min: 3, max: 30 })
    .matches(/^[a-zA-Z0-9_-]+$/)
    .withMessage('Username must be 3-30 characters and contain only letters, numbers, underscores, and hyphens'),
  
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  
  handleValidationErrors,
];

// User login validation
const validateUserLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors,
];

module.exports = {
  validateAlgorithmShare,
  validateAlgorithmUpdate,
  validateCommunityQuery,
  validateObjectId,
  validateUserRegistration,
  validateUserLogin,
  handleValidationErrors,
};
