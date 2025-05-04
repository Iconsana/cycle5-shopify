import React from 'react';

const TemplateSelector = ({ templates, selectedTemplate, onSelectTemplate }) => {
  return (
    <div className="template-selector">
      <div className="templates-grid">
        {templates.map(template => (
          <div 
            key={template.id}
            className={`template-item ${selectedTemplate?.id === template.id ? 'selected' : ''}`}
            onClick={() => onSelectTemplate(template)}
          >
            <div className="template-preview">
              <div dangerouslySetInnerHTML={{ __html: template.content }} />
            </div>
            <div className="template-name">{template.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TemplateSelector;
