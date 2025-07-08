"use client"

import { useState } from 'react';
import { useVisualScriptingStore } from '@/store/useVisualScriptingStore';
import { ShareMetadata } from '@/lib/api/algorithmConverter';
import { useToast } from '@/components/ui/toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Share2, AlertCircle, CheckCircle } from 'lucide-react';
import { AlgorithmSharingAPI } from '@/lib/api/algorithmSharingClient';

interface ShareAlgorithmModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAlgorithmModal = ({ isOpen, onClose }: ShareAlgorithmModalProps) => {
  const { shareCurrentAlgorithm, currentAlgorithm, validateScript } = useVisualScriptingStore();
  const { addToast } = useToast();

  const [formData, setFormData] = useState<ShareMetadata>({
    title: currentAlgorithm?.name || '',
    description: currentAlgorithm?.description || '',
    category: 'custom',
    difficulty: 'beginner',
    tags: [],
    isPublic: true,
    estimatedTime: '',
    timeComplexity: 'O(n)',
    spaceComplexity: 'O(1)',
  });

  const [newTag, setNewTag] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Check if community features are enabled
  const isCommunityEnabled = AlgorithmSharingAPI.isCommunityEnabled();

  // Validate form and algorithm
  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) {
      errors.push('Title is required');
    }

    if (!formData.description.trim()) {
      errors.push('Description is required');
    }

    if (formData.title.length > 100) {
      errors.push('Title must be less than 100 characters');
    }

    if (formData.description.length > 1000) {
      errors.push('Description must be less than 1000 characters');
    }

    // Validate algorithm structure
    const scriptValidation = validateScript();
    if (!scriptValidation.isValid) {
      errors.push(...scriptValidation.errors);
    }

    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleShare = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSharing(true);
    try {
      await shareCurrentAlgorithm(formData);
      
      addToast({
        title: 'Algorithm Shared!',
        description: 'Your algorithm has been successfully shared with the community.',
        type: 'success',
      });

      onClose();
      
      // Reset form
      setFormData({
        title: '',
        description: '',
        category: 'custom',
        difficulty: 'beginner',
        tags: [],
        isPublic: true,
        estimatedTime: '',
        timeComplexity: 'O(n)',
        spaceComplexity: 'O(1)',
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to share algorithm';
      addToast({
        title: 'Share Failed',
        description: errorMessage,
        type: 'error',
      });
    } finally {
      setIsSharing(false);
    }
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim()) && formData.tags.length < 10) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleInputChange = (field: keyof ShareMetadata, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear validation errors when user starts typing
    if (validationErrors.length > 0) {
      setValidationErrors([]);
    }
  };

  if (!isCommunityEnabled) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              Community Features Disabled
            </DialogTitle>
            <DialogDescription>
              Community sharing features are currently disabled. Please check your configuration.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  if (!currentAlgorithm) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-500" />
              No Algorithm to Share
            </DialogTitle>
            <DialogDescription>
              Please create or load an algorithm before sharing it with the community.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button onClick={onClose}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Algorithm with Community
          </DialogTitle>
          <DialogDescription>
            Share your visual algorithm with the community to help others learn and discover new approaches.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center gap-2 text-red-800 font-medium mb-2">
                <AlertCircle className="h-4 w-4" />
                Please fix the following issues:
              </div>
              <ul className="list-disc list-inside text-red-700 text-sm space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Enter algorithm title (e.g., 'Bubble Sort Visualization')"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                maxLength={100}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.title.length}/100 characters
              </p>
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Describe what your algorithm does and how it works..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                maxLength={1000}
                rows={4}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.description.length}/1000 characters
              </p>
            </div>
          </div>

          {/* Categorization */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sorting">Sorting</SelectItem>
                  <SelectItem value="searching">Searching</SelectItem>
                  <SelectItem value="graph">Graph</SelectItem>
                  <SelectItem value="array">Array</SelectItem>
                  <SelectItem value="debug">Debug</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="difficulty">Difficulty</Label>
              <Select value={formData.difficulty} onValueChange={(value) => handleInputChange('difficulty', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <Label>Tags (optional)</Label>
            <div className="flex gap-2 mb-2">
              <Input
                placeholder="Add a tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleAddTag()}
                maxLength={30}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddTag}
                disabled={!newTag.trim() || formData.tags.includes(newTag.trim()) || formData.tags.length >= 10}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {formData.tags.length}/10 tags
            </p>
          </div>

          {/* Additional Metadata */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="estimatedTime">Estimated Time</Label>
              <Input
                id="estimatedTime"
                placeholder="e.g., 2-3 minutes"
                value={formData.estimatedTime}
                onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="timeComplexity">Time Complexity</Label>
              <Input
                id="timeComplexity"
                placeholder="e.g., O(n²)"
                value={formData.timeComplexity}
                onChange={(e) => handleInputChange('timeComplexity', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="spaceComplexity">Space Complexity</Label>
              <Input
                id="spaceComplexity"
                placeholder="e.g., O(1)"
                value={formData.spaceComplexity}
                onChange={(e) => handleInputChange('spaceComplexity', e.target.value)}
              />
            </div>
          </div>

          {/* Visibility */}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="rounded"
            />
            <Label htmlFor="isPublic">Make this algorithm public</Label>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSharing}>
            Cancel
          </Button>
          <Button onClick={handleShare} disabled={isSharing}>
            {isSharing ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Sharing...
              </>
            ) : (
              <>
                <Share2 className="h-4 w-4 mr-2" />
                Share Algorithm
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
