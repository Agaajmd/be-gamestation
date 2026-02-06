import multer from "multer";
import fs from "fs";

const uploadDirs = [
  "uploads/payment-proofs",
  "uploads/payment-qrcodes",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

const storage = multer.diskStorage({
  destination: (req, _file, cb) => {
    if (req.baseUrl.includes("branch-payment-methods")) {
      cb(null, "uploads/payment-qrcodes/");
    } else {
      cb(null, "uploads/payment-proofs/");
    }
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
