const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const db = require('../config/db');
const jwtConfig = require('../config/jwt');
const { verifyToken } = require('../middleware/auth');

function signAccess(payload) {
  return jwt.sign(payload, jwtConfig.secret, { expiresIn: jwtConfig.expiresIn });
}
function signRefresh(payload) {
  return jwt.sign(payload, jwtConfig.refreshSecret, { expiresIn: jwtConfig.refreshExpiresIn });
}

// POST /api/auth/login/official
router.post('/login/official', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { username, password } = req.body;
    const emp = await db('employees').where({ username, is_bna_official: true, is_active: true }).first();
    if (!emp) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, emp.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const campaigns = await db('campaigns').where({ is_active: true });
    const payload = { sub: emp.id, role: 'employee', isBnaOfficial: true, campaignId: null };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    res.json({ accessToken, refreshToken, requiresCampaignSelect: true, campaigns, employee: { id: emp.id, first_name: emp.first_name, last_name: emp.last_name } });
  } catch (err) { next(err); }
});

// POST /api/auth/login/guest
router.post('/login/guest', [
  body('username').trim().notEmpty(),
  body('password').notEmpty(),
  body('campaign_id').isInt()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { username, password, campaign_id } = req.body;
    const emp = await db('employees').where({ username, campaign_id: parseInt(campaign_id), is_bna_official: false, is_active: true }).first();
    if (!emp) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, emp.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { sub: emp.id, role: 'employee', isBnaOfficial: false, campaignId: emp.campaign_id };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    res.json({ accessToken, refreshToken, requiresCampaignSelect: false, employee: { id: emp.id, first_name: emp.first_name, last_name: emp.last_name, campaign_id: emp.campaign_id } });
  } catch (err) { next(err); }
});

// POST /api/auth/login/admin
router.post('/login/admin', [
  body('username').trim().notEmpty(),
  body('password').notEmpty()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { username, password } = req.body;
    const emp = await db('employees').where({ username, is_admin: true, is_active: true }).first();
    if (!emp) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, emp.password_hash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const payload = { sub: emp.id, role: 'admin', isBnaOfficial: false, campaignId: null };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    res.json({ accessToken, refreshToken, employee: { id: emp.id, first_name: emp.first_name, last_name: emp.last_name } });
  } catch (err) { next(err); }
});

// POST /api/auth/select-campaign
router.post('/select-campaign', verifyToken, [
  body('campaign_id').isInt()
], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    if (!req.user.isBnaOfficial) return res.status(403).json({ error: 'Not a BnA official' });
    const { campaign_id } = req.body;
    const campaign = await db('campaigns').where({ id: campaign_id, is_active: true }).first();
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    const payload = { sub: req.user.sub, role: 'employee', isBnaOfficial: true, campaignId: parseInt(campaign_id) };
    const accessToken = signAccess(payload);
    const refreshToken = signRefresh(payload);
    res.json({ accessToken, refreshToken, campaign });
  } catch (err) { next(err); }
});

// POST /api/auth/refresh
router.post('/refresh', [body('refreshToken').notEmpty()], async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
  try {
    const { refreshToken } = req.body;
    const decoded = jwt.verify(refreshToken, jwtConfig.refreshSecret);
    const payload = { sub: decoded.sub, role: decoded.role, isBnaOfficial: decoded.isBnaOfficial, campaignId: decoded.campaignId };
    const accessToken = signAccess(payload);
    const newRefreshToken = signRefresh(payload);
    res.json({ accessToken, refreshToken: newRefreshToken });
  } catch (err) {
    return res.status(401).json({ error: 'Invalid refresh token' });
  }
});

module.exports = router;
