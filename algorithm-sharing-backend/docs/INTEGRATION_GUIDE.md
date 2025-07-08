# Frontend Integration Guide

This guide explains how to integrate the Algorithm Sharing Backend API with your existing 3D Algorithm Visualizer frontend application.

## 🔗 Quick Integration

### 1. Environment Setup

Add these environment variables to your frontend `.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000/api
NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES=true
```

### 2. API Client Setup

Create an API client utility:

```typescript
// lib/api/algorithmSharingClient.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export class AlgorithmSharingAPI {
  private static getHeaders(includeAuth = false) {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // For development - replace with actual auth when implemented
    if (includeAuth) {
      headers['X-User-Id'] = 'dev-user-123';
      headers['X-Username'] = 'developer';
    }

    return headers;
  }

  static async shareAlgorithm(algorithmData: any) {
    const response = await fetch(`${API_BASE_URL}/algorithms/share`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(algorithmData),
    });

    if (!response.ok) {
      throw new Error(`Failed to share algorithm: ${response.statusText}`);
    }

    return response.json();
  }

  static async getCommunityAlgorithms(params: {
    page?: number;
    limit?: number;
    category?: string;
    difficulty?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
  } = {}) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/algorithms/community?${queryParams}`,
      {
        headers: this.getHeaders(),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch community algorithms: ${response.statusText}`);
    }

    return response.json();
  }

  static async getAlgorithmById(id: string) {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}`, {
      headers: this.getHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch algorithm: ${response.statusText}`);
    }

    return response.json();
  }

  static async toggleLike(id: string) {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}/like`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to toggle like: ${response.statusText}`);
    }

    return response.json();
  }

  static async deleteAlgorithm(id: string) {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete algorithm: ${response.statusText}`);
    }

    return response.json();
  }
}
```

### 3. Visual Scripting Store Integration

Extend your existing `useVisualScriptingStore.ts`:

```typescript
// Add to your existing store
interface VisualScriptingState {
  // ... existing state
  
  // Community features
  communityAlgorithms: CommunityAlgorithm[];
  isLoadingCommunity: boolean;
  communityError: string | null;
  
  // Actions
  shareCurrentAlgorithm: (metadata: ShareMetadata) => Promise<void>;
  loadCommunityAlgorithms: (filters?: CommunityFilters) => Promise<void>;
  importCommunityAlgorithm: (algorithmId: string) => Promise<void>;
  toggleAlgorithmLike: (algorithmId: string) => Promise<void>;
}

interface ShareMetadata {
  title: string;
  description: string;
  category: 'sorting' | 'searching' | 'graph' | 'array' | 'debug' | 'custom';
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  tags: string[];
  isPublic: boolean;
}

interface CommunityFilters {
  category?: string;
  difficulty?: string;
  search?: string;
  page?: number;
  limit?: number;
}

