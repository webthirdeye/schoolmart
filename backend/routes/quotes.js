const express = require('express');
const router = express.Router();
const Quote = require('../models/Quote');
const auth = require('../middleware/auth');
const { adminOnly } = require('../middleware/auth');
const { sendQuoteEmail } = require('../utils/mailer');

// POST /api/quotes  — public (submit quote)
router.post('/', async (req, res) => {
  try {
    const { schoolName, pinCode, message, email, phone } = req.body;
    if (!schoolName) return res.status(400).json({ message: 'School name is required' });
    
    const quote = await Quote.create({ schoolName, pinCode, message, email, phone });
    
    // Send email notification to admin asynchronously
    sendQuoteEmail(quote).catch(err => console.error('Silent fail on quote email:', err));

    res.status(201).json({ message: 'Quote submitted successfully', quote });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/quotes  — admin only
router.get('/', auth, adminOnly, async (req, res) => {
  try {
    const { status } = req.query;
    const filter = status ? { status } : {};
    const quotes = await Quote.find(filter).sort({ createdAt: -1 });
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PATCH /api/quotes/:id/status  — admin
router.patch('/:id/status', auth, adminOnly, async (req, res) => {
  try {
    const quote = await Quote.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    if (!quote) return res.status(404).json({ message: 'Quote not found' });
    res.json(quote);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/quotes/:id  — admin
router.delete('/:id', auth, adminOnly, async (req, res) => {
  try {
    await Quote.findByIdAndDelete(req.params.id);
    res.json({ message: 'Quote deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
