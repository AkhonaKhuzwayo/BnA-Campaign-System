const router = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const { verifyToken, attachUser } = require('../middleware/auth');
const { photoUpload } = require('../middleware/upload');
const { validateSAId } = require('../utils/saIdValidator');

const auth = [verifyToken, attachUser];

// POST /api/activations/photos
router.post('/photos', auth, photoUpload.array('photos', 20), async (req, res, next) => {
  if (!req.files || req.files.length === 0) return res.status(400).json({ error: 'No photos uploaded' });
  try {
    const batchId = uuidv4();
    const rows = req.files.map(f => ({ batch_id: batchId, file_path: f.path }));
    await db('activation_photos').insert(rows);
    res.status(201).json({ batch_id: batchId, count: rows.length });
  } catch (err) { next(err); }
});

// POST /api/activations
router.post('/', auth, [
  body('batch_id').notEmpty(),
  body('location').isIn(['DUT','UKZN','MUT']),
  body('customers').isArray({ min: 1 }),
  body('customers.*.first_name').trim().notEmpty(),
  body('customers.*.surname').trim().notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { batch_id, location, customers } = req.body;
    const campaignId = req.user.campaignId;
    const now = new Date().toISOString();
    const rows = customers.map(c => {
      if (c.id_number && !validateSAId(c.id_number)) {
        throw { status: 400, message: `Invalid SA ID number for ${c.first_name} ${c.surname}` };
      }
      return {
        employee_id: req.employee.id,
        campaign_id: campaignId,
        location,
        customer_first_name: c.first_name,
        customer_surname: c.surname,
        customer_id_number: c.id_number || null,
        activation_time: now,
        batch_id
      };
    });
    await db('activations').insert(rows);
    res.status(201).json({ inserted: rows.length });
  } catch (err) {
    if (err.status) return res.status(err.status).json({ error: err.message });
    next(err);
  }
});

module.exports = router;