// Add these actions to your store
export const useVisualScriptingStore = create<VisualScriptingState>((set, get) => ({
  // ... existing state and actions
  
  communityAlgorithms: [],
  isLoadingCommunity: false,
  communityError: null,

  shareCurrentAlgorithm: async (metadata: ShareMetadata) => {
    const state = get();
    
    if (!state.currentAlgorithm) {
      throw new Error('No algorithm to share');
    }

    const validation = state.validateScript();
    if (!validation.isValid) {
      throw new Error('Algorithm must be valid before sharing');
    }

    try {
      const shareData = {
        ...metadata,
        dataStructureType: state.currentAlgorithm.dataStructureType,
        nodes: state.nodes,
        connections: state.connections,
      };

      const result = await AlgorithmSharingAPI.shareAlgorithm(shareData);
      
      // Optionally update local state or show success message
      console.log('Algorithm shared successfully:', result);
      
      return result;
    } catch (error) {
      console.error('Failed to share algorithm:', error);
      throw error;
    }
  },

  loadCommunityAlgorithms: async (filters: CommunityFilters = {}) => {
    set({ isLoadingCommunity: true, communityError: null });
    
    try {
      const result = await AlgorithmSharingAPI.getCommunityAlgorithms(filters);
      
      set({
        communityAlgorithms: result.data.algorithms,
        isLoadingCommunity: false,
      });
    } catch (error) {
      set({
        communityError: error.message,
        isLoadingCommunity: false,
      });
    }
  },

  importCommunityAlgorithm: async (algorithmId: string) => {
    try {
      const result = await AlgorithmSharingAPI.getAlgorithmById(algorithmId);
      const algorithm = result.data.algorithm;
      
      // Convert to CustomAlgorithm format
      const customAlgorithm: CustomAlgorithm = {
        id: algorithm._id,
        name: algorithm.title,
        description: algorithm.description,
        dataStructureType: algorithm.dataStructureType,
        nodes: algorithm.nodes,
        connections: algorithm.connections,
        isValid: algorithm.isValid,
      };
      
      // Import into editor
      get().importAlgorithm(customAlgorithm);
      
    } catch (error) {
      console.error('Failed to import community algorithm:', error);
      throw error;
    }
  },

  toggleAlgorithmLike: async (algorithmId: string) => {
    try {
      const result = await AlgorithmSharingAPI.toggleLike(algorithmId);
      
      // Update local state
      set(state => ({
        communityAlgorithms: state.communityAlgorithms.map(alg =>
          alg._id === algorithmId
            ? { ...alg, likes: result.data.totalLikes, isLikedByUser: result.data.isLiked }
            : alg
        ),
      }));
      
      return result;
    } catch (error) {
      console.error('Failed to toggle like:', error);
      throw error;
    }
  },
}));
```

### 4. UI Components

Create community features components:

```typescript
// components/community/ShareAlgorithmModal.tsx
import { useState } from 'react';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';

export const ShareAlgorithmModal = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'custom',
    difficulty: 'beginner',
    tags: [],
    isPublic: true,
  });
  const [isSharing, setIsSharing] = useState(false);
  
  const shareCurrentAlgorithm = useVisualScriptingStore(state => state.shareCurrentAlgorithm);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      await shareCurrentAlgorithm(formData);
      onClose();
      // Show success message
    } catch (error) {
      // Show error message
    } finally {
      setIsSharing(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Share Algorithm with Community</h2>
        
        <input
          type="text"
          placeholder="Algorithm Title"
          value={formData.title}
          onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
        />
        
        <textarea
          placeholder="Description"
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
        />
        
        <select
          value={formData.category}
          onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="sorting">Sorting</option>
          <option value="searching">Searching</option>
          <option value="graph">Graph</option>
          <option value="array">Array</option>
          <option value="custom">Custom</option>
        </select>
        
        <select
          value={formData.difficulty}
          onChange={(e) => setFormData(prev => ({ ...prev, difficulty: e.target.value }))}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
        
        <div className="modal-actions">
          <button onClick={onClose} disabled={isSharing}>
            Cancel
          </button>
          <button onClick={handleShare} disabled={isSharing}>
            {isSharing ? 'Sharing...' : 'Share Algorithm'}
          </button>
        </div>
      </div>
    </div>
  );
};
```

```typescript
// components/community/CommunityBrowser.tsx
import { useEffect, useState } from 'react';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';

