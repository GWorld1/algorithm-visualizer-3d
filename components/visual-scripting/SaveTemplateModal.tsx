"use client"

import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Save, 
  FileText, 
  Clock, 
  Layers,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { 
  TemplateFormData, 
  ScriptNode, 
  Connection 
} from '@/types/VisualScripting';
import { PersonalTemplateManager } from '@/lib/personalTemplateStorage';
import { templateCategories } from '@/lib/algorithmTemplates';
import { useToast } from '@/components/ui/toast';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: ScriptNode[];
  connections: Connection[];
  onSaveSuccess?: (templateName: string) => void;
}

const complexityOptions = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' }
];

const categoryOptions = [
  ...templateCategories.map(cat => ({ value: cat.id, label: cat.name })),
  { value: 'custom', label: 'Custom' }
];

const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({
  isOpen,
  onClose,
  nodes,
  connections,
  onSaveSuccess
}) => {
  const [formData, setFormData] = useState<TemplateFormData>({
    name: '',
    description: '',
    category: 'custom',
    complexity: 'beginner',
    estimatedTime: ''
  });
  
  const [errors, setErrors] = useState<Partial<TemplateFormData>>({});
  const [isSaving, setIsSaving] = useState(false);
  const [saveResult, setSaveResult] = useState<{ success: boolean; message: string } | null>(null);
  const { addToast } = useToast();

  const handleInputChange = (field: keyof TemplateFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // Clear save result when user starts typing
    if (saveResult) {
      setSaveResult(null);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<TemplateFormData> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    } else if (formData.name.trim().length < 3) {
      newErrors.name = 'Template name must be at least 3 characters';
    }
    
    if (formData.description.trim().length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }
    
    if (formData.estimatedTime && !/^[\d\-\s]+(min|minute|minutes|hour|hours|sec|second|seconds)?\s*$/i.test(formData.estimatedTime)) {
      newErrors.estimatedTime = 'Please enter a valid time estimate (e.g., "5 minutes", "1-2 hours")';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    if (nodes.length === 0) {
      setSaveResult({ success: false, message: 'Cannot save empty template' });
      return;
    }
    
    setIsSaving(true);
    setSaveResult(null);
    
    try {
      const result = PersonalTemplateManager.saveTemplate(formData, nodes, connections);
      setSaveResult(result);

      if (result.success) {
        addToast({
          type: 'success',
          title: 'Template Saved',
          description: `Template "${formData.name}" has been saved successfully.`
        });
        onSaveSuccess?.(formData.name);
        // Reset form after successful save
        setTimeout(() => {
          handleClose();
        }, 1500);
      } else {
        addToast({
          type: 'error',
          title: 'Save Failed',
          description: result.message
        });
      }
    } catch {
      const errorMessage = 'An unexpected error occurred';
      setSaveResult({ success: false, message: errorMessage });
      addToast({
        type: 'error',
        title: 'Save Failed',
        description: errorMessage
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      description: '',
      category: 'custom',
      complexity: 'beginner',
      estimatedTime: ''
    });
    setErrors({});
    setSaveResult(null);
    setIsSaving(false);
    onClose();
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'beginner': return 'bg-green-100 text-green-800 border-green-200';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'advanced': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl bg-gray-800 border-gray-600 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <Save className="w-5 h-5 text-blue-400" />
            Save as Template
          </DialogTitle>
          <DialogDescription className="text-gray-300">
            Save your current visual script as a reusable template
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Preview */}
          <Card className="bg-gray-700 border-gray-600">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-400" />
                  <div>
                    <p className="text-sm font-medium text-white">Current Script</p>
                    <p className="text-xs text-gray-400">
                      {nodes.length} nodes, {connections.length} connections
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-gray-300 border-gray-500">
                    <Layers className="w-3 h-3 mr-1" />
                    {nodes.length}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Form Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Template Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Template Name *
              </label>
              <Input
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Enter template name..."
                className={`bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                  errors.name ? 'border-red-500' : ''
                }`}
              />
              {errors.name && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Category
              </label>
              
              <Select
                value={formData.category}
                onValueChange={(value) => handleInputChange('category', value)}
                options={categoryOptions}
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            {/* Complexity */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Complexity Level
              </label>
              <Select
                value={formData.complexity}
                onValueChange={(value) => handleInputChange('complexity', value)}
                options={complexityOptions}
                className="bg-gray-700 border-gray-600 text-white"
              />
              <Badge 
                className={`mt-2 text-xs ${getComplexityColor(formData.complexity)}`}
                variant="outline"
              >
                {formData.complexity.charAt(0).toUpperCase() + formData.complexity.slice(1)}
              </Badge>
            </div>

            {/* Estimated Time */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Estimated Time (Optional)
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  value={formData.estimatedTime}
                  onChange={(e) => handleInputChange('estimatedTime', e.target.value)}
                  placeholder="e.g., 5 minutes, 1-2 hours"
                  className={`pl-10 bg-gray-700 border-gray-600 text-white placeholder-gray-400 ${
                    errors.estimatedTime ? 'border-red-500' : ''
                  }`}
                />
              </div>
              {errors.estimatedTime && (
                <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.estimatedTime}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe what this template does..."
                rows={3}
                className={`w-full rounded-md border bg-gray-700 border-gray-600 px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 resize-none ${
                  errors.description ? 'border-red-500' : ''
                }`}
              />
              <div className="flex justify-between items-center mt-1">
                {errors.description && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {errors.description}
                  </p>
                )}
                <p className="text-xs text-gray-400 ml-auto">
                  {formData.description.length}/500
                </p>
              </div>
            </div>
          </div>

          {/* Save Result */}
          {saveResult && (
            <div className={`p-3 rounded-md flex items-center gap-2 ${
              saveResult.success 
                ? 'bg-green-900/50 border border-green-600 text-green-300' 
                : 'bg-red-900/50 border border-red-600 text-red-300'
            }`}>
              {saveResult.success ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                <AlertCircle className="w-4 h-4" />
              )}
              <span className="text-sm">{saveResult.message}</span>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={handleClose}
            disabled={isSaving}
            className="text-gray-300 hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={isSaving || nodes.length === 0}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Template
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveTemplateModal;
