// middlewares/uploadPaymentProof.js
import multer from 'multer';
import cloudinary from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';

const storage = new CloudinaryStorage({
  cloudinary: cloudinary.v2,
  params: (req, file) => {
    // Detect resource type from mimetype
    const isPdf = file.mimetype === 'application/pdf';

    return {
      folder: 'coursvault/payment-proofs',
      resource_type: isPdf ? 'raw' : 'image',
      // Keep the original image — no cropping, no resizing
      // Only auto-optimize format + quality
      transformation: isPdf
        ? undefined
        : [{ quality: 'auto:good', fetch_format: 'auto' }],
      // Unique filename for easy admin scanning
      public_id: `proof-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      // Accept any format Cloudinary can read
      allowed_formats: [
        'jpg', 'jpeg', 'png', 'webp', 'gif',
        'heic', 'heif', 'avif', 'bmp', 'tiff', 'tif',
        'svg', 'ico',
        'pdf'
      ]
    };
  }
});

const fileFilter = (req, file, cb) => {
  // Accept anything that starts with image/ OR is a PDF
  const isImage = file.mimetype.startsWith('image/');
  const isPdf = file.mimetype === 'application/pdf';

  if (isImage || isPdf) {
    return cb(null, true);
  }

  return cb(
    new Error('Only image files (jpg, png, webp, heic, etc.) or PDF are allowed'),
    false
  );
};

const uploadPaymentProofMiddleware = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10 MB — phone screenshots can be big
  }
});

export default uploadPaymentProofMiddleware;