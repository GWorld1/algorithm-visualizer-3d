# Algorithm Sharing Backend API

A Node.js/Express backend API for the 3D Algorithm Visualizer community sharing platform. This API enables users to share, discover, and interact with visual scripting algorithms created in the Algorithm Visualizer application.

## 🚀 Features

- **Algorithm Sharing**: Share visual scripting algorithms with the community
- **Community Discovery**: Browse and search shared algorithms with filtering
- **Social Features**: Like algorithms and track downloads
- **User Management**: Authentication and user profiles
- **Data Validation**: Comprehensive validation for algorithm structures
- **MongoDB Integration**: Efficient data storage and retrieval
- **CORS Support**: Ready for frontend integration

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn package manager

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd algorithm-sharing-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` file with your configuration:
   ```env
   PORT=5000
   NODE_ENV=development
   MONGODB_URI=mongodb://localhost:27017/algorithm-visualizer
   JWT_SECRET=your-super-secret-jwt-key
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start MongoDB**
   Make sure MongoDB is running on your system.

5. **Run the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
For development, the API uses header-based user identification:
```
X-User-Id: your-user-id
X-Username: your-username
```

### Core Endpoints

#### 🔄 Algorithm Sharing

**Share Algorithm**
```http
POST /api/algorithms/share
Content-Type: application/json
X-User-Id: user123
X-Username: developer

{
  "title": "Bubble Sort Visualization",
  "description": "A visual implementation of bubble sort algorithm",
  "category": "sorting",
  "difficulty": "beginner",
  "dataStructureType": "array",
  "nodes": [
    {
      "id": "node_1",
      "type": "start",
      "position": { "x": 100, "y": 200 },
      "data": { "label": "Start" }
    }
  ],
  "connections": [],
  "tags": ["sorting", "beginner", "array"],
  "isPublic": true
}
```

**Get Community Algorithms**
```http
GET /api/algorithms/community?page=1&limit=12&category=sorting&difficulty=beginner
```

**Get Specific Algorithm**
```http
GET /api/algorithms/:id
```

**Like/Unlike Algorithm**
```http
PUT /api/algorithms/:id/like
X-User-Id: user123
```

**Delete Algorithm**
```http
DELETE /api/algorithms/:id
X-User-Id: user123
```

#### 👤 User Management

**Register User**
```http
POST /api/auth/register
Content-Type: application/json

{
  "username": "developer",
  "email": "dev@example.com",
  "password": "securepassword"
}
```

**Login**
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "dev@example.com",
  "password": "securepassword"
}
```

## 🗄️ Database Schema

### Algorithm Document
```javascript
{
  title: String,
  description: String,
  category: String, // 'sorting', 'searching', 'graph', 'array', 'debug', 'custom'
  difficulty: String, // 'beginner', 'intermediate', 'advanced'
  dataStructureType: String, // 'array', 'binaryTree', 'linkedList', 'weightedGraph'
  nodes: [ScriptNode],
  connections: [Connection],
  tags: [String],
  likes: Number,
  downloads: Number,
  userId: String,
  username: String,
  isPublic: Boolean,
  metadata: {
    nodeCount: Number,
    connectionCount: Number,
    estimatedTime: String,
    complexity: {
      time: String,
      space: String,
      level: String
    }
  },
  createdAt: Date,
  updatedAt: Date
}
```

### Node Structure
```javascript
{
  id: String,
  type: String, // 'start', 'end', 'for-loop', 'if-condition', etc.
  position: { x: Number, y: Number },
  data: {
    label: String,
    // Node-specific data fields
    condition: String,
    loopStart: Number,
    arrayIndex1: Number,
    // ... other fields
  }
}
```

## 🔧 Integration with Frontend

### Visual Scripting Store Integration

The API is designed to work seamlessly with the existing `useVisualScriptingStore.ts`:

```typescript
// Frontend: Share algorithm from visual scripting store
const shareAlgorithm = async () => {
  const currentAlgorithm = useVisualScriptingStore.getState().exportAlgorithm();
  
  const response = await fetch('/api/algorithms/share', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': 'user123',
      'X-Username': 'developer'
    },
    body: JSON.stringify({
      title: 'My Algorithm',
      description: 'Algorithm description',
      category: 'sorting',
      nodes: currentAlgorithm.nodes,
      connections: currentAlgorithm.connections,
      tags: ['sorting', 'beginner']
    })
  });
};

// Frontend: Load community algorithm into editor
const loadCommunityAlgorithm = async (algorithmId) => {
  const response = await fetch(`/api/algorithms/${algorithmId}`);
  const { data } = await response.json();
  
  useVisualScriptingStore.getState().importAlgorithm({
    id: data.algorithm._id,
    name: data.algorithm.title,
    description: data.algorithm.description,
    dataStructureType: data.algorithm.dataStructureType,
    nodes: data.algorithm.nodes,
    connections: data.algorithm.connections,
    isValid: data.algorithm.isValid
  });
};
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

1. **Environment Variables**
   Set production environment variables:
   ```env
   NODE_ENV=production
   MONGODB_URI=mongodb://your-production-db
   JWT_SECRET=your-production-secret
   ```

2. **Build and Start**
   ```bash
   npm start
   ```

## 📁 Project Structure

```
src/
├── config/
│   └── database.js          # MongoDB connection
├── controllers/
│   ├── algorithmController.js
│   └── authController.js
├── middleware/
│   ├── auth.js              # Authentication middleware
│   ├── validation.js        # Input validation
│   └── errorHandler.js      # Error handling
├── models/
│   ├── Algorithm.js         # Algorithm schema
│   └── User.js             # User schema
├── routes/
│   ├── algorithms.js        # Algorithm routes
│   └── auth.js             # Auth routes
├── utils/
│   └── algorithmConverter.js # Format conversion utilities
└── server.js               # Main application file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the API documentation
- Review the integration examples
