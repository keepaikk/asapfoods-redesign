import { Router } from 'express';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import multer from 'multer';
import { randomUUID } from 'crypto';
import path from 'path';
import fs from 'fs';

const router = Router();

function getS3Client() {
  return new S3Client({
    region: 'auto',
    endpoint: process.env.R2_ENDPOINT || '',
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY || '',
    },
  });
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const bucket = process.env.R2_BUCKET_NAME || '';
    const publicUrl = process.env.R2_PUBLIC_URL || '';
    const hasR2Creds = !!(
      process.env.R2_ACCESS_KEY_ID &&
      !process.env.R2_ACCESS_KEY_ID.includes('your_') &&
      process.env.R2_SECRET_ACCESS_KEY &&
      !process.env.R2_SECRET_ACCESS_KEY.includes('your_') &&
      process.env.R2_ENDPOINT &&
      bucket
    );

    const ext = path.extname(req.file.originalname) || '.jpg';
    const key = `${randomUUID()}${ext}`;

    if (hasR2Creds) {
      // Upload to R2
      await getS3Client().send(
        new PutObjectCommand({
          Bucket: bucket,
          Key: key,
          Body: req.file.buffer,
          ContentType: req.file.mimetype,
        })
      );

      const url = publicUrl
        ? `${publicUrl}/${key}`
        : `${process.env.R2_ENDPOINT}/${bucket}/${key}`;
      return res.json({ url });
    }

    // Fallback: save locally for dev/testing
    const uploadsDir = path.join(process.cwd(), 'uploads', 'menu');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }
    const localPath = path.join(uploadsDir, key);
    fs.writeFileSync(localPath, req.file.buffer);

    const url = `${process.env.APP_URL || 'http://localhost:3001'}/uploads/menu/${key}`;
    res.json({ url });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Upload failed' });
  }
});

export default router;
