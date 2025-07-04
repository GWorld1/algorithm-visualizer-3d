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
  X,
  User,
  Trash2,
  Copy,
  Download,
  Upload,
  MoreHorizontal
} from 'lucide-react';
import {
  algorithmTemplates,
  templateCategories,
  AlgorithmTemplate,
  getTemplatesByCategory,
  searchTemplates
} from '@/lib/algorithmTemplates';
import { PersonalTemplate } from '@/types/VisualScripting';
import { PersonalTemplateManager } from '@/lib/personalTemplateStorage';
import { useToast } from '@/components/ui/toast';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: AlgorithmTemplate | PersonalTemplate) => void;
  hasUnsavedChanges?: boolean;
}

const iconMap: Record<string, React.ComponentType<React.SVGProps<SVGSVGElement>>> = {
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
  const [activeTab, setActiveTab] = useState<'built-in' | 'personal'>('built-in');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  // const [selectedTemplate, setSelectedTemplate] = useState<AlgorithmTemplate | PersonalTemplate | null>(null);
  const [personalTemplates, setPersonalTemplates] = useState<PersonalTemplate[]>([]);
  const [showManageMenu, setShowManageMenu] = useState<string | null>(null);
  const { addToast } = useToast();

  // Load personal templates on mount
  React.useEffect(() => {
    if (isOpen) {
      setPersonalTemplates(PersonalTemplateManager.getPersonalTemplates());
    }
  }, [isOpen]);

  // Close management menu when clicking outside
  React.useEffect(() => {
    const handleClickOutside = () => {
      setShowManageMenu(null);
    };

    if (showManageMenu) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showManageMenu]);

  // Filter templates based on category and search
  const filteredTemplates = useMemo(() => {
    if (activeTab === 'personal') {
      let templates = personalTemplates;

      if (selectedCategory !== 'all') {
        templates = templates.filter(template => template.category === selectedCategory);
      }

      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        templates = templates.filter(template =>
          template.name.toLowerCase().includes(query) ||
          template.description.toLowerCase().includes(query) ||
          template.category.toLowerCase().includes(query)
        );
      }

      return templates;
    } else {
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
    }
  }, [activeTab, selectedCategory, searchQuery, personalTemplates]);

  const handleTemplateSelect = (template: AlgorithmTemplate | PersonalTemplate) => {
    if (hasUnsavedChanges) {
      const confirmed = confirm(
        'You have unsaved changes. Selecting a template will replace your current work. Continue?'
      );
      if (!confirmed) return;
    }

    onSelectTemplate(template);
    onClose();
  };

  const handleDeleteTemplate = (templateId: string) => {
    if (confirm('Are you sure you want to delete this template? This action cannot be undone.')) {
      const result = PersonalTemplateManager.deleteTemplate(templateId);
      if (result.success) {
        setPersonalTemplates(PersonalTemplateManager.getPersonalTemplates());
        addToast({
          type: 'success',
          title: 'Template Deleted',
          description: result.message
        });
      } else {
        addToast({
          type: 'error',
          title: 'Delete Failed',
          description: result.message
        });
      }
    }
  };

  const handleDuplicateTemplate = (templateId: string) => {
    const result = PersonalTemplateManager.duplicateTemplate(templateId);
    if (result.success) {
      setPersonalTemplates(PersonalTemplateManager.getPersonalTemplates());
      addToast({
        type: 'success',
        title: 'Template Duplicated',
        description: result.message
      });
    } else {
      addToast({
        type: 'error',
        title: 'Duplicate Failed',
        description: result.message
      });
    }
  };

  const handleExportTemplates = () => {
    try {
      const exportData = PersonalTemplateManager.exportTemplates();
      const blob = new Blob([exportData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `personal-templates-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      addToast({
        type: 'success',
        title: 'Templates Exported',
        description: 'Your personal templates have been exported successfully.'
      });
    } catch {
      addToast({
        type: 'error',
        title: 'Export Failed',
        description: 'Failed to export templates. Please try again.'
      });
    }
  };

  const handleImportTemplates = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const jsonData = e.target?.result as string;
        const result = PersonalTemplateManager.importTemplates(jsonData);
        if (result.success) {
          setPersonalTemplates(PersonalTemplateManager.getPersonalTemplates());
          addToast({
            type: 'success',
            title: 'Templates Imported',
            description: result.message
          });
        } else {
          addToast({
            type: 'error',
            title: 'Import Failed',
            description: result.message
          });
        }
      } catch {
        addToast({
          type: 'error',
          title: 'Import Failed',
          description: 'Failed to import templates. Please check the file format.'
        });
      }
    };
    reader.readAsText(file);

    // Reset the input
    event.target.value = '';
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
            Choose from pre-built algorithm templates or your personal templates
          </DialogDescription>
        </DialogHeader>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-600">
          <button
            onClick={() => setActiveTab('built-in')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'built-in'
                ? 'border-blue-400 text-blue-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <BookOpen className="w-4 h-4 inline mr-2" />
            Built-in Templates ({algorithmTemplates.length})
          </button>
          <button
            onClick={() => setActiveTab('personal')}
            className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'personal'
                ? 'border-purple-400 text-purple-400'
                : 'border-transparent text-gray-400 hover:text-gray-300'
            }`}
          >
            <User className="w-4 h-4 inline mr-2" />
            Personal Templates ({personalTemplates.length})
          </button>

          {/* Personal Template Management */}
          {activeTab === 'personal' && (
            <div className="ml-auto flex items-center gap-2">
              <input
                type="file"
                accept=".json"
                onChange={handleImportTemplates}
                className="hidden"
                id="import-templates"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => document.getElementById('import-templates')?.click()}
                className="text-gray-400 hover:text-white"
                title="Import Templates"
              >
                <Upload className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleExportTemplates}
                disabled={personalTemplates.length === 0}
                className="text-gray-400 hover:text-white disabled:opacity-50"
                title="Export Templates"
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

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
                All Templates ({activeTab === 'personal' ? personalTemplates.length : algorithmTemplates.length})
              </Button>

              {templateCategories.map(category => {
                const CategoryIcon = iconMap[category.icon];
                const count = activeTab === 'personal'
                  ? personalTemplates.filter(t => t.category === category.id).length
                  : getTemplatesByCategory(category.id).length;

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

              {/* Custom category for personal templates */}
              {activeTab === 'personal' && (
                <Button
                  variant={selectedCategory === 'custom' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setSelectedCategory('custom')}
                  className="w-full justify-start text-sm"
                >
                  <User className="w-4 h-4 mr-2" />
                  Custom ({personalTemplates.filter(t => t.category === 'custom').length})
                </Button>
              )}
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
                {filteredTemplates.map(template => {
                  const isPersonal = activeTab === 'personal';
                  const personalTemplate = template as PersonalTemplate;
                  const builtInTemplate = template as AlgorithmTemplate;

                  return (
                    <Card
                      key={template.id}
                      className="bg-gray-700 border-gray-600 hover:bg-gray-650 transition-colors cursor-pointer relative"
                      onClick={() => setSelectedTemplate(template)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                          <div className="flex items-center gap-2">
                            <Badge className={getCategoryColor(template.category)}>
                              {template.category}
                            </Badge>
                            {isPersonal && (
                              <div className="relative">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setShowManageMenu(showManageMenu === template.id ? null : template.id);
                                  }}
                                  className="h-6 w-6 p-0 text-gray-400 hover:text-white"
                                >
                                  <MoreHorizontal className="w-4 h-4" />
                                </Button>

                                {showManageMenu === template.id && (
                                  <div className="absolute right-0 top-8 z-10 bg-gray-800 border border-gray-600 rounded-md shadow-lg py-1 min-w-[120px]">
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDuplicateTemplate(template.id);
                                        setShowManageMenu(null);
                                      }}
                                      className="w-full px-3 py-1 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <Copy className="w-3 h-3" />
                                      Duplicate
                                    </button>
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteTemplate(template.id);
                                        setShowManageMenu(null);
                                      }}
                                      className="w-full px-3 py-1 text-left text-sm text-red-400 hover:bg-gray-700 flex items-center gap-2"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                      Delete
                                    </button>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
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
                              <span>
                                {isPersonal ? personalTemplate.metadata.nodeCount : builtInTemplate.preview.nodeCount} nodes
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <GitBranch className="w-3 h-3" />
                              <span>
                                {isPersonal ? personalTemplate.metadata.connectionCount : builtInTemplate.preview.connectionCount} connections
                              </span>
                            </div>
                          </div>

                          {/* Tags or Date for Personal Templates */}
                          {isPersonal ? (
                            <div className="text-xs text-gray-400">
                              Created: {new Date(personalTemplate.metadata.createdAt).toLocaleDateString()}
                            </div>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {builtInTemplate.tags.slice(0, 3).map(tag => (
                                <Badge key={tag} variant="outline" className="text-xs border-gray-500 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                              {builtInTemplate.tags.length > 3 && (
                                <Badge variant="outline" className="text-xs border-gray-500 text-gray-300">
                                  +{builtInTemplate.tags.length - 3}
                                </Badge>
                              )}
                            </div>
                          )}

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
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default TemplateModal;
