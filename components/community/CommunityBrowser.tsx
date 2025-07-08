"use client"

import { useEffect, useState, useCallback, useRef } from 'react';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';
import { CommunityFilters } from '@/lib/api/algorithmSharingClient';
import { generateAlgorithmPreview } from '@/lib/api/algorithmConverter';
import { useToast } from '@/components/ui/toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { 
  Heart, 
  Download, 
  Search, 
  Filter, 
  RefreshCw, 
  Import, 
  User, 
  Calendar,
  Clock,
  Code,
  AlertCircle,
  Loader2
} from 'lucide-react';

interface CommunityBrowserProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CommunityBrowser = ({ isOpen, onClose }: CommunityBrowserProps) => {
  const {
    communityAlgorithms,
    isLoadingCommunity,
    communityError,
    currentCommunityFilters,
    communityPagination,
    loadCommunityAlgorithms,
    importCommunityAlgorithm,
    toggleAlgorithmLike,
    setCommunityFilters,
    clearCommunityError,
  } = useVisualScriptingStore();

  const { addToast } = useToast();

  const [localFilters, setLocalFilters] = useState<CommunityFilters>({
    page: 1,
    limit: 12,
    category: '',
    difficulty: '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });

  const [searchInput, setSearchInput] = useState('');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Load algorithms when component mounts or when modal opens
  useEffect(() => {
    if (isOpen) {
      loadCommunityAlgorithms(localFilters);
    }
  }, [isOpen]); // Removed localFilters and loadCommunityAlgorithms from dependencies to prevent infinite loop

  // Initialize local filters from store only once when component mounts
  useEffect(() => {
    if (currentCommunityFilters && Object.keys(currentCommunityFilters).length > 0) {
      setLocalFilters(prev => ({ ...prev, ...currentCommunityFilters }));
    }
  }, []); // Empty dependency array - only run once on mount

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Debounced filter change to prevent excessive API calls
  const debouncedLoadAlgorithms = useCallback((filters: CommunityFilters) => {
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(() => {
      loadCommunityAlgorithms(filters);
    }, 300); // 300ms debounce
  }, [loadCommunityAlgorithms]);

  const handleFilterChange = (key: keyof CommunityFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value, page: 1 }; // Reset to page 1 when filtering
    setLocalFilters(newFilters);
    setCommunityFilters(newFilters);

    // Use debounced API call for filter changes
    debouncedLoadAlgorithms(newFilters);
  };

  const handleSearch = () => {
    handleFilterChange('search', searchInput.trim());
  };

  const handleSearchKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handlePageChange = (newPage: number) => {
    const newFilters = { ...localFilters, page: newPage };
    setLocalFilters(newFilters);
    setCommunityFilters(newFilters);
  };

  const handleImport = async (algorithmId: string, algorithmTitle: string) => {
    try {
      await importCommunityAlgorithm(algorithmId);
      
      addToast({
        title: 'Algorithm Imported!',
        description: `"${algorithmTitle}" has been imported to your visual scripting editor.`,
        type: 'success',
      });

      onClose(); // Close the browser after successful import
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to import algorithm';
      addToast({
        title: 'Import Failed',
        description: errorMessage,
        type: 'error',
      });
    }
  };

  const handleLike = async (algorithmId: string) => {
    try {
      await toggleAlgorithmLike(algorithmId);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to toggle like';
      addToast({
        title: 'Action Failed',
        description: errorMessage,
        type: 'error',
      });
    }
  };

  const handleRefresh = () => {
    clearCommunityError();
    loadCommunityAlgorithms(localFilters);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-green-100 text-green-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'sorting': return 'bg-blue-100 text-blue-800';
      case 'searching': return 'bg-purple-100 text-purple-800';
      case 'graph': return 'bg-indigo-100 text-indigo-800';
      case 'array': return 'bg-orange-100 text-orange-800';
      case 'debug': return 'bg-gray-100 text-gray-800';
      default: return 'bg-cyan-100 text-cyan-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Code className="h-5 w-5" />
            Community Algorithm Browser
          </DialogTitle>
          <DialogDescription>
            Discover and import algorithms shared by the community
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="flex flex-col gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex flex-wrap gap-4 items-end">
            {/* Search */}
            <div className="flex-1 min-w-[200px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Search algorithms..."
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyPress={handleSearchKeyPress}
                />
                <Button onClick={handleSearch} size="sm">
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Category Filter */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <Select value={localFilters.category || 'all'} onValueChange={(value) => handleFilterChange('category', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="sorting">Sorting</SelectItem>
                  <SelectItem value="searching">Searching</SelectItem>
                  <SelectItem value="graph">Graph</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Difficulty Filter */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
              <Select value={localFilters.difficulty || 'all'} onValueChange={(value) => handleFilterChange('difficulty', value === 'all' ? undefined : value)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Levels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Levels</SelectItem>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Sort */}
            <div className="min-w-[150px]">
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
              <Select value={`${localFilters.sortBy}-${localFilters.sortOrder}`} onValueChange={(value) => {
                const [sortBy, sortOrder] = value.split('-');
                handleFilterChange('sortBy', sortBy);
                handleFilterChange('sortOrder', sortOrder);
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest First</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                  <SelectItem value="likes-desc">Most Liked</SelectItem>
                  <SelectItem value="downloads-desc">Most Downloaded</SelectItem>
                  <SelectItem value="title-asc">Title A-Z</SelectItem>
                  <SelectItem value="title-desc">Title Z-A</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Refresh Button */}
            <Button onClick={handleRefresh} variant="outline" size="sm" disabled={isLoadingCommunity}>
              <RefreshCw className={`h-4 w-4 ${isLoadingCommunity ? 'animate-spin' : ''}`} />
            </Button>
          </div>
        </div>

        {/* Error Display */}
        {communityError && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <div>
              <p className="text-red-800 font-medium">Failed to load community algorithms</p>
              <p className="text-red-600 text-sm">{communityError}</p>
            </div>
            <Button onClick={handleRefresh} variant="outline" size="sm" className="ml-auto">
              Try Again
            </Button>
          </div>
        )}

        {/* Loading State */}
        {isLoadingCommunity && (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">Loading community algorithms...</span>
          </div>
        )}

        {/* Algorithm Grid */}
        {!isLoadingCommunity && !communityError && (
          <div className="flex-1 overflow-y-auto">
            {communityAlgorithms.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-gray-500">
                <Code className="h-12 w-12 mb-4" />
                <p className="text-lg font-medium">No algorithms found</p>
                <p className="text-sm">Try adjusting your search filters</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
                {communityAlgorithms.map((algorithm) => {
                  const preview = generateAlgorithmPreview(algorithm);
                  
                  return (
                    <Card key={algorithm._id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">{algorithm.title}</CardTitle>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleLike(algorithm._id)}
                            className={`ml-2 ${algorithm.isLikedByUser ? 'text-red-500' : 'text-gray-400'}`}
                          >
                            <Heart className={`h-4 w-4 ${algorithm.isLikedByUser ? 'fill-current' : ''}`} />
                            <span className="ml-1 text-xs">{algorithm.likes}</span>
                          </Button>
                        </div>
                        <CardDescription className="line-clamp-3">
                          {algorithm.description}
                        </CardDescription>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        {/* Badges */}
                        <div className="flex flex-wrap gap-2">
                          <Badge className={getDifficultyColor(algorithm.difficulty)}>
                            {algorithm.difficulty}
                          </Badge>
                          <Badge className={getCategoryColor(algorithm.category)}>
                            {algorithm.category}
                          </Badge>
                        </div>

                        {/* Tags */}
                        {algorithm.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {algorithm.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {algorithm.tags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{algorithm.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}

                        {/* Metadata */}
                        <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                          <div className="flex items-center gap-1">
                            <Code className="h-3 w-3" />
                            {preview.nodeCount} nodes
                          </div>
                          <div className="flex items-center gap-1">
                            <Download className="h-3 w-3" />
                            {algorithm.downloads}
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {algorithm.username}
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {formatDate(algorithm.createdAt)}
                          </div>
                        </div>

                        {/* Complexity */}
                        {algorithm.metadata.complexity && (
                          <div className="text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              Time: {algorithm.metadata.complexity.time}, Space: {algorithm.metadata.complexity.space}
                            </div>
                          </div>
                        )}
                      </CardContent>

                      <CardFooter>
                        <Button
                          onClick={() => handleImport(algorithm._id, algorithm.title)}
                          className="w-full"
                          size="sm"
                        >
                          <Import className="h-4 w-4 mr-2" />
                          Import to Editor
                        </Button>
                      </CardFooter>
                    </Card>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {communityPagination && communityPagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 p-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(communityPagination.currentPage - 1)}
                  disabled={!communityPagination.hasPrevPage}
                >
                  Previous
                </Button>
                
                <span className="text-sm text-gray-600">
                  Page {communityPagination.currentPage} of {communityPagination.totalPages}
                </span>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(communityPagination.currentPage + 1)}
                  disabled={!communityPagination.hasNextPage}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
