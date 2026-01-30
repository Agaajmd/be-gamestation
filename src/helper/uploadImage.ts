import multer from "multer";

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, "uploads/payment-proofs/");
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now();
    cb(null, `${timestamp}-${file.originalname}`);
  },
});

export const uploadImage = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB max
  fileFilter: (_req, file, cb) => {
    // Accept image files only
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});