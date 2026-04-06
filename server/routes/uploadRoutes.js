const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");

// POST: http://localhost:5000/api/upload
router.post("/", upload.single("file"), (req, res) => {
  try {
    // Debugging: This will show in your terminal
    console.log("Uplink Request Received. File:", req.file ? req.file.originalname : "NULL");

    if (!req.file) {
      return res.status(400).json({ message: "No file uplinked. Check field name." });
    }

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