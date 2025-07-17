// client/src/components/templates/TemplateManager.js
import React, { useState, useEffect } from 'react';
import { useDropzone } from 'react-dropzone';
import TemplateStorage from '../../services/templateStorage';

const TemplateManager = ({ onLoadTemplate, currentTemplate, currentProductData, currentCompanyData }) => {
  const [savedTemplates, setSavedTemplates] = useState([]);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showImportDialog, setShowImportDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');
  const [importing, setImporting] = useState(false);
  const [error, setError] = useState('');
  const [storageInfo, setStorageInfo] = useState(null);

  useEffect(() => {
    refreshTemplates();
  }, []);

  const refreshTemplates = () => {
    const templates = TemplateStorage.getSavedTemplates();
    setSavedTemplates(templates);
    setStorageInfo(TemplateStorage.getStorageInfo());
  };

  const handleSaveTemplate = () => {
    if (!currentTemplate || !templateName.trim()) {
      setError('Please provide a template name');
      return;
    }

    try {
      const templateData = {
        name: templateName.trim(),
        templateId: currentTemplate.id,
        productData: currentProductData,
        companyData: currentCompanyData
      };

      TemplateStorage.saveTemplate(templateData);
      setShowSaveDialog(false);
      setTemplateName('');
      setError('');
      refreshTemplates();
    } catch (err) {
      setError('Failed to save template: ' + err.message);
    }
  };

  const handleLoadTemplate = (template) => {
    onLoadTemplate(template);
  };

  const handleDeleteTemplate = (templateId) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
      TemplateStorage.deleteTemplate(templateId);
      refreshTemplates();
    }
  };

  const handleExportTemplate = (template) => {
    TemplateStorage.exportTemplateFile(template);
  };

  const handleImportFile = async (files) => {
    if (files.length === 0) return;

    setImporting(true);
    setError('');

    try {
      const file = files[0];
      
      if (file.name.endsWith('.json')) {
        // Import single template
        const template = await TemplateStorage.importTemplateFile(file);
        refreshTemplates();
        setShowImportDialog(false);
      } else {
        throw new Error('Please select a JSON file');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setImporting(false);
    }
  };

  const handleExportAll = () => {
    TemplateStorage.exportAllTemplates();
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/json': ['.json']
    },
    onDrop: handleImportFile,
    maxFiles: 1
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="template-manager">
      <div className="template-manager-header">
        <h3>Template Manager</h3>
        <div className="template-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowSaveDialog(true)}
            disabled={!currentTemplate}
          >
            Save Current Template
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setShowImportDialog(true)}
          >
            Import Template
          </button>
          {savedTemplates.length > 0 && (
            <button 
              className="btn btn-outline"
              onClick={handleExportAll}
            >
              Export All
            </button>
          )}
        </div>
      </div>

      {/* Storage Info */}
      {storageInfo && (
        <div className="storage-info">
          <small>
            {storageInfo.templateCount} saved templates • {storageInfo.storageSizeFormatted} used
          </small>
        </div>
      )}

      {/* Error Display */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      {/* Save Dialog */}
      {showSaveDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h4>Save Template</h4>
            <p>Save the current template configuration for later use.</p>
            <input
              type="text"
              placeholder="Template name"
              value={templateName}
              onChange={(e) => setTemplateName(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveTemplate()}
            />
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowSaveDialog(false)}>
                Cancel
              </button>
              <button className="btn btn-primary" onClick={handleSaveTemplate}>
                Save Template
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Import Dialog */}
      {showImportDialog && (
        <div className="dialog-overlay">
          <div className="dialog">
            <h4>Import Template</h4>
            <p>Import a previously saved template file.</p>
            
            <div 
              {...getRootProps()} 
              className={`dropzone ${isDragActive ? 'active' : ''}`}
            >
              <input {...getInputProps()} />
              {importing ? (
                <p>Importing...</p>
              ) : isDragActive ? (
                <p>Drop the JSON file here...</p>
              ) : (
                <p>Drag & drop a JSON template file here, or click to select</p>
              )}
            </div>
            
            <div className="dialog-actions">
              <button className="btn btn-secondary" onClick={() => setShowImportDialog(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Saved Templates List */}
      <div className="saved-templates">
        <h4>Saved Templates ({savedTemplates.length})</h4>
        
        {savedTemplates.length === 0 ? (
          <div className="empty-state">
            <p>No saved templates yet. Create and save your first template!</p>
          </div>
        ) : (
          <div className="templates-grid">
            {savedTemplates.map((template) => {
              const summary = TemplateStorage.getTemplateSummary(template);
              return (
                <div key={template.id} className="template-card">
                  <div className="template-header">
                    <h5>{template.name}</h5>
                    <span className="template-type">{template.templateId}</span>
                  </div>
                  
                  <div className="template-preview">
                    <div className="preview-field">
                      <strong>Title:</strong> {summary.preview.mainTitle}
                    </div>
                    <div className="preview-field">
                      <strong>SKU:</strong> {summary.preview.sku}
                    </div>
                    <div className="preview-field">
                      <strong>Price:</strong> {summary.preview.price}
                    </div>
                  </div>
                  
                  <div className="template-meta">
                    <small>
                      {summary.fieldCount} fields • {formatDate(template.updatedAt)}
                      {summary.hasImage && ' • 📷'}
                    </small>
                  </div>
                  
                  <div className="template-actions">
                    <button 
                      className="btn btn-sm btn-primary"
                      onClick={() => handleLoadTemplate(template)}
                    >
                      Load
                    </button>
                    <button 
                      className="btn btn-sm btn-secondary"
                      onClick={() => handleExportTemplate(template)}
                    >
                      Export
                    </button>
                    <button 
                      className="btn btn-sm btn-danger"
                      onClick={() => handleDeleteTemplate(template.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx>{`
        .template-manager {
          background: #f8f9fa;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 20px;
          margin-bottom: 20px;
        }

        .template-manager-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 15px;
        }

        .template-actions {
          display: flex;
          gap: 10px;
        }

        .storage-info {
          margin-bottom: 15px;
          padding: 8px;
          background: #e9ecef;
          border-radius: 4px;
          text-align: center;
        }

        .error-message {
          background: #f8d7da;
          color: #721c24;
          padding: 10px;
          border-radius: 4px;
          margin-bottom: 15px;
        }

        .dialog-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .dialog {
          background: white;
          padding: 20px;
          border-radius: 8px;
          max-width: 500px;
          width: 90%;
          max-height: 80vh;
          overflow-y: auto;
        }

        .dialog input {
          width: 100%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ddd;
          border-radius: 4px;
        }

        .dialog-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          margin-top: 20px;
        }

        .dropzone {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 40px;
          text-align: center;
          cursor: pointer;
          transition: border-color 0.3s;
        }

        .dropzone.active {
          border-color: #007bff;
          background: #f8f9ff;
        }

        .templates-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }

        .template-card {
          background: white;
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
        }

        .template-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 10px;
        }

        .template-header h5 {
          margin: 0;
          color: #333;
        }

        .template-type {
          background: #e9ecef;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          color: #6c757d;
        }

        .template-preview {
          margin-bottom: 10px;
        }

        .preview-field {
          font-size: 12px;
          margin-bottom: 4px;
        }

        .template-meta {
          color: #6c757d;
          margin-bottom: 10px;
        }

        .template-actions {
          display: flex;
          gap: 8px;
        }

        .btn {
          padding: 6px 12px;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }

        .btn-primary {
          background: #007bff;
          color: white;
          border-color: #007bff;
        }

        .btn-secondary {
          background: #6c757d;
          color: white;
          border-color: #6c757d;
        }

        .btn-outline {
          background: transparent;
          color: #007bff;
          border-color: #007bff;
        }

        .btn-danger {
          background: #dc3545;
          color: white;
          border-color: #dc3545;
        }

        .btn-sm {
          padding: 4px 8px;
          font-size: 12px;
        }

        .empty-state {
          text-align: center;
          padding: 40px;
          color: #6c757d;
        }
      `}</style>
    </div>
  );
};

export default TemplateManager;