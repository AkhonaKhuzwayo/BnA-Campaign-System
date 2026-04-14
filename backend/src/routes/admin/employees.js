const router = require('express').Router();
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');
const db = require('../../config/db');
const { generatePassword } = require('../../utils/passwordGen');

// GET /api/admin/employees
router.get('/', async (req, res, next) => {
  try {
    const { type, campaign_id } = req.query;
    let q = db('employees').select('employees.*', 'campaigns.name as campaign_name')
      .leftJoin('campaigns', 'employees.campaign_id', 'campaigns.id')
      .where('employees.is_admin', false);
    if (type === 'bna') q = q.where('employees.is_bna_official', true);
    if (type === 'spot') q = q.where('employees.is_bna_official', false);
    if (campaign_id) q = q.where('employees.campaign_id', parseInt(campaign_id));
    const rows = await q.orderBy('employees.created_at', 'desc');
    res.json(rows.map(r => ({ ...r, password_hash: undefined })));
  } catch (err) { next(err); }
});

// POST /api/admin/employees
router.post('/', [
  body('first_name').trim().notEmpty(),
  body('last_name').trim().notEmpty(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('is_bna_official').isBoolean(),
  body('campaign_id').optional().isInt()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { first_name, last_name, phone, email, is_bna_official, campaign_id } = req.body;
    const plainPassword = generatePassword();
    const username = (first_name.toLowerCase().replace(/\s+/g,'') + '.' + last_name.toLowerCase().replace(/\s+/g,'') + Math.floor(Math.random()*100)).slice(0,30);
    const password_hash = await bcrypt.hash(plainPassword, 10);
    const [id] = await db('employees').insert({
      first_name, last_name, phone: phone||'', email: email||'',
      is_bna_official: is_bna_official === true || is_bna_official === 'true',
      campaign_id: campaign_id ? parseInt(campaign_id) : null,
      username, password_hash, is_admin: false, is_active: true
    });
    if (req.employee) {
      await db('admin_logs').insert({ admin_id: req.employee.id, action: 'CREATE_EMPLOYEE', target_id: String(id) });
    }
    res.status(201).json({ id, username, password: plainPassword });
  } catch (err) { next(err); }
});

// GET /api/admin/employees/:id
router.get('/:id', async (req, res, next) => {
  try {
    const emp = await db('employees').select('employees.*','campaigns.name as campaign_name')
      .leftJoin('campaigns','employees.campaign_id','campaigns.id')
      .where('employees.id', req.params.id).first();
    if (!emp) return res.status(404).json({ error: 'Employee not found' });
    const { password_hash, ...safe } = emp;
    res.json(safe);
  } catch (err) { next(err); }
});

// PUT /api/admin/employees/:id
router.put('/:id', [
  body('first_name').optional().trim().notEmpty(),
  body('last_name').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('email').optional().isEmail(),
  body('is_active').optional().isBoolean(),
  body('campaign_id').optional().isInt()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { first_name, last_name, phone, email, is_active, campaign_id, reset_password } = req.body;
    const updates = {};
    if (first_name !== undefined) updates.first_name = first_name;
    if (last_name !== undefined) updates.last_name = last_name;
    if (phone !== undefined) updates.phone = phone;
    if (email !== undefined) updates.email = email;
    if (is_active !== undefined) updates.is_active = is_active === true || is_active === 'true';
    if (campaign_id !== undefined) updates.campaign_id = campaign_id ? parseInt(campaign_id) : null;
    let newPassword = null;
    if (reset_password) {
      newPassword = generatePassword();
      updates.password_hash = await bcrypt.hash(newPassword, 10);
    }
    await db('employees').where({ id: req.params.id }).update(updates);
    if (req.employee) {
      await db('admin_logs').insert({ admin_id: req.employee.id, action: 'UPDATE_EMPLOYEE', target_id: req.params.id });
    }
    res.json({ success: true, ...(newPassword ? { new_password: newPassword } : {}) });
  } catch (err) { next(err); }
});

// GET /api/admin/employees/:id/documents
router.get('/:id/documents', async (req, res, next) => {
  try {
    const docs = await db('documents').where({ employee_id: req.params.id });
    res.json(docs);
  } catch (err) { next(err); }
});

module.exports = router;
