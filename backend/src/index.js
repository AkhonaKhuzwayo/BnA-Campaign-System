require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const path = require('path');
const fs = require('fs');

const { verifyToken, attachUser, requireAdmin } = require('./middleware/auth');

const authRoutes = require('./routes/auth');
const employeeRoutes = require('./routes/employee');
const clockRoutes = require('./routes/clock');
const activationRoutes = require('./routes/activations');
const adminEmployeeRoutes = require('./routes/admin/employees');
const adminDocRoutes = require('./routes/admin/documents');
const adminLogRoutes = require('./routes/admin/logs');
const adminReportRoutes = require('./routes/admin/reports');
const adminCampaignRoutes = require('./routes/admin/campaigns');

const app = express();
const PORT = process.env.PORT || 5000;

const uploadDir = process.env.UPLOAD_DIR || './uploads';
fs.mkdirSync(uploadDir, { recursive: true });

app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(cors({ origin: process.env.CORS_ORIGIN || '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 200 });
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 20, message: { error: 'Too many login attempts, try again later.' } });
app.use(limiter);

app.use('/api/auth', authLimiter, authRoutes);

app.use('/api/employee', verifyToken, attachUser, employeeRoutes);
app.use('/api/clock', verifyToken, attachUser, clockRoutes);
app.use('/api/activations', verifyToken, attachUser, activationRoutes);

const adminAuth = [verifyToken, attachUser, requireAdmin];
app.use('/api/admin/employees', adminAuth, adminEmployeeRoutes);
app.use('/api/admin/documents', adminAuth, adminDocRoutes);
app.use('/api/admin/logs', adminAuth, adminLogRoutes);
app.use('/api/admin/reports', adminAuth, adminReportRoutes);
app.use('/api/admin/campaigns', adminAuth, adminCampaignRoutes);

const frontendDist = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDist)) {
  app.use(express.static(frontendDist));
  app.get('*', (req, res) => res.sendFile(path.join(frontendDist, 'index.html')));
}

app.use((err, req, res, next) => {
  console.error(err);
  if (err.code === 'LIMIT_FILE_SIZE') return res.status(400).json({ error: 'File too large. Max 5MB.' });
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

app.listen(PORT, () => console.log(`BnA backend running on port ${PORT}`));
module.exports = app;
