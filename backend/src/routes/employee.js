const router = require('express').Router();
const path = require('path');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { verifyToken, attachUser } = require('../middleware/auth');
const { documentUpload } = require('../middleware/upload');

const auth = [verifyToken, attachUser];

// GET /api/employee/profile
router.get('/profile', auth, async (req, res, next) => {
  try {
    const emp = req.employee;
    res.json({
      id: emp.id, first_name: emp.first_name, last_name: emp.last_name,
      phone: emp.phone, email: emp.email, home_address: emp.home_address,
      is_bna_official: emp.is_bna_official, campaign_id: emp.campaign_id
    });
  } catch (err) { next(err); }
});

// PUT /api/employee/profile
router.put('/profile', auth, [
  body('home_address').trim().notEmpty().withMessage('Home address is required')
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    await db('employees').where({ id: req.employee.id }).update({ home_address: req.body.home_address });
    res.json({ success: true });
  } catch (err) { next(err); }
});

// POST /api/employee/documents
router.post('/documents', auth, documentUpload.single('file'), [
  body('document_type').isIn(['id_copy','bank_proof','residence','contract'])
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  if (!req.file) return res.status(400).json({ error: 'No file uploaded' });
  try {
    const doc = {
      employee_id: req.employee.id,
      document_type: req.body.document_type,
      file_path: req.file.path,
      original_filename: req.file.originalname
    };
    const [id] = await db('documents').insert(doc);
    res.status(201).json({ id, ...doc });
  } catch (err) { next(err); }
});

// GET /api/employee/documents
router.get('/documents', auth, async (req, res, next) => {
  try {
    const docs = await db('documents').where({ employee_id: req.employee.id });
    res.json(docs.map(d => ({ id: d.id, document_type: d.document_type, original_filename: d.original_filename, uploaded_at: d.uploaded_at })));
  } catch (err) { next(err); }
});

module.exports = router;
