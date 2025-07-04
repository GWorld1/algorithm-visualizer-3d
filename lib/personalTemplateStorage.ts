import { 
  PersonalTemplate, 
  PersonalTemplateStorage, 
  TemplateFormData, 
  TemplateOperationResult,
  ScriptNode,
  Connection
} from '@/types/VisualScripting';

const STORAGE_KEY = 'vs_personal_templates';
const STORAGE_VERSION = '1.0.0';

// Utility functions for localStorage operations
export class PersonalTemplateManager {
  
  /**
   * Get all personal templates from localStorage
   */
  static getPersonalTemplates(): PersonalTemplate[] {
    try {
      if (typeof window === 'undefined') return [];
      
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) return [];
      
      const data: PersonalTemplateStorage = JSON.parse(stored);
      
      // Validate storage structure
      if (!data.templates || !Array.isArray(data.templates)) {
        console.warn('Invalid personal template storage structure, resetting...');
        this.resetStorage();
        return [];
      }
      
      return data.templates;
    } catch (error) {
      console.error('Error loading personal templates:', error);
      return [];
    }
  }
  
  /**
   * Save a new personal template
   */
  static saveTemplate(
    formData: TemplateFormData,
    nodes: ScriptNode[],
    connections: Connection[]
  ): TemplateOperationResult {
    try {
      if (typeof window === 'undefined') {
        return { success: false, message: 'localStorage not available' };
      }
      
      // Validate input
      if (!formData.name.trim()) {
        return { success: false, message: 'Template name is required' };
      }
      
      if (nodes.length === 0) {
        return { success: false, message: 'Cannot save empty template' };
      }
      
      const existingTemplates = this.getPersonalTemplates();
      
      // Check for duplicate names
      if (existingTemplates.some(t => t.name.toLowerCase() === formData.name.toLowerCase())) {
        return { success: false, message: 'A template with this name already exists' };
      }
      
      const now = new Date().toISOString();
      const newTemplate: PersonalTemplate = {
        id: this.generateId(),
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        complexity: {
          level: formData.complexity
        },
        estimatedTime: formData.estimatedTime.trim() || 'Unknown',
        metadata: {
          createdAt: now,
          lastModified: now,
          nodeCount: nodes.length,
          connectionCount: connections.length,
          version: STORAGE_VERSION
        },
        nodes: this.cloneNodes(nodes),
        connections: this.cloneConnections(connections)
      };
      
      const updatedTemplates = [...existingTemplates, newTemplate];
      this.saveToStorage(updatedTemplates);
      
      return { 
        success: true, 
        message: 'Template saved successfully',
        template: newTemplate
      };
    } catch (error) {
      console.error('Error saving template:', error);
      return { success: false, message: 'Failed to save template' };
    }
  }
  
  /**
   * Update an existing personal template
   */
  static updateTemplate(
    templateId: string,
    formData: TemplateFormData,
    nodes?: ScriptNode[],
    connections?: Connection[]
  ): TemplateOperationResult {
    try {
      const templates = this.getPersonalTemplates();
      const templateIndex = templates.findIndex(t => t.id === templateId);
      
      if (templateIndex === -1) {
        return { success: false, message: 'Template not found' };
      }
      
      // Check for duplicate names (excluding current template)
      if (templates.some((t, index) => 
        index !== templateIndex && 
        t.name.toLowerCase() === formData.name.toLowerCase()
      )) {
        return { success: false, message: 'A template with this name already exists' };
      }
      
      const existingTemplate = templates[templateIndex];
      const updatedTemplate: PersonalTemplate = {
        ...existingTemplate,
        name: formData.name.trim(),
        description: formData.description.trim(),
        category: formData.category,
        complexity: {
          level: formData.complexity
        },
        estimatedTime: formData.estimatedTime.trim() || existingTemplate.estimatedTime,
        metadata: {
          ...existingTemplate.metadata,
          lastModified: new Date().toISOString(),
          nodeCount: nodes ? nodes.length : existingTemplate.metadata.nodeCount,
          connectionCount: connections ? connections.length : existingTemplate.metadata.connectionCount
        },
        nodes: nodes ? this.cloneNodes(nodes) : existingTemplate.nodes,
        connections: connections ? this.cloneConnections(connections) : existingTemplate.connections
      };
      
      templates[templateIndex] = updatedTemplate;
      this.saveToStorage(templates);
      
      return { 
        success: true, 
        message: 'Template updated successfully',
        template: updatedTemplate
      };
    } catch (error) {
      console.error('Error updating template:', error);
      return { success: false, message: 'Failed to update template' };
    }
  }
  
  /**
   * Delete a personal template
   */
  static deleteTemplate(templateId: string): TemplateOperationResult {
    try {
      const templates = this.getPersonalTemplates();
      const filteredTemplates = templates.filter(t => t.id !== templateId);
      
      if (filteredTemplates.length === templates.length) {
        return { success: false, message: 'Template not found' };
      }
      
      this.saveToStorage(filteredTemplates);
      
      return { success: true, message: 'Template deleted successfully' };
    } catch (error) {
      console.error('Error deleting template:', error);
      return { success: false, message: 'Failed to delete template' };
    }
  }
  
  /**
   * Duplicate a personal template
   */
  static duplicateTemplate(templateId: string): TemplateOperationResult {
    try {
      const templates = this.getPersonalTemplates();
      const originalTemplate = templates.find(t => t.id === templateId);
      
      if (!originalTemplate) {
        return { success: false, message: 'Template not found' };
      }
      
      const now = new Date().toISOString();
      const duplicatedTemplate: PersonalTemplate = {
        ...originalTemplate,
        id: this.generateId(),
        name: `${originalTemplate.name} (Copy)`,
        metadata: {
          ...originalTemplate.metadata,
          createdAt: now,
          lastModified: now
        }
      };
      
      const updatedTemplates = [...templates, duplicatedTemplate];
      this.saveToStorage(updatedTemplates);
      
      return { 
        success: true, 
        message: 'Template duplicated successfully',
        template: duplicatedTemplate
      };
    } catch (error) {
      console.error('Error duplicating template:', error);
      return { success: false, message: 'Failed to duplicate template' };
    }
  }
  
  /**
   * Export templates as JSON
   */
  static exportTemplates(): string {
    const templates = this.getPersonalTemplates();
    const exportData = {
      templates,
      exportedAt: new Date().toISOString(),
      version: STORAGE_VERSION
    };
    return JSON.stringify(exportData, null, 2);
  }
  
  /**
   * Import templates from JSON
   */
  static importTemplates(jsonData: string): TemplateOperationResult {
    try {
      const importData = JSON.parse(jsonData);
      
      if (!importData.templates || !Array.isArray(importData.templates)) {
        return { success: false, message: 'Invalid import data format' };
      }
      
      const existingTemplates = this.getPersonalTemplates();
      const newTemplates: PersonalTemplate[] = [];
      let duplicateCount = 0;
      
      for (const template of importData.templates) {
        // Validate template structure
        if (!this.isValidTemplate(template)) {
          continue;
        }
        
        // Check for duplicates and rename if necessary
        let templateName = template.name;
        let counter = 1;
        while (existingTemplates.some(t => t.name.toLowerCase() === templateName.toLowerCase()) ||
               newTemplates.some(t => t.name.toLowerCase() === templateName.toLowerCase())) {
          templateName = `${template.name} (${counter})`;
          counter++;
          duplicateCount++;
        }
        
        const importedTemplate: PersonalTemplate = {
          ...template,
          id: this.generateId(),
          name: templateName,
          metadata: {
            ...template.metadata,
            createdAt: new Date().toISOString(),
            lastModified: new Date().toISOString()
          }
        };
        
        newTemplates.push(importedTemplate);
      }
      
      if (newTemplates.length === 0) {
        return { success: false, message: 'No valid templates found in import data' };
      }
      
      const allTemplates = [...existingTemplates, ...newTemplates];
      this.saveToStorage(allTemplates);
      
      const message = duplicateCount > 0 
        ? `Imported ${newTemplates.length} templates (${duplicateCount} renamed due to duplicates)`
        : `Imported ${newTemplates.length} templates successfully`;
      
      return { success: true, message };
    } catch (error) {
      console.error('Error importing templates:', error);
      return { success: false, message: 'Failed to import templates: Invalid JSON format' };
    }
  }
  
  /**
   * Clear all personal templates
   */
  static clearAllTemplates(): TemplateOperationResult {
    try {
      if (typeof window === 'undefined') {
        return { success: false, message: 'localStorage not available' };
      }
      
      localStorage.removeItem(STORAGE_KEY);
      return { success: true, message: 'All templates cleared successfully' };
    } catch (error) {
      console.error('Error clearing templates:', error);
      return { success: false, message: 'Failed to clear templates' };
    }
  }
  
  // Private utility methods
  private static saveToStorage(templates: PersonalTemplate[]): void {
    const storageData: PersonalTemplateStorage = {
      templates,
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(storageData));
  }
  
  private static resetStorage(): void {
    const emptyStorage: PersonalTemplateStorage = {
      templates: [],
      version: STORAGE_VERSION,
      lastUpdated: new Date().toISOString()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyStorage));
  }
  
  private static generateId(): string {
    return `personal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  
  private static cloneNodes(nodes: ScriptNode[]): ScriptNode[] {
    return JSON.parse(JSON.stringify(nodes));
  }
  
  private static cloneConnections(connections: Connection[]): Connection[] {
    return JSON.parse(JSON.stringify(connections));
  }
  
  private static isValidTemplate(template: unknown): boolean {
    return (
      template &&
      typeof template === 'object' &&
      'name' in template &&
      typeof template.name === 'string' &&
      'description' in template &&
      typeof template.description === 'string' &&
      'category' in template &&
      typeof template.category === 'string' &&
      'complexity' in template &&
      template.complexity &&
      typeof template.complexity === 'object' &&
      'level' in template.complexity &&
      typeof template.complexity.level === 'string' &&
      'nodes' in template &&
      Array.isArray(template.nodes) &&
      'connections' in template &&
      Array.isArray(template.connections)
    );
  }
}
