const multer = require('multer');
const path = require('path');
const fs = require('fs');

const UPLOAD_DIR = process.env.UPLOAD_DIR || './uploads';
const ALLOWED_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

function createStorage(subdir) {
  return multer.diskStorage({
    destination: (req, file, cb) => {
      const dir = path.join(UPLOAD_DIR, subdir);
      fs.mkdirSync(dir, { recursive: true });
      cb(null, dir);
    },
    filename: (req, file, cb) => {
      const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, unique + path.extname(file.originalname));
    }
  });
}

function fileFilter(req, file, cb) {
  if (ALLOWED_TYPES.includes(file.mimetype)) cb(null, true);
  else cb(new Error('Invalid file type. Only PDF, JPG, PNG allowed.'), false);
}

const documentUpload = multer({
  storage: createStorage('documents'),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

const photoUpload = multer({
  storage: createStorage('activations'),
  fileFilter,
  limits: { fileSize: MAX_SIZE }
});

module.exports = { documentUpload, photoUpload };
