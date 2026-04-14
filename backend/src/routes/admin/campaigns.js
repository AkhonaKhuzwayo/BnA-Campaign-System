const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const db = require('../../config/db');

router.get('/', async (req, res, next) => {
  try {
    const campaigns = await db('campaigns').orderBy('id');
    res.json(campaigns);
  } catch (err) { next(err); }
});

router.post('/', [body('name').trim().notEmpty()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const [id] = await db('campaigns').insert({ name: req.body.name, is_active: true });
    res.status(201).json({ id, name: req.body.name, is_active: true });
  } catch (err) { next(err); }
});

router.put('/:id', [body('name').optional().trim().notEmpty(), body('is_active').optional().isBoolean()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const updates = {};
    if (req.body.name !== undefined) updates.name = req.body.name;
    if (req.body.is_active !== undefined) updates.is_active = req.body.is_active === true || req.body.is_active === 'true';
    await db('campaigns').where({ id: req.params.id }).update(updates);
    res.json({ success: true });
  } catch (err) { next(err); }
});

router.delete('/:id', async (req, res, next) => {
  try {
    await db('campaigns').where({ id: req.params.id }).update({ is_active: false });
    res.json({ success: true });
  } catch (err) { next(err); }
});

module.exports = router;
