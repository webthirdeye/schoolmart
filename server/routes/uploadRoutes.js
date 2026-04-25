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
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit for images/files
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp|gif|svg|pdf|heic|avif|csv/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = /image\/|application\/pdf|image\/svg|text\/csv/.test(file.mimetype) || file.mimetype.includes('heic') || file.mimetype.includes('avif');
    if (extname || mimetype) return cb(null, true);
    cb(new Error('Allowed: JPG, PNG, WEBP, GIF, SVG, PDF, CSV, HEIC, AVIF'));
  }
});

// Separate uploader for system backups (used in /import)
const backupUpload = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB for backups
  fileFilter: (req, file, cb) => {
    const filetypes = /tar|gz/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (extname) return cb(null, true);
    cb(new Error('Allowed: .tar.gz backups only'));
  }
});

// Single File Upload
router.post('/', (req, res, next) => {
  console.log('Upload request received');
  console.log('Headers:', req.headers);
  next();
}, upload.single('file'), (req, res) => {
  if (!req.file) {
    console.error('No file in request');
    return res.status(400).json({ message: 'No file uploaded' });
  }
  console.log('File uploaded successfully:', req.file.filename);
  const url = `/uploads/${req.file.filename}`;
  res.json({ url, filename: req.file.filename, message: 'Upload successful' });
});

// Debug Route to check directory status
router.get('/status', (req, res) => {
  try {
    const isWritable = fs.accessSync(uploadDir, fs.constants.W_OK) === undefined;
    res.json({
      uploadDir,
      exists: fs.existsSync(uploadDir),
      writable: true,
      env: process.env.UPLOAD_DIR || 'not set'
    });
  } catch (err) {
    res.json({
      uploadDir,
      exists: fs.existsSync(uploadDir),
      writable: false,
      error: err.message
    });
  }
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
  const { spawn } = require('child_process');
  
  if (!fs.existsSync(uploadDir)) {
    return res.status(404).json({ message: 'No uploads found' });
  }

  res.setHeader('Content-disposition', `attachment; filename=schoolmart_uploads_backup_${Date.now()}.tar.gz`);
  res.setHeader('Content-type', 'application/gzip');

  // Use spawn for safe binary streaming
  const tar = spawn('tar', ['-czf', '-', '.'], { cwd: uploadDir });
  
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
router.post('/import', backupUpload.single('backup'), (req, res) => {
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
