import multer from "multer";
import path from "path";
import fs from "fs";

/*
CREATE UPLOADS FOLDER IF NOT EXISTS
*/

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

/*
MULTER STORAGE
*/

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});

/*
FILE FILTER
*/

const fileFilter = (req, file, cb) => {
  const allowedTypes =
    /pdf|doc|docx|jpg|jpeg|png/;

  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  );

  const mimetype = allowedTypes.test(
    file.mimetype
  );

  if (extname && mimetype) {
    return cb(null, true);
  }

  cb(
    new Error(
      "Only PDF, DOC, DOCX, JPG, JPEG, PNG files are allowed"
    )
  );
};

/*
UPLOAD CONFIG
*/

const upload = multer({
  storage: storage,

  limits: {
    fileSize: 10000000, // 10MB
  },

  fileFilter,
});

export default upload;