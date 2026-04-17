const express = require('express');
const router = express.Router();
const { getAllPages, getPageContent, updateBlock, addBlock, deleteBlock, deletePage, createPage } = require('../controllers/cmsController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes for frontend fetching
router.get('/pages', getAllPages);
router.get('/pages/:slug', getPageContent);

// Protected Admin routes
router.post('/pages', protect, admin, createPage);
router.post('/blocks', protect, admin, addBlock);
router.put('/blocks', protect, admin, updateBlock);
router.delete('/blocks/:id', protect, admin, deleteBlock);
router.delete('/pages/:slug', protect, admin, deletePage);

module.exports = router;