export const CommunityBrowser = () => {
  const {
    communityAlgorithms,
    isLoadingCommunity,
    loadCommunityAlgorithms,
    importCommunityAlgorithm,
    toggleAlgorithmLike,
  } = useVisualScriptingStore();

  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    search: '',
  });

  useEffect(() => {
    loadCommunityAlgorithms(filters);
  }, [filters]);

  const handleImport = async (algorithmId: string) => {
    try {
      await importCommunityAlgorithm(algorithmId);
      // Show success message or navigate to editor
    } catch (error) {
      // Show error message
    }
  };

  const handleLike = async (algorithmId: string) => {
    try {
      await toggleAlgorithmLike(algorithmId);
    } catch (error) {
      // Show error message
    }
  };

  if (isLoadingCommunity) {
    return <div>Loading community algorithms...</div>;
  }

  return (
    <div className="community-browser">
      <div className="filters">
        <input
          type="text"
          placeholder="Search algorithms..."
          value={filters.search}
          onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
        />
        
        <select
          value={filters.category}
          onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
        >
          <option value="">All Categories</option>
          <option value="sorting">Sorting</option>
          <option value="searching">Searching</option>
          <option value="graph">Graph</option>
          <option value="array">Array</option>
        </select>
        
        <select
          value={filters.difficulty}
          onChange={(e) => setFilters(prev => ({ ...prev, difficulty: e.target.value }))}
        >
          <option value="">All Difficulties</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      <div className="algorithm-grid">
        {communityAlgorithms.map((algorithm) => (
          <div key={algorithm._id} className="algorithm-card">
            <h3>{algorithm.title}</h3>
            <p>{algorithm.description}</p>
            <div className="algorithm-meta">
              <span className="category">{algorithm.category}</span>
              <span className="difficulty">{algorithm.difficulty}</span>
              <span className="author">by {algorithm.username}</span>
            </div>
            <div className="algorithm-stats">
              <button
                onClick={() => handleLike(algorithm._id)}
                className={algorithm.isLikedByUser ? 'liked' : ''}
              >
                ❤️ {algorithm.likes}
              </button>
              <span>📥 {algorithm.downloads}</span>
            </div>
            <div className="algorithm-actions">
              <button onClick={() => handleImport(algorithm._id)}>
                Import to Editor
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
```

### 5. Integration Points

Add community features to your existing components:

```typescript
// In your VisualScriptingEditor component
import { ShareAlgorithmModal } from '@/components/community/ShareAlgorithmModal';

// Add share button to toolbar
<button
  onClick={() => setShowShareModal(true)}
  className="toolbar-button"
  title="Share with Community"
>
  🌐 Share
</button>

// Add modal
<ShareAlgorithmModal
  isOpen={showShareModal}
  onClose={() => setShowShareModal(false)}
/>
```

### 6. Navigation Integration

Add community section to your main navigation:

```typescript
// In your main layout or navigation component
<nav>
  <Link href="/editor">Visual Editor</Link>
  <Link href="/community">Community</Link>
  <Link href="/my-algorithms">My Algorithms</Link>
</nav>
```

## 🚀 Advanced Features

### Real-time Updates (Optional)

For real-time like counts and new algorithms, you can implement WebSocket connections or use polling:

```typescript
// Real-time updates with polling
useEffect(() => {
  const interval = setInterval(() => {
    if (isVisible) {
      loadCommunityAlgorithms(currentFilters);
    }
  }, 30000); // Refresh every 30 seconds

  return () => clearInterval(interval);
}, [isVisible, currentFilters]);
```

### Offline Support

Cache community algorithms for offline viewing:

```typescript
// Use localStorage or IndexedDB to cache algorithms
const cacheAlgorithms = (algorithms) => {
  localStorage.setItem('cached_community_algorithms', JSON.stringify({
    data: algorithms,
    timestamp: Date.now(),
  }));
};

const getCachedAlgorithms = () => {
  const cached = localStorage.getItem('cached_community_algorithms');
  if (cached) {
    const { data, timestamp } = JSON.parse(cached);
    // Return cached data if less than 1 hour old
    if (Date.now() - timestamp < 3600000) {
      return data;
    }
  }
  return null;
};
```

## 🔧 Error Handling

Implement comprehensive error handling:

```typescript
// Error handling utility
export const handleAPIError = (error: any) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || 'Server error occurred';
    return { type: 'server', message };
  } else if (error.request) {
    // Network error
    return { type: 'network', message: 'Network error. Please check your connection.' };
  } else {
    // Other error
    return { type: 'client', message: error.message || 'An unexpected error occurred' };
  }
};
```

This integration guide provides a complete foundation for connecting your frontend with the Algorithm Sharing Backend API. The implementation is designed to be incremental - you can start with basic sharing and gradually add more advanced features.
