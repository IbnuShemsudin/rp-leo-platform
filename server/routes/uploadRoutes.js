const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload"); // Ensure this path is correct

// This defines the endpoint: POST http://localhost:5000/api/upload/
router.post("/", upload.single("file"), (req, res) => {
  try {
    // 1. Check if the file was actually uploaded by Multer
    if (!req.file) {
      return res.status(400).json({ message: "No file uplinked. Check field name." });
    }

    // 2. Send back the file data to the frontend
    res.json({
      message: "File uploaded successfully",
      file: {
        filename: req.file.filename,
        path: req.file.path,
        size: req.file.size
      }
    });
  } catch (error) {
    console.error("Upload Route Error:", error);
    res.status(500).json({ message: "Server error during upload processing" });
  }
});

module.exports = router;