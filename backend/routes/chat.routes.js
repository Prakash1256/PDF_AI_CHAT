const express = require("express");
const multer = require("multer");
const { uploadPdf, getChatResponse } = require("../controllers/chatController");

const router = express.Router();

// configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// route
router.post("/upload", upload.single("file"), uploadPdf);
router.post("/chat", getChatResponse);

module.exports = router;
