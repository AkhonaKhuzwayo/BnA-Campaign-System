const router = require('express').Router();
const db = require('../../config/db');

// GET /api/admin/logs
router.get('/', async (req, res, next) => {
  try {
    const { campaign_id, employee_id, from, to } = req.query;
    let q = db('clock_sessions')
      .select('clock_sessions.*',
        db.raw("e.first_name || ' ' || e.last_name as employee_name"),
        'c.name as campaign_name')
      .join('employees as e', 'clock_sessions.employee_id', 'e.id')
      .leftJoin('campaigns as c', 'clock_sessions.campaign_id', 'c.id');
    if (campaign_id) q = q.where('clock_sessions.campaign_id', parseInt(campaign_id));
    if (employee_id) q = q.where('clock_sessions.employee_id', parseInt(employee_id));
    if (from) q = q.where('clock_sessions.clock_in_time', '>=', from);
    if (to) q = q.where('clock_sessions.clock_in_time', '<=', to);
    const sessions = await q.orderBy('clock_sessions.clock_in_time', 'desc');
    res.json(sessions);
  } catch (err) { next(err); }
});

// GET /api/admin/logs/activations
router.get('/activations', async (req, res, next) => {
  try {
    const { campaign_id, employee_id, location, from, to } = req.query;
    let q = db('activations')
      .select('activations.*',
        db.raw("e.first_name || ' ' || e.last_name as employee_name"),
        'c.name as campaign_name')
      .join('employees as e', 'activations.employee_id', 'e.id')
      .leftJoin('campaigns as c', 'activations.campaign_id', 'c.id');
    if (campaign_id) q = q.where('activations.campaign_id', parseInt(campaign_id));
    if (employee_id) q = q.where('activations.employee_id', parseInt(employee_id));
    if (location) q = q.where('activations.location', location);
    if (from) q = q.where('activations.activation_time', '>=', from);
    if (to) q = q.where('activations.activation_time', '<=', to);
    const rows = await q.orderBy('activations.activation_time', 'desc');
    res.json(rows);
  } catch (err) { next(err); }
});

module.exports = router;
