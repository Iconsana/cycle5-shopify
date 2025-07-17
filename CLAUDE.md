# CLAUDE.md - B SHOCKED Solar Kit Template Generator

## 📋 Table of Contents
1. [Project Overview](#project-overview)
2. [File Structure](#file-structure)  
3. [Template System Architecture](#template-system-architecture)
4. [Solar Kit Social Template](#solar-kit-social-template)
5. [Editable Fields Reference](#editable-fields-reference)
6. [API Endpoints](#api-endpoints)
7. [Making Template Refinements](#making-template-refinements)
8. [Adding New Templates](#adding-new-templates)
9. [Troubleshooting Guide](#troubleshooting-guide)
10. [Development Scripts](#development-scripts)
11. [Code Snippets](#code-snippets)

---

## 🎯 Project Overview

**B SHOCKED Solar Kit Template Generator**
- **Purpose**: Create professional marketing templates for solar kit products
- **Technology**: React.js frontend + Vercel serverless functions
- **Main Feature**: Generate customizable SVG templates for social media marketing
- **Live URL**: https://cycle5-shopify.vercel.app

### Current Templates
1. `debug-simple` - Debug Simple template (built-in)
2. `battery-style` - Battery Style template
3. `circuit-promo` - Circuit Promo template  
4. `gradient-seasonal` - Gradient Seasonal template
5. `tech-enhanced` - Tech Enhanced template
6. `solar-bulk-deal` - Solar Bulk Deal template
7. `solar-kit-social` - **Solar Kit Social template** ⭐

### Technology Stack
- **Frontend**: React 18.2.0, React Router DOM 6.22.1, React Dropzone 14.2.3
- **Backend**: Node.js with Vercel serverless functions
- **Image Processing**: File-saver 2.0.5 for exports
- **HTTP Client**: Axios 1.6.7
- **Build Tool**: React Scripts 5.0.1

---

## 📁 File Structure

```
cycle5-shopify/
├── client/                          # React frontend
│   ├── public/
│   │   ├── index.html
│   │   ├── manifest.json
│   │   ├── robots.txt
│   │   └── templates/               # SVG template files
│   │       ├── battery-style.svg
│   │       ├── circuit-promo.svg
│   │       ├── gradient-seasonal.svg
│   │       ├── solar-bulk-deal.svg
│   │       ├── tech-enhanced.svg
│   │       └── solar-kit-social.svg ⭐ NEW
│   ├── src/
│   │   ├── components/
│   │   │   ├── export/
│   │   │   │   └── ExportOptions.js  # Export functionality
│   │   │   ├── layout/
│   │   │   │   └── Navbar.js         # Navigation component
│   │   │   ├── products/
│   │   │   │   └── ProductForm.js    # Form with all editable fields
│   │   │   └── templates/
│   │   │       ├── TemplatePreview.js # Renders live preview
│   │   │       └── TemplateSelector.js # Template selection
│   │   ├── pages/
│   │   │   ├── Home.js              # Landing page
│   │   │   ├── Settings.js          # Settings page
│   │   │   └── TemplateGenerator.js # Main generator
│   │   ├── services/
│   │   │   ├── productService.js    # Product data handling
│   │   │   ├── svgUtils.js         # SVG utility functions
│   │   │   └── templateService.js   # Template operations
│   │   ├── utils/
│   │   │   └── svgUtils.js         # SVG helper functions
│   │   ├── App.js                  # Main application
│   │   ├── App.css                 # Global styles
│   │   ├── CompanyContext.js       # Company data context
│   │   └── index.js                # Entry point
│   └── package.json                # Client dependencies
├── server/                         # Express backend (optional)
│   ├── app.js                      # Express app setup
│   ├── server.js                   # Server entry point
│   ├── productController.js        # Product API logic
│   ├── productRoutes.js           # Product routes
│   ├── templateController.js       # Template API logic
│   ├── templateRoutes.js          # Template routes
│   └── package.json               # Server dependencies
├── api/                           # Vercel serverless functions
│   ├── main.js                    # 🔥 CONSOLIDATED API HANDLER
│   ├── templates.js               # Lists available templates
│   ├── preview/
│   │   └── [templateId].js        # Preview template endpoint
│   └── generate/
│       └── [templateId].js        # Generate template endpoint
├── vercel.json                    # Vercel deployment config
├── package.json                   # Root dependencies
└── Dockerfile                     # Docker configuration
```

---

## 🏗️ Template System Architecture

### How It Works
1. **Template Selection**: User selects template from `TemplateSelector.js`
2. **Form Input**: User fills in product details via `ProductForm.js`
3. **Live Preview**: `TemplatePreview.js` calls consolidated API with form data
4. **SVG Rendering**: API replaces placeholders in SVG template with actual data
5. **Export**: `ExportOptions.js` handles download as PNG or SVG

### Data Flow
```
ProductForm.js → TemplatePreview.js → /api/main?action=render → SVG Template → Live Preview
                                                    ↓
                                            /api/main?action=export → Download File
```

### Key Components

#### ProductForm.js (`client/src/components/products/ProductForm.js`)
- **Dynamic field management**: Supports 1-3 fields per category
- **Section visibility**: Toggle sections on/off
- **Field hiding**: Individual field hide/show functionality
- **Image upload**: Drag & drop with base64 conversion
- **Color extraction**: Automatic color palette generation from images

#### TemplatePreview.js (`client/src/components/templates/TemplatePreview.js`)
- **Multiple API fallbacks**: Tries consolidated API first, then legacy
- **Real-time updates**: Updates preview as user types
- **Error handling**: Comprehensive error display with retry options
- **Field sanitization**: Prevents SVG injection attacks

#### Consolidated API (`api/main.js`)
- **Single entry point**: All API actions through one function
- **Action routing**: Handles `templates`, `render`, `export`, `debug`, `colors`
- **Dynamic field processing**: Automatically handles variable field counts
- **XML escaping**: Prevents SVG corruption from user input

---

## 🎨 Solar Kit Social Template

### Design Features
- **Color Scheme**: Deep blue (#1e3a8a) with orange accent (#f59e0b)
- **Layout**: Professional solar industry design with dynamic sections
- **Sections**: Header, Product Details, Price, Delivery, Contact
- **Size**: 800x1200px (optimized for social media)
- **Dynamic Fields**: Supports 1-3 fields per technical category

### Template Location
**File**: `client/public/templates/solar-kit-social.svg`

### Visual Layout
```
┌─────────────────────────────────────────────────────┐
│ [⭐⭐⭐⭐⭐] RATING_TEXT    |    B SHOCKED           │
│                           |    ELECTRICAL | SOLAR  │
├─────────────────────────────────────────────────────┤
│               SOLAR KIT PACKAGE                     │
├─────────────────────────────────────────────────────┤
│ SKU: PRODUCT_SKU                                    │
├─────────────────────────────────────────────────────┤
│ [Image]        │ PRODUCT DETAILS                    │
│ COMPLETE       │ POWER SYSTEM:                      │
│ SOLAR KIT      │ • Dynamic fields 1-3               │
│                │ SOLAR PANELS:                      │
│                │ • Dynamic fields 1-2               │
│                │ MOUNTING HARDWARE:                 │
│                │ • Dynamic fields 1-3               │
│                │ ELECTRICAL COMPONENTS:             │
│                │ • Dynamic fields 1-3               │
│                │ CABLES & INSTALLATION:             │
│                │ • Dynamic fields 1-3               │
│                │ ADDITIONAL PARTS:                  │
│                │ • Dynamic fields 1-10              │
├─────────────────────────────────────────────────────┤
│ Benefits: ✓ Load Shedding ✓ Reduce Bills ✓ Eco     │
├─────────────────────────────────────────────────────┤
│ Price: R51,779.35 Incl. VAT                        │
├─────────────────────────────────────────────────────┤
│ Delivery: JHB free up to 20km                      │
├─────────────────────────────────────────────────────┤
│ Contact: 011 568 7166 | sales@bshocked.co.za       │
└─────────────────────────────────────────────────────┘
```

---

## 📝 Editable Fields Reference

### Template Management System

The `ProductForm.js` includes advanced field management:

#### Dynamic Category Fields
Each technical category supports variable field counts:
- **Power System**: 1-3 fields (`powerDetail1`, `powerDetail2`, `powerDetail3`)
- **Solar Panels**: 1-2 fields (`panelDetail1`, `panelDetail2`)
- **Mounting Hardware**: 1-3 fields (`mountDetail1`, `mountDetail2`, `mountDetail3`)
- **Electrical Components**: 1-3 fields (`elecDetail1`, `elecDetail2`, `elecDetail3`)
- **Cables & Installation**: 1-3 fields (`cableDetail1`, `cableDetail2`, `cableDetail3`)
- **Additional Parts**: 0-10 fields (`additionalPart1`...`additionalPart10`)

#### Field State Management
```javascript
const [categoryFieldCounts, setCategoryFieldCounts] = useState({
  powerSystem: 2,
  solarPanels: 1,
  mountingHardware: 2,
  electricalComponents: 2,
  cablesInstallation: 2,
  additionalParts: 0
});
```

#### Section Visibility Control
```javascript
const [sectionVisibility, setSectionVisibility] = useState({
  header: true,
  titleSku: true,
  productImage: true,
  powerSystem: true,
  solarPanels: true,
  mountingHardware: true,
  electricalComponents: true,
  cablesInstallation: true,
  additionalParts: true,
  productDescription: true,
  systemBenefits: true,
  priceInformation: true,
  deliveryInformation: true,
  contactInformation: true
});
```

### Solar Kit Social Specific Fields

#### Basic Fields
| Field | SVG Placeholder | Example |
|-------|----------------|---------|
| `ratingText` | `{{RATING_TEXT}}` | "Hellopeter 4.99" |
| `brandText` | `{{BRAND_TEXT}}` | "B SHOCKED" |
| `categoryText` | `{{CATEGORY_TEXT}}` | "ELECTRICAL \| SOLAR" |
| `mainTitle` | `{{MAIN_TITLE}}` | "SOLAR KIT PACKAGE" |
| `sku` | `{{PRODUCT_SKU}}` | "RIIGDEYE-5KW-PACK" |

#### Dynamic Technical Fields
| Category | Field Pattern | SVG Placeholder | Max Fields |
|----------|---------------|----------------|------------|
| Power System | `powerDetail1-3` | `{{POWER_DETAIL_1}}` | 3 |
| Solar Panels | `panelDetail1-2` | `{{PANEL_DETAIL_1}}` | 2 |
| Mounting Hardware | `mountDetail1-3` | `{{MOUNT_DETAIL_1}}` | 3 |
| Electrical Components | `elecDetail1-3` | `{{ELEC_DETAIL_1}}` | 3 |
| Cables & Installation | `cableDetail1-3` | `{{CABLE_DETAIL_1}}` | 3 |
| Additional Parts | `additionalPart1-10` | `{{ADDITIONAL_PART_1}}` | 10 |

#### Contact & Delivery Fields
| Field | SVG Placeholder | Example |
|-------|----------------|---------|
| `contactPhone1` | `{{CONTACT_PHONE_1}}` | "011 568 7166" |
| `contactPhone2` | `{{CONTACT_PHONE_2}}` | "067 923 8166" |
| `contactEmail` | `{{CONTACT_EMAIL}}` | "sales@bshocked.co.za" |
| `contactWebsite` | `{{CONTACT_WEBSITE}}` | "https://bshocked.co.za" |
| `delivery1` | `{{DELIVERY_1}}` | "Delivery JHB free up to 20 km" |
| `delivery2` | `{{DELIVERY_2}}` | "Delivery 60-100 km JHB R440 fee" |
| `delivery3` | `{{DELIVERY_3}}` | "Fee for other regions calculated" |

---

## 🔌 API Endpoints

### Consolidated API: `/api/main`

The main API handler supports multiple actions through query parameters:

#### GET `/api/main?action=templates`
**Purpose**: Get list of available templates
**Returns**: JSON array of template objects
```json
{
  "success": true,
  "data": [
    { "id": "solar-kit-social", "name": "Solar Kit Social" },
    { "id": "debug-simple", "name": "Debug Simple" }
  ],
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

#### GET `/api/main?action=render&templateId=X&field=value`
**Purpose**: Render SVG template with data
**Parameters**: All editable field values as query params
**Returns**: SVG content with placeholders replaced

**Example**:
```
/api/main?action=render&templateId=solar-kit-social&mainTitle=5kW%20Kit&powerDetail1=5kW%20Inverter&powerDetail2=5kWh%20Battery
```

#### POST `/api/main?action=export`
**Purpose**: Export template as downloadable file
**Body**: 
```json
{
  "templateId": "solar-kit-social",
  "productData": {
    "mainTitle": "5kW Solar Kit",
    "powerDetail1": "5kW Deye Hybrid Inverter",
    "powerDetail2": "5.12kWh Dyness Battery"
  }
}
```
**Returns**: SVG file download

#### GET `/api/main?action=debug`
**Purpose**: System status and debug information
**Returns**: Debug SVG showing system status
```svg
<svg>
  <text>Status: All systems operational</text>
  <text>Templates Dir: ✓ Found</text>
  <text>Template Files: 6 found</text>
</svg>
```

### Legacy API Endpoints (Still Available)

#### GET `/api/templates`
**Purpose**: List available templates (legacy)
**File**: `api/templates.js`

#### GET `/api/preview/[templateId]`
**Purpose**: Preview template without data
**File**: `api/preview/[templateId].js`

#### POST `/api/generate/[templateId]`
**Purpose**: Generate template with data
**File**: `api/generate/[templateId].js`

---

## 🔧 Making Template Refinements

### Common Refinement Tasks

#### 1. Adding New Dynamic Fields to Existing Categories

**Step 1**: Update maximum field count in `ProductForm.js`
```javascript
const maxFields = {
  powerSystem: 4, // Increased from 3
  solarPanels: 2,
  mountingHardware: 3,
  electricalComponents: 3,
  cablesInstallation: 3,
  additionalParts: 10
};
```

**Step 2**: Add placeholder to SVG template
```xml
<!-- In solar-kit-social.svg -->
<text x="295" y="435" fill="white" font-family="Arial, sans-serif" font-size="12">{{POWER_DETAIL_4}}</text>
```

**Step 3**: Update API processing in `api/main.js`
```javascript
// Already handles dynamic fields automatically
Object.keys(dynamicFields.powerDetails).forEach(num => {
  const placeholder = `\\{\\{POWER_DETAIL_${num}\\}\\}`;
  const value = dynamicFields.powerDetails[num];
  if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
});
```

#### 2. Modifying Field Placeholder Mapping

The API uses a mapping system for dynamic field detection:

```javascript
// In api/main.js - handleRender function
Object.keys(req.query).forEach(key => {
  if (key.startsWith('powerDetail')) {
    const number = key.replace('powerDetail', '');
    dynamicFields.powerDetails[number] = req.query[key];
  }
  // Add new category here
  else if (key.startsWith('warrantyDetail')) {
    const number = key.replace('warrantyDetail', '');
    dynamicFields.warrantyDetails[number] = req.query[key];
  }
});
```

#### 3. Updating Text Positioning and Styling

**SVG Coordinate System**: Origin (0,0) is top-left
- `x`: Horizontal position (left to right)
- `y`: Vertical position (top to bottom)

**Common Adjustments**:
```xml
<!-- Move text right and down -->
<text x="310" y="415" fill="white" font-size="12">{{POWER_DETAIL_2}}</text>

<!-- Change color and size -->
<text x="290" y="375" fill="#fbbf24" font-size="14" font-weight="bold">POWER SYSTEM:</text>

<!-- Center text -->
<text x="400" y="200" text-anchor="middle" font-weight="bold">{{MAIN_TITLE}}</text>
```

#### 4. Adding New Template Sections

**Step 1**: Add section to `ProductForm.js`
```javascript
// Add to sectionVisibility state
const [sectionVisibility, setSectionVisibility] = useState({
  // ... existing sections
  warranties: true // New section
});

// Add render section call
{renderSection('warranties', 'Warranty Information', (
  <>
    {renderField('warrantyTitle', 'Warranty Title', 'Extended Warranty Package')}
    {renderField('warrantyPeriod', 'Warranty Period', '10 Year Full Coverage')}
  </>
))}
```

**Step 2**: Add SVG section to template
```xml
<!-- Warranty Section -->
<text x="290" y="500" fill="#fbbf24" font-family="Arial, sans-serif" font-size="14" font-weight="bold">{{WARRANTY_TITLE}}</text>
<text x="295" y="520" fill="white" font-family="Arial, sans-serif" font-size="12">{{WARRANTY_PERIOD}}</text>
```

**Step 3**: Add field processing to API
```javascript
// In api/main.js - handleRender function
if (req.query.warrantyTitle) svgContent = svgContent.replace(/\{\{WARRANTY_TITLE\}\}/g, escapeXML(req.query.warrantyTitle));
if (req.query.warrantyPeriod) svgContent = svgContent.replace(/\{\{WARRANTY_PERIOD\}\}/g, escapeXML(req.query.warrantyPeriod));
```

---

## ➕ Adding New Templates

### Step 1: Create SVG Template
1. Design SVG with placeholder syntax: `{{FIELD_NAME}}`
2. Save as `client/public/templates/template-name.svg`
3. Use proper XML escaping for special characters

### Step 2: Register Template
**File**: `api/main.js` (and `api/templates.js` for legacy)
```javascript
// In handleTemplates function
const templates = [
  // ... existing templates
  { id: 'new-template-name', name: 'Display Name' }
];
```

### Step 3: Add Template-Specific Logic (Optional)
```javascript
// In api/main.js - handleRender function
if (templateId === 'new-template-name') {
  // Add custom field processing
  if (req.query.customField) {
    svgContent = svgContent.replace(/\{\{CUSTOM_FIELD\}\}/g, escapeXML(req.query.customField));
  }
}
```

### Step 4: Add Form Fields (Optional)
If template needs specific fields, add them to `ProductForm.js`:
```javascript
// Add to template-specific section
if (template.id === 'new-template-name') {
  // Add custom form fields
  addParam('customField', sanitizeText(productData?.customField));
}
```

---

## 🛠️ Troubleshooting Guide

### Common Issues

#### 1. Template Not Showing in Dropdown
**Check**:
- Is template added to `api/main.js` templates array?
- Is SVG file in correct location (`client/public/templates/`)?
- Are there any typos in template ID?
- Check browser console for API errors

#### 2. Fields Not Updating in Preview
**Check**:
- Is field passed in `TemplatePreview.js`?
- Does placeholder exist in SVG template?
- Is field processing in `api/main.js` handleRender?
- Check network tab for API parameters

#### 3. SVG Not Rendering
**Check**:
- Is SVG syntax valid? (Use online SVG validator)
- Are XML entities escaped properly?
- Check for missing closing tags
- Verify placeholder format: `{{FIELD_NAME}}`

#### 4. API Endpoint Issues
**Check**:
- Are you using consolidated API: `/api/main?action=render`?
- Check Vercel function logs for errors
- Verify file paths (case sensitive on production)
- Test with debug endpoint: `/api/main?action=debug`

#### 5. Dynamic Fields Not Working
**Check**:
- Field naming pattern: `categoryDetailN` (e.g., `powerDetail1`)
- SVG placeholder: `{{CATEGORY_DETAIL_N}}` (e.g., `{{POWER_DETAIL_1}}`)
- Field count within maximum limits
- API processing includes the category

### Debug Steps
1. **Check API status**: Visit `/api/main?action=debug`
2. **Test template direct**: `/api/main?action=render&templateId=solar-kit-social&mainTitle=Test`
3. **Check browser console** for JavaScript errors
4. **Check network tab** for API request/response
5. **Validate SVG** with online SVG validator

---

## 🚀 Development Scripts

### Available Scripts

From root directory:
```bash
# Install dependencies
npm install

# Start client development server
cd client && npm start

# Build client for production
cd client && npm run build

# Run client tests
cd client && npm test
```

From client directory:
```bash
# Start development server (http://localhost:3000)
npm start

# Build for production
npm run build

# Run tests
npm test

# Eject from create-react-app (irreversible)
npm run eject
```

### Environment Variables

**Local Development** (`.env.local`):
```
REACT_APP_API_URL=http://localhost:3000/api
```

**Production** (Vercel):
```
CI=false  # Configured in vercel.json
```

### Deployment

**Vercel Configuration** (`vercel.json`):
```json
{
  "version": 2,
  "buildCommand": "npm install && cd client && npm install && npm run build",
  "outputDirectory": "client/build",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ],
  "env": {
    "CI": "false"
  }
}
```

**Build Process**:
1. Install root dependencies
2. Install client dependencies
3. Build React app
4. Deploy to Vercel with API functions

---

## 💻 Code Snippets

### Add New Product Detail Category

#### 1. ProductForm.js - Add Category to Form
```javascript
// Add to maxFields object
const maxFields = {
  // ... existing fields
  newCategory: 3
};

// Add to categoryFieldCounts state
const [categoryFieldCounts, setCategoryFieldCounts] = useState({
  // ... existing categories
  newCategory: 2
});

// Add to sectionVisibility state
const [sectionVisibility, setSectionVisibility] = useState({
  // ... existing sections
  newCategory: true
});

// Add render section call
{renderSection('newCategory', 'New Category Details', (
  renderCategoryFields('newCategory', 'New Detail', [
    '• First new category item',
    '• Second new category item',
    '• Third new category item'
  ])
))}
```

#### 2. TemplatePreview.js - Add Field Processing
```javascript
// In solar-kit-social section
// Dynamic New Category fields (1-3 fields)
for (let i = 1; i <= 3; i++) {
  const fieldName = `newCategoryDetail${i}`;
  if (productData?.[fieldName]) {
    addParam(fieldName, sanitizeText(productData[fieldName]));
  }
}
```

#### 3. API main.js - Add Dynamic Field Processing
```javascript
// In handleRender function, add to dynamic fields extraction
Object.keys(req.query).forEach(key => {
  // ... existing field processing
  else if (key.startsWith('newCategoryDetail')) {
    const number = key.replace('newCategoryDetail', '');
    dynamicFields.newCategoryDetails[number] = req.query[key];
  }
});

// Add to dynamicFields object
const dynamicFields = {
  // ... existing fields
  newCategoryDetails: {}
};

// Add field replacement logic
Object.keys(dynamicFields.newCategoryDetails).forEach(num => {
  const placeholder = `\\{\\{NEW_CATEGORY_DETAIL_${num}\\}\\}`;
  const value = dynamicFields.newCategoryDetails[num];
  if (value) svgContent = svgContent.replace(new RegExp(placeholder, 'g'), escapeXML(value));
});
```

#### 4. SVG Template - Add Display Section
```xml
<!-- New Category Section -->
<text x="290" y="450" fill="#fbbf24" font-family="Arial, sans-serif" font-size="14" font-weight="bold">NEW CATEGORY:</text>
<text x="295" y="470" fill="white" font-family="Arial, sans-serif" font-size="12">{{NEW_CATEGORY_DETAIL_1}}</text>
<text x="295" y="490" fill="white" font-family="Arial, sans-serif" font-size="12">{{NEW_CATEGORY_DETAIL_2}}</text>
<text x="295" y="510" fill="white" font-family="Arial, sans-serif" font-size="12">{{NEW_CATEGORY_DETAIL_3}}</text>
```

### Add Static Field to Template

#### 1. ProductForm.js - Add Field to Form
```javascript
// Add to appropriate section
{renderField('newStaticField', 'New Static Field', 'Default placeholder text')}
```

#### 2. TemplatePreview.js - Add Parameter
```javascript
// Add to parameter building
addParam('newStaticField', sanitizeText(productData?.newStaticField));
```

#### 3. API main.js - Add Field Processing
```javascript
// In handleRender function
const { newStaticField } = req.query;
if (newStaticField) svgContent = svgContent.replace(/\{\{NEW_STATIC_FIELD\}\}/g, escapeXML(newStaticField));
```

#### 4. SVG Template - Add Display
```xml
<text x="295" y="530" fill="white" font-family="Arial, sans-serif" font-size="12">{{NEW_STATIC_FIELD}}</text>
```

### Debug Template Issues

#### Create Simple Debug Template
```javascript
// In api/main.js - handleRender function
if (templateId === 'debug-test') {
  const debugSvg = `<svg width="400" height="300" xmlns="http://www.w3.org/2000/svg">
    <rect width="400" height="300" fill="#f0f0f0"/>
    <text x="200" y="50" text-anchor="middle" font-size="20" font-weight="bold">Debug Template</text>
    <text x="20" y="100" font-size="14">Main Title: ${escapeXML(req.query.mainTitle || 'Not provided')}</text>
    <text x="20" y="130" font-size="14">SKU: ${escapeXML(req.query.sku || 'Not provided')}</text>
    <text x="20" y="160" font-size="14">Power Detail 1: ${escapeXML(req.query.powerDetail1 || 'Not provided')}</text>
    <text x="20" y="190" font-size="14">Total Fields: ${Object.keys(req.query).length}</text>
    <text x="20" y="220" font-size="12">Time: ${new Date().toISOString()}</text>
  </svg>`;
  
  res.setHeader('Content-Type', 'image/svg+xml');
  return res.status(200).send(debugSvg);
}
```

### Handle Image Upload and Processing

#### ProductForm.js - Enhanced Image Handling
```javascript
// In dropzone onDrop handler
onDrop: async (acceptedFiles) => {
  if (acceptedFiles.length > 0) {
    const file = acceptedFiles[0];
    
    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File too large. Maximum size is 5MB.');
      return;
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      alert('Invalid file type. Please use JPEG, PNG, or WebP.');
      return;
    }
    
    // Convert to base64 for SVG embedding
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64Image = event.target.result;
      onProductChange({ 
        image: base64Image,
        imageFileName: file.name,
        imageSize: file.size
      });
    };
    reader.readAsDataURL(file);
  }
}
```

---

## 📋 Next Steps & Best Practices

### Code Quality
- Keep API functions under 12 (Vercel limit)
- Use consolidated API pattern for new endpoints
- Implement proper error handling in all components
- Add input validation for all form fields

### Performance
- Optimize SVG templates for fast rendering
- Use lazy loading for template previews
- Implement caching for frequently used templates
- Minimize API response sizes

### Security
- Always escape user input in SVG templates
- Validate file uploads (size, type, content)
- Implement rate limiting for API endpoints
- Never expose sensitive data in client-side code

### Testing
- Test templates with various data combinations
- Verify export functionality works correctly
- Test mobile responsiveness
- Validate accessibility compliance

### Monitoring
- Track API usage and performance
- Monitor error rates and types
- Log template generation statistics
- Set up alerts for system issues

---

## 🔗 Support & Maintenance

### Key Files to Monitor
- `api/main.js` - Consolidated API handler
- `client/src/components/products/ProductForm.js` - Form fields and logic
- `client/src/components/templates/TemplatePreview.js` - Preview functionality
- `client/public/templates/solar-kit-social.svg` - Main template

### Deployment Commands
```bash
# Deploy to Vercel
vercel --prod

# Check deployment status
vercel ls

# View logs
vercel logs
```

### Emergency Debugging
1. Check API status: `/api/main?action=debug`
2. Test template direct: `/api/main?action=render&templateId=solar-kit-social&mainTitle=Test`
3. Check Vercel function logs
4. Verify file structure in deployment

---

**Last Updated**: January 2025  
**Version**: 2.0  
**System Status**: ✅ Production Ready with Consolidated API

---

*This knowledge base should be updated whenever significant changes are made to the template system. Keep it as your reference for all development, maintenance, and troubleshooting tasks.*