const router = require('express').Router();
const db = require('../config/db');
const { verifyToken, attachUser } = require('../middleware/auth');

const auth = [verifyToken, attachUser];

// POST /api/clock/in
router.post('/in', auth, async (req, res, next) => {
  try {
    const empId = req.employee.id;
    const campaignId = req.user.campaignId;
    const open = await db('clock_sessions').where({ employee_id: empId }).whereNull('clock_out_time').first();
    if (open) return res.status(400).json({ error: 'Already clocked in. Please clock out first.' });
    const [id] = await db('clock_sessions').insert({
      employee_id: empId,
      campaign_id: campaignId,
      clock_in_time: new Date().toISOString()
    });
    res.status(201).json({ id, clock_in_time: new Date().toISOString() });
  } catch (err) { next(err); }
});

// POST /api/clock/out
router.post('/out', auth, async (req, res, next) => {
  try {
    const empId = req.employee.id;
    const open = await db('clock_sessions').where({ employee_id: empId }).whereNull('clock_out_time').first();
    if (!open) return res.status(400).json({ error: 'Not clocked in.' });
    const now = new Date().toISOString();
    await db('clock_sessions').where({ id: open.id }).update({ clock_out_time: now });
    res.json({ id: open.id, clock_out_time: now });
  } catch (err) { next(err); }
});

// GET /api/clock/status
router.get('/status', auth, async (req, res, next) => {
  try {
    const open = await db('clock_sessions').where({ employee_id: req.employee.id }).whereNull('clock_out_time').orderBy('created_at', 'desc').first();
    if (open) {
      res.json({ status: 'in', session: open });
    } else {
      const last = await db('clock_sessions').where({ employee_id: req.employee.id }).orderBy('created_at', 'desc').first();
      res.json({ status: 'out', lastSession: last || null });
    }
  } catch (err) { next(err); }
});

module.exports = router;
