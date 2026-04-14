const router = require('express').Router();
const path = require('path');
const fs = require('fs');
const db = require('../../config/db');

// GET /api/admin/documents/:docId/download
router.get('/:docId/download', async (req, res, next) => {
  try {
    const doc = await db('documents').where({ id: req.params.docId }).first();
    if (!doc) return res.status(404).json({ error: 'Document not found' });
    const absPath = path.resolve(doc.file_path);
    if (!fs.existsSync(absPath)) return res.status(404).json({ error: 'File not found on disk' });
    res.download(absPath, doc.original_filename);
  } catch (err) { next(err); }
});

module.exports = router;
