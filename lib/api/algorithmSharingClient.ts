/**
 * API Client for Algorithm Sharing Backend
 * Handles all communication with the community sharing API
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export interface ShareAlgorithmData {
  title: string;
  description: string;
  category: 'sorting' | 'searching' | 'graph' | 'array' | 'debug' | 'custom';
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  dataStructureType?: 'array' | 'binaryTree' | 'linkedList' | 'weightedGraph';
  nodes: any[];
  connections: any[];
  tags?: string[];
  isPublic?: boolean;
  metadata?: {
    estimatedTime?: string;
    complexity?: {
      time?: string;
      space?: string;
    };
  };
}

export interface CommunityFilters {
  page?: number;
  limit?: number;
  category?: string;
  difficulty?: string;
  search?: string;
  sortBy?: 'createdAt' | 'likes' | 'downloads' | 'title';
  sortOrder?: 'asc' | 'desc';
  tags?: string | string[];
}

export interface CommunityAlgorithm {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  dataStructureType: string;
  nodes: any[];
  connections: any[];
  tags: string[];
  likes: number;
  downloads: number;
  userId: string;
  username: string;
  isPublic: boolean;
  metadata: {
    nodeCount: number;
    connectionCount: number;
    estimatedTime: string;
    complexity: {
      time: string;
      space: string;
      level: string;
    };
  };
  createdAt: string;
  updatedAt: string;
  isLikedByUser?: boolean;
}

export interface APIResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  errors?: any[];
}

export interface PaginatedResponse<T> {
  algorithms: T[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  filters: {
    category?: string;
    difficulty?: string;
    search?: string;
    tags: string[];
  };
}

export class AlgorithmSharingAPI {
  private static getHeaders(includeAuth = false): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // For development - replace with actual auth when implemented
    if (includeAuth) {
      headers['X-User-Id'] = process.env.NEXT_PUBLIC_DEV_USER_ID || 'dev-user-123';
      headers['X-Username'] = process.env.NEXT_PUBLIC_DEV_USERNAME || 'developer';
    }

    return headers;
  }

  private static async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: `HTTP ${response.status}: ${response.statusText}`
      }));

      // Handle rate limiting with specific error message
      if (response.status === 429) {
        throw new Error('Too many requests. Please wait a moment before trying again.');
      }

      throw new Error(errorData.message || `Request failed with status ${response.status}`);
    }

    return response.json();
  }

  private static async fetchWithRetry<T>(
    url: string,
    options: RequestInit,
    maxRetries: number = 3
  ): Promise<APIResponse<T>> {
    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);
        return await this.handleResponse<T>(response);
      } catch (error) {
        lastError = error as Error;

        // Don't retry on 4xx errors (except 429)
        if (error instanceof Error && error.message.includes('HTTP 4') && !error.message.includes('429')) {
          throw error;
        }

        // Don't retry on the last attempt
        if (attempt === maxRetries) {
          throw error;
        }

        // Exponential backoff: wait 1s, 2s, 4s
        const delay = Math.pow(2, attempt) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw lastError!;
  }

  /**
   * Share an algorithm with the community
   */
  static async shareAlgorithm(algorithmData: ShareAlgorithmData): Promise<APIResponse<{ algorithm: CommunityAlgorithm }>> {
    const response = await fetch(`${API_BASE_URL}/algorithms/share`, {
      method: 'POST',
      headers: this.getHeaders(true),
      body: JSON.stringify(algorithmData),
    });

    return this.handleResponse(response);
  }

  /**
   * Get community algorithms with filtering and pagination
   */
  static async getCommunityAlgorithms(params: CommunityFilters = {}): Promise<APIResponse<PaginatedResponse<CommunityAlgorithm>>> {
    const queryParams = new URLSearchParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v.toString()));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    return this.fetchWithRetry(
      `${API_BASE_URL}/algorithms/community?${queryParams}`,
      {
        headers: this.getHeaders(),
      }
    );
  }

  /**
   * Get a specific algorithm by ID
   */
  static async getAlgorithmById(id: string): Promise<APIResponse<{ algorithm: CommunityAlgorithm }>> {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}`, {
      headers: this.getHeaders(),
    });

    return this.handleResponse(response);
  }

  /**
   * Toggle like/unlike for an algorithm
   */
  static async toggleLike(id: string): Promise<APIResponse<{ isLiked: boolean; totalLikes: number }>> {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}/like`, {
      method: 'PUT',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  /**
   * Delete an algorithm (owner only)
   */
  static async deleteAlgorithm(id: string): Promise<APIResponse<{}>> {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}`, {
      method: 'DELETE',
      headers: this.getHeaders(true),
    });

    return this.handleResponse(response);
  }

  /**
   * Update an algorithm (owner only)
   */
  static async updateAlgorithm(id: string, updates: Partial<ShareAlgorithmData>): Promise<APIResponse<{ algorithm: CommunityAlgorithm }>> {
    const response = await fetch(`${API_BASE_URL}/algorithms/${id}`, {
      method: 'PUT',
      headers: this.getHeaders(true),
      body: JSON.stringify(updates),
    });

    return this.handleResponse(response);
  }

  /**
   * Get user's own algorithms
   */
  static async getMyAlgorithms(params: { page?: number; limit?: number } = {}): Promise<APIResponse<PaginatedResponse<CommunityAlgorithm>>> {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });

    const response = await fetch(
      `${API_BASE_URL}/algorithms?${queryParams}`,
      {
        headers: this.getHeaders(true),
      }
    );

    return this.handleResponse(response);
  }

  /**
   * Check if community features are enabled
   */
  static isCommunityEnabled(): boolean {
    return process.env.NEXT_PUBLIC_ENABLE_COMMUNITY_FEATURES === 'true';
  }

  /**
   * Get API base URL for debugging
   */
  static getBaseURL(): string {
    return API_BASE_URL;
  }
}
