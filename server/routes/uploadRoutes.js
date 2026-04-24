const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Use an absolute path for the uploads directory
const uploadDir = process.env.UPLOAD_DIR || path.join(__dirname, '..', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage Strategy
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB per file
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg|pdf|heic|avif|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/|application\/pdf|image\/svg|text\/csv/.test(file.mimetype) || file.mimetype.includes('heic') || file.mimetype.includes('avif') || file.mimetype === 'application/octet-stream';
    if (extname || mimetype) return cb(null, true);
    cb(new Error('Allowed: JPG, PNG, WEBP, GIF, SVG, PDF, CSV, HEIC, AVIF'));
  }
});

// Single File Upload
router.post('/', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, message: 'Upload successful' });
});

// Multiple Files Upload
router.post('/bulk', upload.any(), (req, res) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ message: 'No files uploaded' });
  const urls = req.files.map(f => `/uploads/${f.filename}`);
  res.json({ urls, message: 'Bulk upload successful' });
});

// Multer error handler — returns JSON instead of Express default HTML
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `Upload error: ${err.message}` });
  }
  if (err) {
    return res.status(400).json({ message: err.message || 'Upload failed' });
  }
  next();
});

// Admin Backup Route: Download all uploads as a compressed tarball
router.get('/export', (req, res) => {
  const { exec } = require('child_process');
  
  if (!fs.existsSync(uploadDir)) {
    return res.status(404).json({ message: 'No uploads found' });
  }

  res.setHeader('Content-disposition', `attachment; filename=schoolmart_uploads_backup_${Date.now()}.tar.gz`);
  res.setHeader('Content-type', 'application/gzip');

  // Use tar to compress the entire uploads directory to stdout
  const tar = exec('tar -czf - .', { cwd: uploadDir, maxBuffer: 1024 * 1024 * 500 });
  
  tar.stdout.pipe(res);
  tar.stderr.on('data', (data) => console.error(`tar stderr: ${data}`));
  
  tar.on('close', (code) => {
    if (code !== 0) {
      console.error(`tar process exited with code ${code}`);
      if (!res.headersSent) {
        res.status(500).end();
      }
    }
  });
});

// Admin Restore Route: Upload a .tar.gz backup and extract it into uploads
router.post('/import', upload.single('backup'), (req, res) => {
  const { exec } = require('child_process');
  
  if (!req.file) {
    return res.status(400).json({ message: 'No backup file provided' });
  }

  const tarballPath = req.file.path;

  // Extract the tarball into the upload directory
  exec(`tar -xzf "${tarballPath}" -C "${uploadDir}"`, (error, stdout, stderr) => {
    // Delete the uploaded tarball after extraction
    fs.unlink(tarballPath, (err) => {
      if (err) console.error('Failed to delete temporary tarball:', err);
    });

    if (error) {
      console.error(`tar extraction error: ${error.message}`);
      return res.status(500).json({ message: 'Failed to extract backup' });
    }

    res.json({ message: 'Uploads successfully restored!' });
  });
});

module.exports = router;
