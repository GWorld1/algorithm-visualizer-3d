"use client"
import React, { useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Search,
  Clock,
  Layers,
  GitBranch,
  Database,
  ArrowUpDown,
  Bug,
  BookOpen,
  Play,
  Filter,
  X
} from 'lucide-react';
import { 
  algorithmTemplates, 
  templateCategories, 
  AlgorithmTemplate,
  getTemplatesByCategory,
  searchTemplates 
} from '@/lib/algorithmTemplates';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AlgorithmTemplate) => void;
  hasUnsavedChanges?: boolean;
}

const iconMap: Record<string, React.ComponentType<any>> = {
  Bug,
  Search,
  Database,
  ArrowUpDown,
  GitBranch
};

const TemplateModal: React.FC<TemplateModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
  hasUnsavedChanges = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<AlgorithmTemplate | null>(null);

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    let templates = algorithmTemplates;
    
    if (selectedCategory !== 'all') {
      templates = getTemplatesByCategory(selectedCategory);
    }
    
    if (searchQuery.trim()) {
      templates = searchTemplates(searchQuery).filter(template => 
        selectedCategory === 'all' || template.category === selectedCategory
      );
    }
    
    return templates;
  }, [selectedCategory, searchQuery]);

  const handleTemplateSelect = (template: AlgorithmTemplate) => {
    if (hasUnsavedChanges) {
      const confirmed = confirm(
        'You have unsaved changes. Selecting a template will replace your current work. Continue?'
      );
      if (!confirmed) return;
    }
    
    onSelectTemplate(template);
    onClose();
  };

  const getComplexityColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'intermediate': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      case 'advanced': return 'bg-red-500/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'debug': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'searching': return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      case 'array': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'sorting': return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      case 'graph': return 'bg-pink-500/20 text-pink-400 border-pink-500/30';
      default: return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] bg-gray-800 border-gray-600 text-white overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <BookOpen className="w-5 h-5 text-blue-400" />
            Algorithm Templates
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Choose from pre-built algorithm templates to get started quickly
          </DialogDescription>
        </DialogHeader>

        <div className="flex h-[70vh] gap-4">
          {/* Left Sidebar - Categories and Search */}
          <div className="w-64 flex flex-col gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                placeholder="Search templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                aria-label="Search algorithm templates"
              />
              {searchQuery && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 text-gray-400 hover:text-white"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>

            {/* Categories */}
            <div className="space-y-2">
              <div className="text-sm font-medium text-gray-300 flex items-center gap-2">
                <Filter className="w-4 h-4" />
                Categories
              </div>
              
              <Button
                variant={selectedCategory === 'all' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setSelectedCategory('all')}
                className="w-full justify-start text-sm"
                aria-pressed={selectedCategory === 'all'}
              >
                All Templates ({algorithmTemplates.length})
              </Button>
              
              {templateCategories.map(category => {
                const CategoryIcon = iconMap[category.icon];
                const count = getTemplatesByCategory(category.id).length;
                
                return (
                  <Button
                    key={category.id}
                    variant={selectedCategory === category.id ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setSelectedCategory(category.id)}
                    className="w-full justify-start text-sm"
                  >
                    {CategoryIcon && <CategoryIcon className="w-4 h-4 mr-2" />}
                    {category.name} ({count})
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Main Content - Template Grid */}
          <div className="flex-1 overflow-y-auto">
            {filteredTemplates.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-gray-400">
                <Search className="w-12 h-12 mb-4" />
                <p className="text-lg font-medium">No templates found</p>
                <p className="text-sm">Try adjusting your search or category filter</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-2">
                {filteredTemplates.map(template => (
                  <Card 
                    key={template.id} 
                    className="bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors cursor-pointer"
                    onClick={() => setSelectedTemplate(template)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                        <Badge className={getCategoryColor(template.category)}>
                          {template.category}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-300">{template.description}</p>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="space-y-3">
                        {/* Complexity and Time */}
                        <div className="flex items-center gap-4 text-xs">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <span className="text-gray-400">{template.estimatedTime}</span>
                          </div>
                          <Badge className={getComplexityColor(template.complexity.level)}>
                            {template.complexity.level}
                          </Badge>
                        </div>

                        {/* Preview Stats */}
                        <div className="flex items-center gap-4 text-xs text-gray-400">
                          <div className="flex items-center gap-1">
                            <Layers className="w-3 h-3" />
                            <span>{template.preview.nodeCount} nodes</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <GitBranch className="w-3 h-3" />
                            <span>{template.preview.connectionCount} connections</span>
                          </div>
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1">
                          {template.tags.slice(0, 3).map(tag => (
                            <Badge key={tag} variant="outline" className="text-xs border-gray-500 text-gray-300">
                              {tag}
                            </Badge>
                          ))}
                          {template.tags.length > 3 && (
                            <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                              +{template.tags.length - 3}
                            </Badge>
                          )}
                        </div>

                        {/* Action Button */}
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleTemplateSelect(template);
                          }}
                          className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          <Play className="w-4 h-4 mr-2" />
                          Use Template
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
