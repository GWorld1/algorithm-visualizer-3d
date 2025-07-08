const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../src/server');
const Algorithm = require('../src/models/Algorithm');

describe('Algorithm API', () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  beforeEach(async () => {
    await Algorithm.deleteMany({});
  });

  const sampleAlgorithm = {
    title: 'Test Bubble Sort',
    description: 'A test implementation of bubble sort',
    category: 'sorting',
    difficulty: 'beginner',
    dataStructureType: 'array',
    nodes: [
      {
        id: 'start-1',
        type: 'start',
        position: { x: 100, y: 200 },
        data: { label: 'Start' }
      },
      {
        id: 'end-1',
        type: 'end',
        position: { x: 300, y: 200 },
        data: { label: 'End' }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        source: 'start-1',
        sourceHandle: 'exec-out',
        target: 'end-1',
        targetHandle: 'exec-in'
      }
    ],
    tags: ['sorting', 'beginner'],
    isPublic: true
  };

  describe('POST /api/algorithms/share', () => {
    it('should share a new algorithm successfully', async () => {
      const response = await request(app)
        .post('/api/algorithms/share')
        .set('X-User-Id', 'test-user-123')
        .set('X-Username', 'testuser')
        .send(sampleAlgorithm)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithm.title).toBe(sampleAlgorithm.title);
      expect(response.body.data.algorithm.userId).toBe('test-user-123');
      expect(response.body.data.algorithm.username).toBe('testuser');
    });

    it('should validate required fields', async () => {
      const invalidAlgorithm = { ...sampleAlgorithm };
      delete invalidAlgorithm.title;

      const response = await request(app)
        .post('/api/algorithms/share')
        .set('X-User-Id', 'test-user-123')
        .set('X-Username', 'testuser')
        .send(invalidAlgorithm)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Validation failed');
    });

    it('should validate algorithm structure', async () => {
      const invalidAlgorithm = {
        ...sampleAlgorithm,
        nodes: [] // Empty nodes array
      };

      const response = await request(app)
        .post('/api/algorithms/share')
        .set('X-User-Id', 'test-user-123')
        .set('X-Username', 'testuser')
        .send(invalidAlgorithm)
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/algorithms/community', () => {
    beforeEach(async () => {
      // Create test algorithms
      await Algorithm.create([
        {
          ...sampleAlgorithm,
          title: 'Bubble Sort',
          category: 'sorting',
          difficulty: 'beginner',
          userId: 'user1',
          username: 'user1'
        },
        {
          ...sampleAlgorithm,
          title: 'Quick Sort',
          category: 'sorting',
          difficulty: 'advanced',
          userId: 'user2',
          username: 'user2'
        },
        {
          ...sampleAlgorithm,
          title: 'Binary Search',
          category: 'searching',
          difficulty: 'intermediate',
          userId: 'user3',
          username: 'user3'
        }
      ]);
    });

    it('should get all public algorithms', async () => {
      const response = await request(app)
        .get('/api/algorithms/community')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithms).toHaveLength(3);
      expect(response.body.data.pagination.totalItems).toBe(3);
    });

    it('should filter by category', async () => {
      const response = await request(app)
        .get('/api/algorithms/community?category=sorting')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithms).toHaveLength(2);
      expect(response.body.data.algorithms.every(alg => alg.category === 'sorting')).toBe(true);
    });

    it('should filter by difficulty', async () => {
      const response = await request(app)
        .get('/api/algorithms/community?difficulty=beginner')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithms).toHaveLength(1);
      expect(response.body.data.algorithms[0].difficulty).toBe('beginner');
    });

    it('should support pagination', async () => {
      const response = await request(app)
        .get('/api/algorithms/community?page=1&limit=2')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithms).toHaveLength(2);
      expect(response.body.data.pagination.currentPage).toBe(1);
      expect(response.body.data.pagination.totalPages).toBe(2);
    });

    it('should sort algorithms', async () => {
      const response = await request(app)
        .get('/api/algorithms/community?sortBy=title&sortOrder=asc')
        .expect(200);

      expect(response.body.success).toBe(true);
      const titles = response.body.data.algorithms.map(alg => alg.title);
      expect(titles).toEqual(['Binary Search', 'Bubble Sort', 'Quick Sort']);
    });
  });

  describe('GET /api/algorithms/:id', () => {
    let algorithmId;

    beforeEach(async () => {
      const algorithm = await Algorithm.create({
        ...sampleAlgorithm,
        userId: 'test-user-123',
        username: 'testuser'
      });
      algorithmId = algorithm._id.toString();
    });

    it('should get algorithm by ID', async () => {
      const response = await request(app)
        .get(`/api/algorithms/${algorithmId}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.algorithm.title).toBe(sampleAlgorithm.title);
    });

    it('should return 404 for non-existent algorithm', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/algorithms/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Algorithm not found');
    });
  });

  describe('PUT /api/algorithms/:id/like', () => {
    let algorithmId;

    beforeEach(async () => {
      const algorithm = await Algorithm.create({
        ...sampleAlgorithm,
        userId: 'test-user-123',
        username: 'testuser'
      });
      algorithmId = algorithm._id.toString();
    });

    it('should like an algorithm', async () => {
      const response = await request(app)
        .put(`/api/algorithms/${algorithmId}/like`)
        .set('X-User-Id', 'liker-user-456')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isLiked).toBe(true);
      expect(response.body.data.totalLikes).toBe(1);
    });

    it('should unlike an algorithm', async () => {
      // First like
      await request(app)
        .put(`/api/algorithms/${algorithmId}/like`)
        .set('X-User-Id', 'liker-user-456');

      // Then unlike
      const response = await request(app)
        .put(`/api/algorithms/${algorithmId}/like`)
        .set('X-User-Id', 'liker-user-456')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.isLiked).toBe(false);
      expect(response.body.data.totalLikes).toBe(0);
    });
  });

  describe('DELETE /api/algorithms/:id', () => {
    let algorithmId;

    beforeEach(async () => {
      const algorithm = await Algorithm.create({
        ...sampleAlgorithm,
        userId: 'test-user-123',
        username: 'testuser'
      });
      algorithmId = algorithm._id.toString();
    });

    it('should delete own algorithm', async () => {
      const response = await request(app)
        .delete(`/api/algorithms/${algorithmId}`)
        .set('X-User-Id', 'test-user-123')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Algorithm deleted successfully');

      // Verify deletion
      const algorithm = await Algorithm.findById(algorithmId);
      expect(algorithm).toBeNull();
    });

    it('should not delete other user\'s algorithm', async () => {
      const response = await request(app)
        .delete(`/api/algorithms/${algorithmId}`)
        .set('X-User-Id', 'other-user-456')
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Access denied. You can only delete your own algorithms.');
    });
  });
});
