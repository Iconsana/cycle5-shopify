// client/src/services/templateStorage.js
import { saveAs } from 'file-saver';

const STORAGE_KEY = 'bshocked_saved_templates';

export class TemplateStorage {
  
  // Save template to localStorage and optionally export as file
  static saveTemplate(templateData, exportAsFile = false) {
    const savedTemplate = {
      id: templateData.id || this.generateId(),
      name: templateData.name || 'Untitled Template',
      templateId: templateData.templateId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      productData: templateData.productData || {},
      companyData: templateData.companyData || {},
      version: '1.0'
    };

    // Save to localStorage
    this.saveToLocalStorage(savedTemplate);

    // Optionally export as file
    if (exportAsFile) {
      this.exportTemplateFile(savedTemplate);
    }

    return savedTemplate;
  }

  // Load template from localStorage
  static loadTemplate(templateId) {
    const savedTemplates = this.getSavedTemplates();
    return savedTemplates.find(t => t.id === templateId);
  }

  // Get all saved templates
  static getSavedTemplates() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading saved templates:', error);
      return [];
    }
  }

  // Delete a saved template
  static deleteTemplate(templateId) {
    const templates = this.getSavedTemplates();
    const filtered = templates.filter(t => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    return filtered;
  }

  // Update existing template
  static updateTemplate(templateId, updates) {
    const templates = this.getSavedTemplates();
    const index = templates.findIndex(t => t.id === templateId);
    
    if (index !== -1) {
      templates[index] = {
        ...templates[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(templates));
      return templates[index];
    }
    
    return null;
  }

  // Save to localStorage
  static saveToLocalStorage(template) {
    const existing = this.getSavedTemplates();
    const index = existing.findIndex(t => t.id === template.id);
    
    if (index !== -1) {
      existing[index] = template;
    } else {
      existing.push(template);
    }
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(existing));
  }

  // Export template as downloadable JSON file
  static exportTemplateFile(template) {
    const jsonString = JSON.stringify(template, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `${template.name.replace(/[^a-zA-Z0-9]/g, '_')}-template.json`;
    saveAs(blob, filename);
  }

  // Import template from JSON file
  static importTemplateFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const template = JSON.parse(event.target.result);
          
          // Validate template structure
          if (!this.validateTemplateStructure(template)) {
            reject(new Error('Invalid template file format'));
            return;
          }
          
          // Generate new ID for imported template
          template.id = this.generateId();
          template.name = `${template.name} (Imported)`;
          template.importedAt = new Date().toISOString();
          
          // Save to localStorage
          this.saveToLocalStorage(template);
          
          resolve(template);
        } catch (error) {
          reject(new Error('Failed to parse template file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  }

  // Import SVG template file and create template from it
  static importSVGTemplateFile(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const svgContent = event.target.result;
          
          // Validate it's actually SVG content
          if (!svgContent.includes('<svg') || !svgContent.includes('</svg>')) {
            reject(new Error('Invalid SVG file format'));
            return;
          }
          
          // Extract template name from filename (remove .svg extension)
          const templateName = file.name.replace(/\.svg$/i, '');
          
          // Generate a more standardized template ID based on filename
          let templateId = templateName.toLowerCase().replace(/[^a-z0-9]/g, '-');
          
          // For solar kit templates, try to normalize to 'solar-kit-social'
          if (templateId.includes('solar') && templateId.includes('kit')) {
            templateId = 'solar-kit-social';
          }
          // Truncate very long IDs and ensure they don't end with dashes
          else if (templateId.length > 30) {
            templateId = templateId.substring(0, 30).replace(/-+$/, '');
          }
          
          // Create template object
          const template = {
            id: this.generateId(),
            name: `${templateName} (Imported)`,
            templateId: templateId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            productData: {},
            companyData: {},
            version: '1.0',
            importedAt: new Date().toISOString(),
            svgContent: svgContent, // Store the actual SVG content
            isCustomTemplate: true // Flag to indicate this is a custom imported template
          };
          
          // Save to localStorage
          this.saveToLocalStorage(template);
          
          // Also save the SVG file to the templates directory (conceptually - in real app this would need server support)
          // For now, we'll store the SVG content in the template object
          
          resolve(template);
        } catch (error) {
          reject(new Error('Failed to process SVG file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read SVG file'));
      reader.readAsText(file);
    });
  }

  // Validate template structure
  static validateTemplateStructure(template) {
    const requiredFields = ['name', 'templateId', 'productData'];
    return requiredFields.every(field => template.hasOwnProperty(field));
  }

  // Generate unique ID
  static generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  // Get template summary for display
  static getTemplateSummary(template) {
    const fieldCount = template.productData ? Object.keys(template.productData).filter(k => 
      template.productData[k] && template.productData[k].toString().trim() !== ''
    ).length : 0;

    return {
      id: template.id,
      name: template.name,
      templateId: template.templateId,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
      fieldCount: fieldCount,
      hasImage: !!(template.productData && template.productData.image),
      preview: {
        mainTitle: template.productData?.mainTitle || 'Untitled',
        sku: template.productData?.sku || 'No SKU',
        price: template.productData?.priceAmount || 'No Price'
      }
    };
  }

  // Clear all saved templates (for testing/reset)
  static clearAllTemplates() {
    localStorage.removeItem(STORAGE_KEY);
  }

  // Get storage usage info
  static getStorageInfo() {
    const templates = this.getSavedTemplates();
    const totalSize = localStorage.getItem(STORAGE_KEY)?.length || 0;
    
    return {
      templateCount: templates.length,
      storageSize: totalSize,
      storageSizeFormatted: this.formatBytes(totalSize),
      lastUpdated: templates.length > 0 ? 
        Math.max(...templates.map(t => new Date(t.updatedAt || t.createdAt).getTime())) : null
    };
  }

  // Format bytes for display
  static formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  // Export all templates as backup
  static exportAllTemplates() {
    const templates = this.getSavedTemplates();
    const backup = {
      exportedAt: new Date().toISOString(),
      version: '1.0',
      templates: templates
    };
    
    const jsonString = JSON.stringify(backup, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const filename = `bshocked_templates_backup_${new Date().toISOString().split('T')[0]}.json`;
    saveAs(blob, filename);
  }

  // Import templates from backup
  static importTemplateBackup(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        try {
          const backup = JSON.parse(event.target.result);
          
          if (!backup.templates || !Array.isArray(backup.templates)) {
            reject(new Error('Invalid backup file format'));
            return;
          }
          
          const imported = [];
          backup.templates.forEach(template => {
            if (this.validateTemplateStructure(template)) {
              // Generate new ID and mark as imported
              template.id = this.generateId();
              template.name = `${template.name} (Imported)`;
              template.importedAt = new Date().toISOString();
              
              this.saveToLocalStorage(template);
              imported.push(template);
            }
          });
          
          resolve(imported);
        } catch (error) {
          reject(new Error('Failed to parse backup file: ' + error.message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read backup file'));
      reader.readAsText(file);
    });
  }
}

export default TemplateStorage;