/**
 * This file re-exports SVG utilities from the services directory
 * to maintain compatibility with existing import paths
 */

// Import from the correct location
import {
  processTemplate,
  svgToDataUrl,
  svgToPngDataUrl
} from '../services/svgUtils';

// Re-export everything
export {
  processTemplate,
  svgToDataUrl,
  svgToPngDataUrl
};
