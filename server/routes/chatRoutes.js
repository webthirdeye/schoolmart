const express = require('express');
const router = express.Router();
const { chat, getGreeting, getLeads, updateLeadStatus, deleteLead } = require('../controllers/chatController');

// POST /api/chat — Main conversation endpoint
router.post('/', chat);

// GET /api/chat/greeting?page=/labs — Page-specific greeting
router.get('/greeting', getGreeting);

// GET /api/chat/leads — Admin: list all chat leads
router.get('/leads', getLeads);

// PUT /api/chat/leads/:id/status — Admin: update lead status
router.put('/leads/:id/status', updateLeadStatus);

// DELETE /api/chat/leads/:id — Admin: delete a lead
router.delete('/leads/:id', deleteLead);

module.exports = router;
