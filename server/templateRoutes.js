const express = require('express');
const router = express.Router();
const templateController = require('../templateController');
const multer = require('multer');
const upload = multer({ storage: multer.memoryStorage() });

// Get all templates
router.get('/', templateController.getAllTemplates);

// Get a specific template
router.get('/:id', templateController.getTemplateById);

// Generate an image from a template
router.post('/generate', upload.single('productImage'), templateController.generateImage);

module.exports = router;
