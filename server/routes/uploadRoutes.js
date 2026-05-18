import express from "express";
import multer from "multer";
import path from "path";

const router = express.Router();

/*
========================
 MULTER STORAGE
========================
*/

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },

  filename: (req, file, cb) => {
    const uniqueName =
      Date.now() +
      "-" +
      file.originalname.replace(/\s+/g, "-");

    cb(null, uniqueName);
  },
});

const upload = multer({
  storage,

  fileFilter: (req, file, cb) => {
    if (file.mimetype !== "application/pdf") {
      return cb(new Error("Only PDF files allowed"));
    }

    cb(null, true);
  },
});

/*
========================
 UPLOAD ROUTE
========================
*/

router.post(
  "/pdf",
  upload.single("file"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          success: false,
          msg: "No file uploaded",
        });
      }

      console.log("📄 Uploaded File:", req.file);

      res.json({
        success: true,

        file: {
          filename: req.file.filename,
          originalname: req.file.originalname,
          path: req.file.path,
          url: `/uploads/${req.file.filename}`,
        },
      });
    } catch (error) {
      console.error(error);

      res.status(500).json({
        success: false,
        msg: error.message,
      });
    }
  }
);

export default router;